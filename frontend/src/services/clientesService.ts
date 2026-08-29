import { api } from './api';

export interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  limiteCredito: number;
  saldoDevedor: number;
}

export interface CriarClientePayload {
  nome: string;
  cpfCnpj: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  limiteCredito?: number;
}

export const clientesService = {
  listar: () => api.get<Cliente[]>('/cadastros/clientes'),

  buscarPorId: (id: string) => api.get<Cliente>(`/cadastros/clientes/${id}`),

  criar: (payload: CriarClientePayload) =>
    api.post<Cliente>('/cadastros/clientes', payload),

  atualizar: (id: string, payload: Partial<CriarClientePayload>) =>
    api.put<Cliente>(`/cadastros/clientes/${id}`, payload),

  deletar: (id: string) => api.delete(`/cadastros/clientes/${id}`),

  obterExtratoDevedor: (clienteId: string) =>
    api.get(`/cadastros/clientes/${clienteId}/extrato`),
};
