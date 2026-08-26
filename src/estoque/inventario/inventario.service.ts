// Regras de negócio do módulo inventario
import { InventarioRepository } from "./inventario.repository";
import type { CriarInventarioDto, AtualizarInventarioDto } from "./inventario.schema";
import type { Inventario } from "./inventario.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class InventarioService {
  constructor(private readonly repo: InventarioRepository = new InventarioRepository()) {}

  async listar(): Promise<Inventario[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Inventario> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Inventario não encontrado");
    return item;
  }

  async criar(dados: CriarInventarioDto): Promise<Inventario> {
    // TODO: regras de negócio específicas de inventario
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarInventarioDto): Promise<Inventario> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
