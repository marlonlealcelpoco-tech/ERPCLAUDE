export interface EntradaEstoque {
  id: string;
  produtoId: string;
  quantidade: number;
  observacao?: string;
  usuarioId: string;
  criadoEm: Date;
}

export interface CriarEntradaInput {
  produtoId: string;
  quantidade: number;
  observacao?: string;
  usuarioId: string;
}
