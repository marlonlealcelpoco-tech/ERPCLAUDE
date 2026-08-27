import { RelatoriosRepository } from "./relatorios.repository";
import type { FiltroRelatorioGeralDto } from "./relatorios.schema";
import type { RelatorioGeralConsolidado } from "./relatorios.types";

export class RelatoriosService {
  constructor(private readonly repo: RelatoriosRepository = new RelatoriosRepository()) {}

  async gerarRelatorioGeral(filtro: FiltroRelatorioGeralDto): Promise<RelatorioGeralConsolidado> {
    return this.repo.gerarRelatorioGeral({
      lojaId: filtro.lojaId,
      dataInicio: filtro.dataInicio ? new Date(filtro.dataInicio) : undefined,
      dataFim: filtro.dataFim ? new Date(filtro.dataFim) : undefined,
    });
  }
}
