// Regras de negócio do módulo abertura
import { AberturaRepository } from "./abertura.repository";
import type { CriarAberturaDto, AtualizarAberturaDto } from "./abertura.schema";
import type { Abertura } from "./abertura.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class AberturaService {
  constructor(private readonly repo: AberturaRepository = new AberturaRepository()) {}

  async listar(): Promise<Abertura[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Abertura> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Abertura não encontrado");
    return item;
  }

  async criar(dados: CriarAberturaDto): Promise<Abertura> {
    // TODO: regras de negócio específicas de abertura
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarAberturaDto): Promise<Abertura> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
