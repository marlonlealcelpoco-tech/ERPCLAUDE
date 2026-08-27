import { SaidasRepository } from "./saidas.repository";
import { ProdutosRepository } from "../../cadastro/produtos/produtos.repository";
import type { CriarSaidasDto } from "./saidas.schema";
import type { SaidaEstoque } from "./saidas.types";
import { NotFoundError, ValidationError } from "../../shared/errors/app-error";

export class SaidasService {
  constructor(
    private readonly repo: SaidasRepository = new SaidasRepository(),
    private readonly produtosRepo: ProdutosRepository = new ProdutosRepository()
  ) {}

  async listar(): Promise<SaidaEstoque[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<SaidaEstoque> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Saída de estoque não encontrada");
    return item;
  }

  async registrarSaida(usuarioId: string, dados: CriarSaidasDto): Promise<SaidaEstoque> {
    const produto = await this.produtosRepo.buscarPorId(dados.produtoId);
    if (!produto) {
      throw new NotFoundError("Produto não encontrado");
    }

    if (produto.estoqueAtual < dados.quantidade) {
      throw new ValidationError(`Estoque insuficiente para o produto ${produto.nome}`);
    }

    await this.produtosRepo.atualizar(produto.id, {
      estoqueAtual: produto.estoqueAtual - dados.quantidade,
    });

    return this.repo.criar({
      produtoId: dados.produtoId,
      quantidade: dados.quantidade,
      motivo: dados.motivo,
      usuarioId,
    });
  }
}
