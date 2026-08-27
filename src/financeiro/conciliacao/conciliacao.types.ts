export interface ConciliacaoBancaria {
  id: string;
  lojaId: string;
  data: Date;
  saldoExtrato: number;
  saldoSistema: number;
  diferenca: number;
  conciliado: boolean;
  observacao?: string;
  criadoEm: Date;
}

export interface CriarConciliacaoInput {
  lojaId: string;
  data: Date;
  saldoExtrato: number;
  saldoSistema: number;
  observacao?: string;
}
