import { api } from './api';

export interface ItemCompraManual {
  produtoId: string;
  quantidade: number;
  precoCusto: number;
}

export interface CompraManualPayload {
  fornecedorId: string;
  lojaId: string;
  formaPagamento: 'AVISTA' | 'APRAZO';
  numeroParcelas?: number;
  dataVencimentoInicial?: string;
  itens: ItemCompraManual[];
}

export const comprasService = {
  importarXml: (xmlString: string, lojaId: string) =>
    api.post('/compras/xml/importar', { conteudoXml: xmlString, lojaId }),

  lancarManual: (payload: CompraManualPayload) =>
    api.post('/compras', payload),

  listarNotas: () => api.get('/compras/notas'),
};
