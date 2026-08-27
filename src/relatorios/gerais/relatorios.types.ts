export interface RelatorioContasReceberGeral {
  totalRecebido: number;
  totalAReceber: number;
  detalhamentoPorCliente: {
    clienteId: string;
    nomeCliente: string;
    saldoDevedor: number;
    totalRecebido: number;
  }[];
}

export interface RelatorioContasPagarGeral {
  totalPago: number;
  totalAPagar: number;
  detalhamentoPorFornecedor: {
    fornecedorId: string;
    totalPago: number;
    totalPendente: number;
  }[];
}

export interface RelatorioVendasPeriodo {
  totalVendas: number;
  quantidadeVendas: number;
  vendasPorFormaPagamento: Record<string, number>;
}

export interface RelatorioMovimentacaoConsolidada {
  lojaId?: string;
  totalVendas: number;
  totalRecebimentos: number;
  totalCompras: number;
  totalContasPagas: number;
  saldoConsolidado: number;
}

export interface RelatorioGeralConsolidado {
  periodoInicio?: Date;
  periodoFim?: Date;
  lojaId?: string;
  contasReceber: RelatorioContasReceberGeral;
  contasPagar: RelatorioContasPagarGeral;
  vendas: RelatorioVendasPeriodo;
  movimentacaoConsolidada: RelatorioMovimentacaoConsolidada;
}

export interface FiltroRelatorioGeral {
  lojaId?: string;
  dataInicio?: Date;
  dataFim?: Date;
}
