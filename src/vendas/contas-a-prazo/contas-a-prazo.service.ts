import { ContasAPrazoRepository } from "./contas-a-prazo.repository";
import type { CriarContasAPrazoDto, AtualizarContasAPrazoDto } from "./contas-a-prazo.schema";
import type { ContaAPrazo } from "./contas-a-prazo.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class ContasAPrazoService {
  constructor(private readonly repo: ContasAPrazoRepository = new ContasAPrazoRepository()) {}

  async listar(): Promise<ContaAPrazo[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<ContaAPrazo> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Conta a prazo não encontrada");
    return item;
  }

  async criar(dados: CriarContasAPrazoDto): Promise<ContaAPrazo> {
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarContasAPrazoDto): Promise<ContaAPrazo> {
    const conta = await this.buscarPorId(id);
    if (dados.valorSaldo !== undefined) {
      return this.repo.atualizarSaldo(conta.id, dados.valorSaldo);
    }
    return conta;
  }
}
