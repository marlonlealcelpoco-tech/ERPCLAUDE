// Regras de negócio do módulo ajustes
import { AjustesRepository } from "./ajustes.repository";
import type { CriarAjustesDto, AtualizarAjustesDto } from "./ajustes.schema";
import type { Ajustes } from "./ajustes.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class AjustesService {
  constructor(private readonly repo: AjustesRepository = new AjustesRepository()) {}

  async listar(): Promise<Ajustes[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Ajustes> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Ajustes não encontrado");
    return item;
  }

  async criar(dados: CriarAjustesDto): Promise<Ajustes> {
    // TODO: regras de negócio específicas de ajustes
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarAjustesDto): Promise<Ajustes> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
