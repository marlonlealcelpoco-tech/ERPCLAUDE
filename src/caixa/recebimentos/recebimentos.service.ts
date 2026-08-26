// Regras de negócio do módulo recebimentos
import { RecebimentosRepository } from "./recebimentos.repository";
import type { CriarRecebimentosDto, AtualizarRecebimentosDto } from "./recebimentos.schema";
import type { Recebimentos } from "./recebimentos.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class RecebimentosService {
  constructor(private readonly repo: RecebimentosRepository = new RecebimentosRepository()) {}

  async listar(): Promise<Recebimentos[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Recebimentos> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Recebimentos não encontrado");
    return item;
  }

  async criar(dados: CriarRecebimentosDto): Promise<Recebimentos> {
    // TODO: regras de negócio específicas de recebimentos
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarRecebimentosDto): Promise<Recebimentos> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
