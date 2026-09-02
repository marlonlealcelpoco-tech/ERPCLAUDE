import { api } from './api';

export interface AbrirCaixaPayload {
  lojaId: string;
  usuarioId: string;
  valorInicial: number;
}

export interface FecharCaixaPayload {
  caixaId: string;
  dinheiroContado: number;
}

export interface SangriaPayload {
  caixaId: string;
  valor: number;
  motivo: string;
}

export interface SuprimentoPayload {
  caixaId: string;
  valor: number;
  motivo: string;
}

export interface ItemVendaPayload {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  desconto?: number;
}

export interface RegistrarVendaPayload {
  caixaId: string;
  clienteId?: string;
  formaPagamento: 'dinheiro' | 'debito' | 'credito' | 'pix' | 'a_prazo';
  itens: ItemVendaPayload[];
  numeroParcelas?: number;
}

export interface RecebimentoClientePayload {
  caixaId: string;
  clienteId: string;
  valorRecebido: number;
  formaPagamento: 'dinheiro' | 'debito' | 'credito' | 'pix';
}

export const pdvService = {
  abrirCaixa: (payload: AbrirCaixaPayload) =>
    api.post('/caixa/abertura', payload),

  fecharCaixa: (payload: FecharCaixaPayload) =>
    api.post('/caixa/fechamento', payload),

  obterCaixaAberto: (lojaId: string, usuarioId: string) =>
    api.get(`/caixa/aberto?lojaId=${lojaId}&usuarioId=${usuarioId}`),

  realizarSangria: (payload: SangriaPayload) =>
    api.post('/caixa/sangria', payload),

  realizarSuprimento: (payload: SuprimentoPayload) =>
    api.post('/caixa/suprimento', payload),

  registrarVenda: (payload: RegistrarVendaPayload) =>
    api.post('/vendas', payload),

  receberDebitoCliente: (payload: RecebimentoClientePayload) =>
    api.post('/caixa/recebimentos', payload),

  obterRelatorioFechamento: (caixaId: string) =>
    api.get(`/caixa/fechamento/relatorio/${caixaId}`),
};
