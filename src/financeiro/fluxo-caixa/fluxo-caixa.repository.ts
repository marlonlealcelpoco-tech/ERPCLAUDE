import { getLocalDb } from "../../shared/database/connection";
import { PdvRepository } from "../../vendas/pdv/pdv.repository";
import { RecebimentosRepository } from "../../caixa/recebimentos/recebimentos.repository";
import { SangriaRepository } from "../../caixa/sangria/sangria.repository";
import { ContasPagarRepository } from "../contas-pagar/contas-pagar.repository";
import { AberturaRepository } from "../../caixa/abertura/abertura.repository";
import type { LancamentoFluxoCaixa, RelatorioFluxoCaixa, FiltroFluxoCaixa } from "./fluxo-caixa.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "fluxo_caixa_manual";

export class FluxoCaixaRepository {
  constructor(
    private readonly pdvRepo: PdvRepository = new PdvRepository(),
    private readonly recebimentosRepo: RecebimentosRepository = new RecebimentosRepository(),
    private readonly sangriaRepo: SangriaRepository = new SangriaRepository(),
    private readonly contasPagarRepo: ContasPagarRepository = new ContasPagarRepository(),
    private readonly aberturaRepo: AberturaRepository = new AberturaRepository()
  ) {}

  async gerarRelatorio(filtro: FiltroFluxoCaixa): Promise<RelatorioFluxoCaixa> {
    const lancamentos: LancamentoFluxoCaixa[] = [];

    // 1. Vendas à vista
    const vendas = await this.pdvRepo.listar();
    for (const v of vendas) {
      if (v.status === "concluida" && v.formaPagamento !== "a_prazo") {
        lancamentos.push({
          id: `f_vnd_${v.id}`,
          tipo: "entrada",
          categoria: "Venda PDV",
          descricao: `Venda ${v.formaPagamento.toUpperCase()}`,
          valor: v.valorTotal,
          vendedorId: v.vendedorId,
          lojaId: v.lojaId,
          data: new Date(v.criadoEm),
        });
      }
    }

    // 2. Recebimentos de cliente
    const recebimentos = await this.recebimentosRepo.listar();
    for (const r of recebimentos) {
      const caixa = await this.aberturaRepo.buscarPorId(r.caixaId);
      const lojaId = caixa ? caixa.lojaId : "loja_local";

      lancamentos.push({
        id: `f_rec_${r.id}`,
        tipo: "entrada",
        categoria: "Recebimento Cliente",
        descricao: `Recebimento de ${r.nomeCliente}`,
        valor: r.valorRecebido,
        vendedorId: r.vendedorId,
        lojaId,
        data: new Date(r.criadoEm),
      });
    }

    // 3. Sangrias
    const sangrias = await this.sangriaRepo.listar();
    for (const s of sangrias) {
      const caixa = await this.aberturaRepo.buscarPorId(s.caixaId);
      const lojaId = caixa ? caixa.lojaId : "loja_local";

      lancamentos.push({
        id: `f_sng_${s.id}`,
        tipo: "saida",
        categoria: "Sangria",
        descricao: s.observacao || "Retirada de caixa",
        valor: s.valor,
        vendedorId: s.usuarioId,
        lojaId,
        data: new Date(s.criadoEm),
      });
    }

    // 4. Pagamentos de Contas a Pagar
    const contasPagar = await this.contasPagarRepo.listar();
    for (const cp of contasPagar) {
      if (cp.valorPago > 0 && cp.dataPagamento) {
        lancamentos.push({
          id: `f_cpag_${cp.id}`,
          tipo: "saida",
          categoria: "Pagamento Fornecedor",
          descricao: cp.descricao,
          valor: cp.valorPago,
          lojaId: cp.lojaId,
          data: new Date(cp.dataPagamento),
        });
      }
    }

    // 5. Lançamentos manuais de fluxo
    const db = getLocalDb();
    const manuais = db.find<LancamentoFluxoCaixa>(TABLE_NAME);
    lancamentos.push(...manuais);

    // Filtros por vendedor, loja, periodo
    let filtrados = lancamentos;
    if (filtro.vendedorId) {
      filtrados = filtrados.filter((l) => l.vendedorId === filtro.vendedorId);
    }
    if (filtro.lojaId) {
      filtrados = filtrados.filter((l) => l.lojaId === filtro.lojaId);
    }
    if (filtro.dataInicio) {
      filtrados = filtrados.filter((l) => new Date(l.data).getTime() >= filtro.dataInicio!.getTime());
    }
    if (filtro.dataFim) {
      filtrados = filtrados.filter((l) => new Date(l.data).getTime() <= filtro.dataFim!.getTime());
    }

    filtrados.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

    let totalEntradas = 0;
    let totalSaidas = 0;

    for (const item of filtrados) {
      if (item.tipo === "entrada") {
        totalEntradas += item.valor;
      } else {
        totalSaidas += item.valor;
      }
    }

    return {
      periodoInicio: filtro.dataInicio,
      periodoFim: filtro.dataFim,
      vendedorId: filtro.vendedorId,
      lojaId: filtro.lojaId,
      totalEntradas,
      totalSaidas,
      saldoLiquido: totalEntradas - totalSaidas,
      lancamentos: filtrados,
    };
  }

  async registrarLancamentoManual(dados: Omit<LancamentoFluxoCaixa, "id" | "data">): Promise<LancamentoFluxoCaixa> {
    const db = getLocalDb();
    const novo: LancamentoFluxoCaixa = {
      id: `flx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...dados,
      data: new Date(),
    };

    db.insert<LancamentoFluxoCaixa>(TABLE_NAME, novo);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novo,
    });

    return novo;
  }
}
