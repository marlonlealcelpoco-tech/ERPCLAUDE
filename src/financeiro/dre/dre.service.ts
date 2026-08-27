import { DreRepository } from "./dre.repository";
import type { FiltroDreDto } from "./dre.schema";
import type { DemonstrativoResultado } from "./dre.types";

export class DreService {
  constructor(private readonly repo: DreRepository = new DreRepository()) {}

  async calcularDre(filtro: FiltroDreDto): Promise<DemonstrativoResultado> {
    return this.repo.calcularDre({
      lojaId: filtro.lojaId,
      dataInicio: filtro.dataInicio ? new Date(filtro.dataInicio) : undefined,
      dataFim: filtro.dataFim ? new Date(filtro.dataFim) : undefined,
    });
  }
}
