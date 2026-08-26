// Regras de negócio do módulo notas
import { NotasRepository } from "./notas.repository";
import type { CriarNotasDto, AtualizarNotasDto } from "./notas.schema";
import type { Notas } from "./notas.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class NotasService {
  constructor(private readonly repo: NotasRepository = new NotasRepository()) {}

  async listar(): Promise<Notas[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Notas> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Notas não encontrado");
    return item;
  }

  async criar(dados: CriarNotasDto): Promise<Notas> {
    // TODO: regras de negócio específicas de notas
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarNotasDto): Promise<Notas> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
