// Regras de negócio do módulo compras
import { ComprasRepository } from "./compras.repository";
import type { CriarComprasDto, AtualizarComprasDto } from "./compras.schema";
import type { Compras } from "./compras.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class ComprasService {
  constructor(private readonly repo: ComprasRepository = new ComprasRepository()) {}

  async listar(): Promise<Compras[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Compras> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Compras não encontrado");
    return item;
  }

  async criar(dados: CriarComprasDto): Promise<Compras> {
    // TODO: regras de negócio específicas de compras
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarComprasDto): Promise<Compras> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
