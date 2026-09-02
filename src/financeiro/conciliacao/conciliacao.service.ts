import { ConciliacaoRepository } from "./conciliacao.repository";
import { FluxoCaixaRepository } from "../fluxo-caixa/fluxo-caixa.repository";
import type { CriarConciliacaoDto } from "./conciliacao.schema";
import type { ConciliacaoBancaria } from "./conciliacao.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class ConciliacaoService {
  constructor(
    private readonly repo: ConciliacaoRepository = new ConciliacaoRepository(),
    private readonly fluxoCaixaRepo: FluxoCaixaRepository = new FluxoCaixaRepository()
  ) {}

  async listar(): Promise<ConciliacaoBancaria[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<ConciliacaoBancaria> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Conciliação não encontrada");
    return item;
  }

  async realizarConciliacao(dados: CriarConciliacaoDto): Promise<ConciliacaoBancaria> {
    const relatorioFluxo = await this.fluxoCaixaRepo.gerarRelatorio({
      lojaId: dados.lojaId,
    });

    const saldoSistema = relatorioFluxo.saldoLiquido;

    return this.repo.criar({
      lojaId: dados.lojaId,
      data: new Date(),
      saldoExtrato: dados.saldoExtrato,
      saldoSistema,
      observacao: dados.observacao,
    });
  }
}
