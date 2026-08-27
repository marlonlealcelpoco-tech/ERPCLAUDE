import { FluxoCaixaRepository } from "./fluxo-caixa.repository";
import type { FiltroFluxoCaixaDto, CriarFluxoCaixaDto } from "./fluxo-caixa.schema";
import type { RelatorioFluxoCaixa, LancamentoFluxoCaixa } from "./fluxo-caixa.types";

export class FluxoCaixaService {
  constructor(private readonly repo: FluxoCaixaRepository = new FluxoCaixaRepository()) {}

  async gerarRelatorio(filtro: FiltroFluxoCaixaDto): Promise<RelatorioFluxoCaixa> {
    return this.repo.gerarRelatorio({
      vendedorId: filtro.vendedorId,
      lojaId: filtro.lojaId,
      dataInicio: filtro.dataInicio ? new Date(filtro.dataInicio) : undefined,
      dataFim: filtro.dataFim ? new Date(filtro.dataFim) : undefined,
    });
  }

  async registrarLancamento(dados: CriarFluxoCaixaDto): Promise<LancamentoFluxoCaixa> {
    return this.repo.registrarLancamentoManual(dados);
  }
}
