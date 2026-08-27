import { ComprasRepository } from "./compras.repository";
import { ProdutosRepository } from "../../cadastro/produtos/produtos.repository";
import { FornecedoresRepository } from "../../cadastro/fornecedores/fornecedores.repository";
import { ContasPagarRepository } from "../../financeiro/contas-pagar/contas-pagar.repository";
import type { CriarComprasDto } from "./compras.schema";
import type { Compra, ItemCompra } from "./compras.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class ComprasService {
  constructor(
    private readonly repo: ComprasRepository = new ComprasRepository(),
    private readonly produtosRepo: ProdutosRepository = new ProdutosRepository(),
    private readonly fornecedoresRepo: FornecedoresRepository = new FornecedoresRepository(),
    private readonly contasPagarRepo: ContasPagarRepository = new ContasPagarRepository()
  ) {}

  async listar(): Promise<Compra[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Compra> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Compra não encontrada");
    return item;
  }

  async realizarCompra(usuarioId: string, dados: CriarComprasDto): Promise<Compra> {
    const fornecedor = await this.fornecedoresRepo.buscarPorId(dados.fornecedorId);
    if (!fornecedor) {
      throw new NotFoundError("Fornecedor informado não foi encontrado");
    }

    const itensProcessados: ItemCompra[] = [];
    let valorTotalCompra = 0;

    for (const itemInput of dados.itens) {
      let produto = null;

      if (itemInput.produtoId) {
        produto = await this.produtosRepo.buscarPorId(itemInput.produtoId);
      } else if (itemInput.codigoBarras) {
        produto = await this.produtosRepo.buscarPorCodigoBarras(itemInput.codigoBarras);
      }

      // Se produto não existe, cadastra produto novo
      if (!produto) {
        const precoVendaCalculado = itemInput.precoVenda || itemInput.precoCusto * 1.5;
        produto = await this.produtosRepo.criar({
          nome: itemInput.nomeProduto,
          codigoBarras: itemInput.codigoBarras,
          precoCusto: itemInput.precoCusto,
          precoVenda: precoVendaCalculado,
          estoqueAtual: 0,
          fornecedorId: fornecedor.id,
          ativo: true,
        });
      } else {
        // Atualiza preço de custo do produto e adiciona entrada no estoque
        await this.produtosRepo.atualizar(produto.id, {
          precoCusto: itemInput.precoCusto,
          estoqueAtual: produto.estoqueAtual + itemInput.quantidade,
        });
      }

      const valorTotalItem = itemInput.precoCusto * itemInput.quantidade;
      valorTotalCompra += valorTotalItem;

      itensProcessados.push({
        produtoId: produto.id,
        nomeProduto: produto.nome,
        quantidade: itemInput.quantidade,
        precoCusto: itemInput.precoCusto,
        valorTotal: valorTotalItem,
      });
    }

    const agora = new Date();
    const compraId = `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const novaCompra: Compra = {
      id: compraId,
      numeroNota: dados.numeroNota,
      fornecedorId: fornecedor.id,
      lojaId: dados.lojaId,
      tipo: dados.tipo,
      formaPagamento: dados.formaPagamento,
      numeroParcelas: dados.numeroParcelas || 1,
      valorTotal: valorTotalCompra,
      itens: itensProcessados,
      usuarioId,
      criadoEm: agora,
    };

    const compraSalva = await this.repo.criar(novaCompra);

    // Gerar Contas a Pagar automáticas
    const numeroParcelas = dados.formaPagamento === "a_prazo" ? dados.numeroParcelas || 1 : 1;
    const valorParcela = valorTotalCompra / numeroParcelas;
    const intervaloDias = dados.diasIntervaloParcelas || 30;

    for (let i = 1; i <= numeroParcelas; i++) {
      const dataVencimento = new Date(agora);
      if (dados.formaPagamento === "a_prazo") {
        dataVencimento.setDate(dataVencimento.getDate() + i * intervaloDias);
      }

      await this.contasPagarRepo.criar({
        compraId: compraSalva.id,
        fornecedorId: fornecedor.id,
        descricao: `Compra Nota #${dados.numeroNota} - Parcela ${i}/${numeroParcelas}`,
        valorOriginal: valorParcela,
        dataVencimento,
        lojaId: dados.lojaId,
      });
    }

    return compraSalva;
  }
}
