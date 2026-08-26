// Regras de negócio do módulo movimentos
import { MovimentosRepository } from "./movimentos.repository";
import type { CriarMovimentosDto, AtualizarMovimentosDto } from "./movimentos.schema";
import type { Movimentos } from "./movimentos.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class MovimentosService {
  constructor(private readonly repo: MovimentosRepository = new MovimentosRepository()) {}

  async listar(): Promise<Movimentos[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Movimentos> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Movimentos não encontrado");
    return item;
  }

  async criar(dados: CriarMovimentosDto): Promise<Movimentos> {
    // TODO: regras de negócio específicas de movimentos
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarMovimentosDto): Promise<Movimentos> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
