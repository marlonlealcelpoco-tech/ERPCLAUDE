export interface CancelamentoVenda {
  id: string;
  vendaId: string;
  produtoId?: string;
  autorizadoPorId: string;
  motivo?: string;
  restaurarEstoque: boolean;
  criadoEm: Date;
}

export interface CriarCancelamentoInput {
  vendaId: string;
  produtoId?: string;
  autorizadoPorId: string;
  motivo?: string;
  restaurarEstoque?: boolean;
}
