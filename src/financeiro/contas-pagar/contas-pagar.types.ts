export interface ContaPagar {
  id: string;
  compraId?: string;
  fornecedorId: string;
  descricao: string;
  valorOriginal: number;
  valorPago: number;
  status: "pendente" | "pago_parcial" | "pago";
  dataVencimento: Date;
  dataPagamento?: Date;
  lojaId: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarContaPagarInput {
  compraId?: string;
  fornecedorId: string;
  descricao: string;
  valorOriginal: number;
  dataVencimento: Date;
  lojaId: string;
}

export interface BaixarContaPagarInput {
  valorPago: number;
  dataPagamento?: Date;
}
