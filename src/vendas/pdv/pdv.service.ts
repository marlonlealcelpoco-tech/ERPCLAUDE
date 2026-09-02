import { PdvRepository } from "./pdv.repository";
import { AberturaRepository } from "../../caixa/abertura/abertura.repository";
import { ProdutosRepository } from "../../cadastro/produtos/produtos.repository";
import { ClientesRepository } from "../../cadastro/clientes/clientes.repository";
import { ContasAPrazoRepository } from "../contas-a-prazo/contas-a-prazo.repository";
import type { CriarPdvDto } from "./pdv.schema";
import type { VendaPDV, ItemVenda } from "./pdv.types";
import { NotFoundError, ValidationError } from "../../shared/errors/app-error";

export class PdvService {
  constructor(
    private readonly repo: PdvRepository = new PdvRepository(),
    private readonly aberturaRepo: AberturaRepository = new AberturaRepository(),
    private readonly produtosRepo: ProdutosRepository = new ProdutosRepository(),
    private readonly clientesRepo: ClientesRepository = new ClientesRepository(),
    private readonly contasAPrazoRepo: ContasAPrazoRepository = new ContasAPrazoRepository()
  ) {}

  async listar(): Promise<VendaPDV[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<VendaPDV> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Venda não encontrada");
    return item;
  }

  async realizarVenda(vendedorId: string, lojaId: string, dados: CriarPdvDto): Promise<VendaPDV> {
    const caixaAberto = await this.aberturaRepo.buscarCaixaAbertoPorUsuario(vendedorId);
    if (!caixaAberto) {
      throw new ValidationError("Nenhum caixa aberto para este vendedor");
    }

    if (dados.formaPagamento === "a_prazo" && !dados.clienteId) {
      throw new ValidationError("Venda a prazo requer identificação do cliente");
    }

    let cliente = null;
    if (dados.clienteId) {
      cliente = await this.clientesRepo.buscarPorId(dados.clienteId);
      if (!cliente) {
        throw new NotFoundError("Cliente informado não foi encontrado");
      }
    }

    const itensProcessados: ItemVenda[] = [];
    let valorTotalVenda = 0;

    for (const itemInput of dados.itens) {
      const produto = await this.produtosRepo.buscarPorId(itemInput.produtoId);
      if (!produto) {
        throw new NotFoundError(`Produto ${itemInput.produtoId} não encontrado`);
      }
      if (!produto.ativo) {
        throw new ValidationError(`Produto ${produto.nome} está inativo`);
      }
      if (produto.estoqueAtual < itemInput.quantidade) {
        throw new ValidationError(`Estoque insuficiente para o produto ${produto.nome}`);
      }

      const valorTotalItem = produto.precoVenda * itemInput.quantidade;
      valorTotalVenda += valorTotalItem;

      itensProcessados.push({
        produtoId: produto.id,
        nomeProduto: produto.nome,
        quantidade: itemInput.quantidade,
        precoUnitario: produto.precoVenda,
        valorTotal: valorTotalItem,
      });

      // Baixa no estoque
      await this.produtosRepo.atualizar(produto.id, {
        estoqueAtual: produto.estoqueAtual - itemInput.quantidade,
      });
    }

    const agora = new Date();
    const novaVenda: VendaPDV = {
      id: `vnd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      caixaId: caixaAberto.id,
      vendedorId,
      lojaId,
      clienteId: dados.clienteId,
      itens: itensProcessados,
      formaPagamento: dados.formaPagamento,
      valorTotal: valorTotalVenda,
      status: "concluida",
      comNfce: dados.comNfce ?? false,
      criadoEm: agora,
    };

    const vendaSalva = await this.repo.criar(novaVenda);

    // Se for venda a prazo, gera conta a receber vinculada ao cliente
    if (dados.formaPagamento === "a_prazo" && cliente) {
      await this.contasAPrazoRepo.criar({
        vendaId: vendaSalva.id,
        clienteId: cliente.id,
        lojaId,
        valorOriginal: valorTotalVenda,
      });

      await this.clientesRepo.atualizar(cliente.id, {
        saldoDevedor: (cliente.saldoDevedor || 0) + valorTotalVenda,
      });
    }

    return vendaSalva;
  }
}
