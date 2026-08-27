export interface Sangria {
  id: string;
  caixaId: string;
  usuarioId: string;
  valor: number;
  observacao?: string;
  criadoEm: Date;
}

export interface CriarSangriaInput {
  caixaId: string;
  usuarioId: string;
  valor: number;
  observacao?: string;
}
