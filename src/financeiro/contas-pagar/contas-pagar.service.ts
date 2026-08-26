// Regras de negócio do módulo contas-pagar
import { ContasPagarRepository } from "./contas-pagar.repository";
import type { CriarContasPagarDto, AtualizarContasPagarDto } from "./contas-pagar.schema";
import type { ContasPagar } from "./contas-pagar.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class ContasPagarService {
  constructor(private readonly repo: ContasPagarRepository = new ContasPagarRepository()) {}

  async listar(): Promise<ContasPagar[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<ContasPagar> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("ContasPagar não encontrado");
    return item;
  }

  async criar(dados: CriarContasPagarDto): Promise<ContasPagar> {
    // TODO: regras de negócio específicas de contas-pagar
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarContasPagarDto): Promise<ContasPagar> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
