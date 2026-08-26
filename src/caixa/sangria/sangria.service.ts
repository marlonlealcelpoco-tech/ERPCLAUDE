// Regras de negócio do módulo sangria
import { SangriaRepository } from "./sangria.repository";
import type { CriarSangriaDto, AtualizarSangriaDto } from "./sangria.schema";
import type { Sangria } from "./sangria.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class SangriaService {
  constructor(private readonly repo: SangriaRepository = new SangriaRepository()) {}

  async listar(): Promise<Sangria[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Sangria> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Sangria não encontrado");
    return item;
  }

  async criar(dados: CriarSangriaDto): Promise<Sangria> {
    // TODO: regras de negócio específicas de sangria
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarSangriaDto): Promise<Sangria> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
