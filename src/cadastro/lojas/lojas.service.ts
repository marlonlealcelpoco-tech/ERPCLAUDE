// Regras de negócio do módulo lojas
import { LojasRepository } from "./lojas.repository";
import type { CriarLojasDto, AtualizarLojasDto } from "./lojas.schema";
import type { Lojas } from "./lojas.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class LojasService {
  constructor(private readonly repo: LojasRepository = new LojasRepository()) {}

  async listar(): Promise<Lojas[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Lojas> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Lojas não encontrado");
    return item;
  }

  async criar(dados: CriarLojasDto): Promise<Lojas> {
    // TODO: regras de negócio específicas de lojas
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarLojasDto): Promise<Lojas> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
