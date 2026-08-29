import { api } from './api';

export interface Produto {
  id: string;
  codigoBarras: string;
  nome: string;
  categoria: string;
  precoCusto: number;
  precoVenda: number;
  estoqueAtual: number;
  estoqueMinimo: number;
  unidade: string;
  ncm?: string;
  cfop?: string;
}

export interface CriarProdutoPayload {
  codigoBarras: string;
  nome: string;
  categoria: string;
  precoCusto: number;
  precoVenda: number;
  estoqueAtual: number;
  estoqueMinimo: number;
  unidade: string;
  ncm?: string;
  cfop?: string;
}

export const produtosService = {
  listar: () => api.get<Produto[]>('/cadastros/produtos'),

  buscarPorCodigoOuNome: (termo: string) =>
    api.get<Produto[]>(`/cadastros/produtos/busca?q=${encodeURIComponent(termo)}`),

  criar: (payload: CriarProdutoPayload) =>
    api.post<Produto>('/cadastros/produtos', payload),

  atualizar: (id: string, payload: Partial<CriarProdutoPayload>) =>
    api.put<Produto>(`/cadastros/produtos/${id}`, payload),

  deletar: (id: string) => api.delete(`/cadastros/produtos/${id}`),
};
