// Regras de negócio do módulo dre
import { DreRepository } from "./dre.repository";
import type { CriarDreDto, AtualizarDreDto } from "./dre.schema";
import type { Dre } from "./dre.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class DreService {
  constructor(private readonly repo: DreRepository = new DreRepository()) {}

  async listar(): Promise<Dre[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Dre> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Dre não encontrado");
    return item;
  }

  async criar(dados: CriarDreDto): Promise<Dre> {
    // TODO: regras de negócio específicas de dre
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarDreDto): Promise<Dre> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
