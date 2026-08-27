export type TipoAvaria = "avaria" | "perda" | "validade_vencida" | "outro";

export interface AvariaEstoque {
  id: string;
  produtoId: string;
  quantidade: number;
  tipo: TipoAvaria;
  motivo?: string;
  usuarioId: string;
  criadoEm: Date;
}

export interface CriarAvariaInput {
  produtoId: string;
  quantidade: number;
  tipo: TipoAvaria;
  motivo?: string;
  usuarioId: string;
}
