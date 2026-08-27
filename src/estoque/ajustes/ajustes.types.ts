export interface AjusteEstoque {
  id: string;
  produtoId: string;
  estoqueAnterior: number;
  novoEstoque: number;
  diferenca: number;
  justificativa: string;
  usuarioId: string;
  criadoEm: Date;
}

export interface CriarAjusteInput {
  produtoId: string;
  estoqueAnterior: number;
  novoEstoque: number;
  diferenca: number;
  justificativa: string;
  usuarioId: string;
}
