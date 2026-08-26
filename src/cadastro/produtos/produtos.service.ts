// Regras de negócio do módulo produtos
import { ProdutosRepository } from "./produtos.repository";
import type { CriarProdutosDto, AtualizarProdutosDto } from "./produtos.schema";
import type { Produtos } from "./produtos.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class ProdutosService {
  constructor(private readonly repo: ProdutosRepository = new ProdutosRepository()) {}

  async listar(): Promise<Produtos[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Produtos> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Produtos não encontrado");
    return item;
  }

  async criar(dados: CriarProdutosDto): Promise<Produtos> {
    // TODO: regras de negócio específicas de produtos
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarProdutosDto): Promise<Produtos> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
