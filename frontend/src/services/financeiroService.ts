import { api } from './api';

export interface BaixaContaPagarPayload {
  contaPagarId: string;
  valorPago: number;
  dataPagamento?: string;
  formaPagamento?: string;
}

export const financeiroService = {
  listarContasPagar: (status?: 'PENDENTE' | 'PAGO' | 'ATRASADO') =>
    api.get(`/financeiro/contas-pagar${status ? `?status=${status}` : ''}`),

  baixarContaPagar: (payload: BaixaContaPagarPayload) =>
    api.post(`/financeiro/contas-pagar/${payload.contaPagarId}/baixar`, {
      valorPago: payload.valorPago,
      dataPagamento: payload.dataPagamento
    }),

  listarContasReceber: (clienteId?: string) =>
    api.get(`/financeiro/contas-receber${clienteId ? `?clienteId=${clienteId}` : ''}`),

  obterFluxoCaixa: (dataInicio: string, dataFim: string, lojaId?: string) =>
    api.get(`/financeiro/fluxo-caixa?dataInicio=${dataInicio}&dataFim=${dataFim}${lojaId ? `&lojaId=${lojaId}` : ''}`),

  obterDre: (mes: number, ano: number) =>
    api.get(`/financeiro/dre?mes=${mes}&ano=${ano}`),
};
