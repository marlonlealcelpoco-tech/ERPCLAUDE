// Regras de negócio do módulo devolucoes
import { DevolucoesRepository } from "./devolucoes.repository";
import type { CriarDevolucoesDto, AtualizarDevolucoesDto } from "./devolucoes.schema";
import type { Devolucoes } from "./devolucoes.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class DevolucoesService {
  constructor(private readonly repo: DevolucoesRepository = new DevolucoesRepository()) {}

  async listar(): Promise<Devolucoes[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Devolucoes> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Devolucoes não encontrado");
    return item;
  }

  async criar(dados: CriarDevolucoesDto): Promise<Devolucoes> {
    // TODO: regras de negócio específicas de devolucoes
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarDevolucoesDto): Promise<Devolucoes> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
