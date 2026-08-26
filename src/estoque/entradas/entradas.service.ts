// Regras de negócio do módulo entradas
import { EntradasRepository } from "./entradas.repository";
import type { CriarEntradasDto, AtualizarEntradasDto } from "./entradas.schema";
import type { Entradas } from "./entradas.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class EntradasService {
  constructor(private readonly repo: EntradasRepository = new EntradasRepository()) {}

  async listar(): Promise<Entradas[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Entradas> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Entradas não encontrado");
    return item;
  }

  async criar(dados: CriarEntradasDto): Promise<Entradas> {
    // TODO: regras de negócio específicas de entradas
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarEntradasDto): Promise<Entradas> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
