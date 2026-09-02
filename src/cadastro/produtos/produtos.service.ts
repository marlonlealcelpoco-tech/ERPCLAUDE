import { ProdutosRepository } from "./produtos.repository";
import type { CriarProdutosDto, AtualizarProdutosDto } from "./produtos.schema";
import type { Produto } from "./produtos.types";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error";

export class ProdutosService {
  constructor(private readonly repo: ProdutosRepository = new ProdutosRepository()) {}

  async listar(termo?: string): Promise<Produto[]> {
    if (termo) {
      return this.repo.buscarPorTermo(termo);
    }
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Produto> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Produto não encontrado");
    return item;
  }

  async criar(dados: CriarProdutosDto): Promise<Produto> {
    if (dados.codigoBarras) {
      const existente = await this.repo.buscarPorCodigoBarras(dados.codigoBarras);
      if (existente) {
        throw new ConflictError("Já existe um produto cadastrado com este código de barras");
      }
    }
    return this.repo.criar(dados);
  }

  async atualizar(id: string, dados: AtualizarProdutosDto): Promise<Produto> {
    await this.buscarPorId(id);
    if (dados.codigoBarras) {
      const existente = await this.repo.buscarPorCodigoBarras(dados.codigoBarras);
      if (existente && existente.id !== id) {
        throw new ConflictError("Já existe outro produto cadastrado com este código de barras");
      }
    }
    return this.repo.atualizar(id, dados);
  }
}
