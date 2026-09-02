import { InventarioRepository } from "./inventario.repository";
import { ProdutosRepository } from "../../cadastro/produtos/produtos.repository";
import type { CriarInventarioDto } from "./inventario.schema";
import type { InventarioEstoque, ItemInventario } from "./inventario.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class InventarioService {
  constructor(
    private readonly repo: InventarioRepository = new InventarioRepository(),
    private readonly produtosRepo: ProdutosRepository = new ProdutosRepository()
  ) {}

  async listar(): Promise<InventarioEstoque[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<InventarioEstoque> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Inventário não encontrado");
    return item;
  }

  async realizarInventario(usuarioId: string, lojaId: string, dados: CriarInventarioDto): Promise<InventarioEstoque> {
    const itensProcessados: ItemInventario[] = [];

    for (const itemInput of dados.itens) {
      const produto = await this.produtosRepo.buscarPorId(itemInput.produtoId);
      if (!produto) {
        throw new NotFoundError(`Produto ${itemInput.produtoId} não encontrado`);
      }

      const quantidadeSistema = produto.estoqueAtual;
      const diferenca = itemInput.quantidadeContada - quantidadeSistema;

      itensProcessados.push({
        produtoId: produto.id,
        nomeProduto: produto.nome,
        quantidadeSistema,
        quantidadeContada: itemInput.quantidadeContada,
        diferenca,
      });

      // Atualiza o estoque no cadastro de produtos com a contagem real auditada
      await this.produtosRepo.atualizar(produto.id, {
        estoqueAtual: itemInput.quantidadeContada,
      });
    }

    return this.repo.criar({
      usuarioId,
      lojaId,
      itens: itensProcessados,
      observacao: dados.observacao,
    });
  }
}
