// Regras de negócio do módulo saidas
import { SaidasRepository } from "./saidas.repository";
import type { CriarSaidasDto, AtualizarSaidasDto } from "./saidas.schema";
import type { Saidas } from "./saidas.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class SaidasService {
  constructor(private readonly repo: SaidasRepository = new SaidasRepository()) {}

  async listar(): Promise<Saidas[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Saidas> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Saidas não encontrado");
    return item;
  }

  async criar(dados: CriarSaidasDto): Promise<Saidas> {
    // TODO: regras de negócio específicas de saidas
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarSaidasDto): Promise<Saidas> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
