import { LojasRepository } from "./lojas.repository";
import type { CriarLojasDto, AtualizarLojasDto } from "./lojas.schema";
import type { Loja } from "./lojas.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class LojasService {
  constructor(private readonly repo: LojasRepository = new LojasRepository()) {}

  async listar(): Promise<Loja[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Loja> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Loja não encontrada");
    return item;
  }

  async criar(dados: CriarLojasDto): Promise<Loja> {
    return this.repo.criar(dados);
  }

  async atualizar(id: string, dados: AtualizarLojasDto): Promise<Loja> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados);
  }
}
