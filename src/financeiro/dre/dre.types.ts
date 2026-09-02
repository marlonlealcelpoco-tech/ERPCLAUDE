export interface DemonstrativoResultado {
  lojaId?: string;
  periodoInicio?: Date;
  periodoFim?: Date;
  receitaBrutaVendas: number;
  deducoesDevolucoes: number;
  receitaLiquida: number;
  custoProdutosVendidos: number;
  lucroBruto: number;
  despesasOperacionais: number;
  lucroLiquido: number;
}
