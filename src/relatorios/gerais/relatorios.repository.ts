import { ClientesRepository } from "../../cadastro/clientes/clientes.repository";
import { RecebimentosRepository } from "../../caixa/recebimentos/recebimentos.repository";
import { ContasPagarRepository } from "../../financeiro/contas-pagar/contas-pagar.repository";
import { PdvRepository } from "../../vendas/pdv/pdv.repository";
import { ComprasRepository } from "../../compras/compras/compras.repository";
import type { RelatorioGeralConsolidado, FiltroRelatorioGeral } from "./relatorios.types";

export class RelatoriosRepository {
  constructor(
    private readonly clientesRepo: ClientesRepository = new ClientesRepository(),
    private readonly recebimentosRepo: RecebimentosRepository = new RecebimentosRepository(),
    private readonly contasPagarRepo: ContasPagarRepository = new ContasPagarRepository(),
    private readonly pdvRepo: PdvRepository = new PdvRepository(),
    private readonly comprasRepo: ComprasRepository = new ComprasRepository()
  ) {}

  async gerarRelatorioGeral(filtro: FiltroRelatorioGeral): Promise<RelatorioGeralConsolidado> {
    // 1. Contas a Receber
    const clientes = await this.clientesRepo.listar();
    const todosRecebimentos = await this.recebimentosRepo.listar();

    const recebimentosFiltrados = todosRecebimentos.filter((r) => {
      const dataR = new Date(r.criadoEm).getTime();
      if (filtro.dataInicio && dataR < filtro.dataInicio.getTime()) return false;
      if (filtro.dataFim && dataR > filtro.dataFim.getTime()) return false;
      return true;
    });

    let totalAReceber = 0;
    let totalRecebido = 0;
    const detalhamentoClientes = [];

    for (const c of clientes) {
      const recs = recebimentosFiltrados.filter((r) => r.clienteId === c.id);
      const recTotal = recs.reduce((acc, r) => acc + r.valorRecebido, 0);

      totalAReceber += c.saldoDevedor || 0;
      totalRecebido += recTotal;

      if ((c.saldoDevedor || 0) > 0 || recTotal > 0) {
        detalhamentoClientes.push({
          clienteId: c.id,
          nomeCliente: c.nome,
          saldoDevedor: c.saldoDevedor || 0,
          totalRecebido: recTotal,
        });
      }
    }

    // 2. Contas a Pagar
    const todasContasPagar = await this.contasPagarRepo.listar();
    let totalPago = 0;
    let totalAPagar = 0;
    const fornecedorMap = new Map<string, { totalPago: number; totalPendente: number }>();

    for (const cp of todasContasPagar) {
      if (filtro.lojaId && cp.lojaId !== filtro.lojaId) continue;

      const dataRef = cp.dataPagamento ? new Date(cp.dataPagamento) : new Date(cp.dataVencimento);
      if (filtro.dataInicio && dataRef.getTime() < filtro.dataInicio.getTime()) continue;
      if (filtro.dataFim && dataRef.getTime() > filtro.dataFim.getTime()) continue;

      const pendente = Math.max(0, cp.valorOriginal - cp.valorPago);
      totalPago += cp.valorPago;
      totalAPagar += pendente;

      const ext = fornecedorMap.get(cp.fornecedorId) || { totalPago: 0, totalPendente: 0 };
      fornecedorMap.set(cp.fornecedorId, {
        totalPago: ext.totalPago + cp.valorPago,
        totalPendente: ext.totalPendente + pendente,
      });
    }

    const detalhamentoFornecedores = Array.from(fornecedorMap.entries()).map(([fornecedorId, val]) => ({
      fornecedorId,
      ...val,
    }));

    // 3. Vendas por período
    const vendas = await this.pdvRepo.listar();
    let totalVendas = 0;
    let quantidadeVendas = 0;
    const vendasPorFormaPagamento: Record<string, number> = {};

    for (const v of vendas) {
      if (filtro.lojaId && v.lojaId !== filtro.lojaId) continue;
      if (filtro.dataInicio && new Date(v.criadoEm).getTime() < filtro.dataInicio.getTime()) continue;
      if (filtro.dataFim && new Date(v.criadoEm).getTime() > filtro.dataFim.getTime()) continue;

      if (v.status === "concluida") {
        totalVendas += v.valorTotal;
        quantidadeVendas += 1;
        vendasPorFormaPagamento[v.formaPagamento] =
          (vendasPorFormaPagamento[v.formaPagamento] || 0) + v.valorTotal;
      }
    }

    // 4. Movimentação Consolidada da Filial
    const compras = await this.comprasRepo.listar();
    let totalCompras = 0;
    for (const cmp of compras) {
      if (filtro.lojaId && cmp.lojaId !== filtro.lojaId) continue;
      if (filtro.dataInicio && new Date(cmp.criadoEm).getTime() < filtro.dataInicio.getTime()) continue;
      if (filtro.dataFim && new Date(cmp.criadoEm).getTime() > filtro.dataFim.getTime()) continue;
      totalCompras += cmp.valorTotal;
    }

    const saldoConsolidado = totalVendas + totalRecebido - totalPago - totalCompras;

    return {
      periodoInicio: filtro.dataInicio,
      periodoFim: filtro.dataFim,
      lojaId: filtro.lojaId,
      contasReceber: {
        totalRecebido,
        totalAReceber,
        detalhamentoPorCliente: detalhamentoClientes,
      },
      contasPagar: {
        totalPago,
        totalAPagar,
        detalhamentoPorFornecedor: detalhamentoFornecedores,
      },
      vendas: {
        totalVendas,
        quantidadeVendas,
        vendasPorFormaPagamento,
      },
      movimentacaoConsolidada: {
        lojaId: filtro.lojaId,
        totalVendas,
        totalRecebimentos: totalRecebido,
        totalCompras,
        totalContasPagas: totalPago,
        saldoConsolidado,
      },
    };
  }
}
