// Regras de negócio do módulo avarias
import { AvariasRepository } from "./avarias.repository";
import type { CriarAvariasDto, AtualizarAvariasDto } from "./avarias.schema";
import type { Avarias } from "./avarias.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class AvariasService {
  constructor(private readonly repo: AvariasRepository = new AvariasRepository()) {}

  async listar(): Promise<Avarias[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Avarias> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Avarias não encontrado");
    return item;
  }

  async criar(dados: CriarAvariasDto): Promise<Avarias> {
    // TODO: regras de negócio específicas de avarias
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarAvariasDto): Promise<Avarias> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
