// Regras de negócio do módulo pdv
import { PdvRepository } from "./pdv.repository";
import type { CriarPdvDto, AtualizarPdvDto } from "./pdv.schema";
import type { Pdv } from "./pdv.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class PdvService {
  constructor(private readonly repo: PdvRepository = new PdvRepository()) {}

  async listar(): Promise<Pdv[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Pdv> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Pdv não encontrado");
    return item;
  }

  async criar(dados: CriarPdvDto): Promise<Pdv> {
    // TODO: regras de negócio específicas de pdv
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarPdvDto): Promise<Pdv> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
