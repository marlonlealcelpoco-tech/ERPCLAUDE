import { ContasReceberRepository } from "./contas-receber.repository";
import type { DemonstrativoContasReceber } from "./contas-receber.types";
import { ForbiddenError } from "../../shared/errors/app-error";

export class ContasReceberService {
  constructor(private readonly repo: ContasReceberRepository = new ContasReceberRepository()) {}

  async obterDemonstrativo(): Promise<DemonstrativoContasReceber> {
    return this.repo.obterDemonstrativo();
  }

  async tentarBaixarDireto(): Promise<never> {
    throw new ForbiddenError(
      "Baixa de contas a receber é permitida SOMENTE pelo caixa (módulo /caixa/recebimentos)."
    );
  }
}
