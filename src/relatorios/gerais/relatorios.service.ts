// Regras de negócio do módulo relatorios
import { RelatoriosRepository } from "./relatorios.repository";
import type { CriarRelatoriosDto, AtualizarRelatoriosDto } from "./relatorios.schema";
import type { Relatorios } from "./relatorios.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class RelatoriosService {
  constructor(private readonly repo: RelatoriosRepository = new RelatoriosRepository()) {}

  async listar(): Promise<Relatorios[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Relatorios> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Relatorios não encontrado");
    return item;
  }

  async criar(dados: CriarRelatoriosDto): Promise<Relatorios> {
    // TODO: regras de negócio específicas de relatorios
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarRelatoriosDto): Promise<Relatorios> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
