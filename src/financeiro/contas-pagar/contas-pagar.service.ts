import { ContasPagarRepository } from "./contas-pagar.repository";
import type { CriarContasPagarDto, BaixarContasPagarDto } from "./contas-pagar.schema";
import type { ContaPagar } from "./contas-pagar.types";
import { NotFoundError, ForbiddenError, ValidationError } from "../../shared/errors/app-error";

export class ContasPagarService {
  constructor(private readonly repo: ContasPagarRepository = new ContasPagarRepository()) {}

  async listar(): Promise<ContaPagar[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<ContaPagar> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Conta a pagar não encontrada");
    return item;
  }

  async criar(dados: CriarContasPagarDto): Promise<ContaPagar> {
    return this.repo.criar({
      ...dados,
      dataVencimento: new Date(dados.dataVencimento),
    });
  }

  async baixar(id: string, usuarioPerfil: string, dados: BaixarContasPagarDto): Promise<ContaPagar> {
    const perfisPermitidos = ["financeiro", "administrador"];
    if (!perfisPermitidos.includes(usuarioPerfil)) {
      throw new ForbiddenError("Baixa de contas a pagar é permitida somente para Financeiro ou Administrador");
    }

    const conta = await this.buscarPorId(id);
    if (conta.status === "pago") {
      throw new ValidationError("Esta conta a pagar já está totalmente quitada");
    }

    return this.repo.baixar(id, dados);
  }
}
