import { api } from './api';

export interface RegistrarBaixaAvariaPayload {
  produtoId: string;
  lojaId: string;
  quantidade: number;
  tipo: 'avaria' | 'perda' | 'validade_vencida' | 'outro';
  motivo?: string;
}

export const estoqueService = {
  obterMovimentacoes: (lojaId?: string) =>
    api.get(`/estoque/entradas${lojaId ? `?lojaId=${lojaId}` : ''}`),

  registrarBaixaAvaria: (payload: RegistrarBaixaAvariaPayload) =>
    api.post('/estoque/avarias', payload),

  realizarBalancoFisico: (lojaId: string, itens: { produtoId: string; quantidadeContada: number }[]) =>
    api.post('/estoque/conferencia', { lojaId, itens }),
};
