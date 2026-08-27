import { EntradasRepository } from "./entradas.repository";
import { ProdutosRepository } from "../../cadastro/produtos/produtos.repository";
import type { CriarEntradasDto } from "./entradas.schema";
import type { EntradaEstoque } from "./entradas.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class EntradasService {
  constructor(
    private readonly repo: EntradasRepository = new EntradasRepository(),
    private readonly produtosRepo: ProdutosRepository = new ProdutosRepository()
  ) {}

  async listar(): Promise<EntradaEstoque[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<EntradaEstoque> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Entrada de estoque não encontrada");
    return item;
  }

  async registrarEntrada(usuarioId: string, dados: CriarEntradasDto): Promise<EntradaEstoque> {
    const produto = await this.produtosRepo.buscarPorId(dados.produtoId);
    if (!produto) {
      throw new NotFoundError("Produto não encontrado");
    }

    await this.produtosRepo.atualizar(produto.id, {
      estoqueAtual: produto.estoqueAtual + dados.quantidade,
    });

    return this.repo.criar({
      produtoId: dados.produtoId,
      quantidade: dados.quantidade,
      observacao: dados.observacao,
      usuarioId,
    });
  }
}
