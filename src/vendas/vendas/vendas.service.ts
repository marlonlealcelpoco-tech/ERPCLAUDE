// Regras de negócio do módulo vendas
import { VendasRepository } from "./vendas.repository";
import type { CriarVendasDto, AtualizarVendasDto } from "./vendas.schema";
import type { Vendas } from "./vendas.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class VendasService {
  constructor(private readonly repo: VendasRepository = new VendasRepository()) {}

  async listar(): Promise<Vendas[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Vendas> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Vendas não encontrado");
    return item;
  }

  async criar(dados: CriarVendasDto): Promise<Vendas> {
    // TODO: regras de negócio específicas de vendas
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarVendasDto): Promise<Vendas> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
