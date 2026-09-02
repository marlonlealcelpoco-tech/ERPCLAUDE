export interface LancamentoFluxoCaixa {
  id: string;
  tipo: "entrada" | "saida";
  categoria: string;
  descricao: string;
  valor: number;
  vendedorId?: string;
  lojaId: string;
  data: Date;
}

export interface RelatorioFluxoCaixa {
  periodoInicio?: Date;
  periodoFim?: Date;
  vendedorId?: string;
  lojaId?: string;
  totalEntradas: number;
  totalSaidas: number;
  saldoLiquido: number;
  lancamentos: LancamentoFluxoCaixa[];
}

export interface FiltroFluxoCaixa {
  vendedorId?: string;
  lojaId?: string;
  dataInicio?: Date;
  dataFim?: Date;
}
