export interface ContaAPrazo {
  id: string;
  vendaId: string;
  clienteId: string;
  lojaId: string;
  valorOriginal: number;
  valorSaldo: number;
  status: "pendente" | "pago_parcial" | "pago";
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarContaAPrazoInput {
  vendaId: string;
  clienteId: string;
  lojaId: string;
  valorOriginal: number;
}
