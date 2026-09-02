export type FormaPagamentoRecebimento = "dinheiro" | "debito" | "credito" | "pix";

export interface RecebimentoCliente {
  id: string;
  caixaId: string;
  vendedorId: string;
  clienteId: string;
  nomeCliente: string;
  valorRecebido: number;
  formaPagamento: FormaPagamentoRecebimento;
  criadoEm: Date;
}

export interface CriarRecebimentoInput {
  caixaId: string;
  vendedorId: string;
  clienteId: string;
  nomeCliente: string;
  valorRecebido: number;
  formaPagamento: FormaPagamentoRecebimento;
}
