export interface SaidaEstoque {
  id: string;
  produtoId: string;
  quantidade: number;
  motivo?: string;
  usuarioId: string;
  criadoEm: Date;
}

export interface CriarSaidaInput {
  produtoId: string;
  quantidade: number;
  motivo?: string;
  usuarioId: string;
}
