// Regras de negócio do módulo fluxo-caixa
import { FluxoCaixaRepository } from "./fluxo-caixa.repository";
import type { CriarFluxoCaixaDto, AtualizarFluxoCaixaDto } from "./fluxo-caixa.schema";
import type { FluxoCaixa } from "./fluxo-caixa.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class FluxoCaixaService {
  constructor(private readonly repo: FluxoCaixaRepository = new FluxoCaixaRepository()) {}

  async listar(): Promise<FluxoCaixa[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<FluxoCaixa> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("FluxoCaixa não encontrado");
    return item;
  }

  async criar(dados: CriarFluxoCaixaDto): Promise<FluxoCaixa> {
    // TODO: regras de negócio específicas de fluxo-caixa
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarFluxoCaixaDto): Promise<FluxoCaixa> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
