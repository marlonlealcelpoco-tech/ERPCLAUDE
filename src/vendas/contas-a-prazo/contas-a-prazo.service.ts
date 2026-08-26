// Regras de negócio do módulo contas-a-prazo
import { ContasAPrazoRepository } from "./contas-a-prazo.repository";
import type { CriarContasAPrazoDto, AtualizarContasAPrazoDto } from "./contas-a-prazo.schema";
import type { ContasAPrazo } from "./contas-a-prazo.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class ContasAPrazoService {
  constructor(private readonly repo: ContasAPrazoRepository = new ContasAPrazoRepository()) {}

  async listar(): Promise<ContasAPrazo[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<ContasAPrazo> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("ContasAPrazo não encontrado");
    return item;
  }

  async criar(dados: CriarContasAPrazoDto): Promise<ContasAPrazo> {
    // TODO: regras de negócio específicas de contas-a-prazo
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarContasAPrazoDto): Promise<ContasAPrazo> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
