// Regras de negócio do módulo nfe
import { NfeRepository } from "./nfe.repository";
import type { CriarNfeDto, AtualizarNfeDto } from "./nfe.schema";
import type { Nfe } from "./nfe.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class NfeService {
  constructor(private readonly repo: NfeRepository = new NfeRepository()) {}

  async listar(): Promise<Nfe[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Nfe> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Nfe não encontrado");
    return item;
  }

  async criar(dados: CriarNfeDto): Promise<Nfe> {
    // TODO: regras de negócio específicas de nfe
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarNfeDto): Promise<Nfe> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
