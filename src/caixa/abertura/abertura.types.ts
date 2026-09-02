export interface CaixaAbertura {
  id: string;
  usuarioId: string;
  lojaId: string;
  valorInicial: number;
  status: "aberto" | "fechado";
  abertoEm: Date;
  fechadoEm?: Date;
}

export interface CriarAberturaInput {
  usuarioId: string;
  lojaId: string;
  valorInicial: number;
}
