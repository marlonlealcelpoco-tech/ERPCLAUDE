// Regras de negócio do módulo contas-receber
import { ContasReceberRepository } from "./contas-receber.repository";
import type { CriarContasReceberDto, AtualizarContasReceberDto } from "./contas-receber.schema";
import type { ContasReceber } from "./contas-receber.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class ContasReceberService {
  constructor(private readonly repo: ContasReceberRepository = new ContasReceberRepository()) {}

  async listar(): Promise<ContasReceber[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<ContasReceber> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("ContasReceber não encontrado");
    return item;
  }

  async criar(dados: CriarContasReceberDto): Promise<ContasReceber> {
    // TODO: regras de negócio específicas de contas-receber
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarContasReceberDto): Promise<ContasReceber> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
