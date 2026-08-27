export interface ResumoVendaCliente {
  clienteId: string;
  nomeCliente: string;
  valor: number;
}

export interface ResumoRecebimentoCliente {
  clienteId: string;
  nomeCliente: string;
  valorRecebido: number;
  formaPagamento: string;
}

export interface ResumoProdutoVendido {
  produtoId: string;
  nomeProduto: string;
  quantidadeTotal: number;
  valorTotal: number;
}

export interface RelatorioFechamentoCaixa {
  caixaId: string;
  usuarioId: string;
  lojaId: string;
  abertoEm: Date;
  fechadoEm: Date;
  valorInicial: number;
  totalVendidoDinheiro: number;
  totalVendidoDebito: number;
  totalVendidoCredito: number;
  totalVendidoPix: number;
  totalVendidoAPrazo: number;
  totalGeralVendas: number;
  vendasAPrazoDetalhado: ResumoVendaCliente[];
  totalRecebidoDinheiro: number;
  totalRecebidoDebito: number;
  totalRecebidoCredito: number;
  totalRecebidoPix: number;
  totalGeralRecebido: number;
  recebimentosDetalhado: ResumoRecebimentoCliente[];
  totalSangrias: number;
  dinheiroEsperado: number;
  dinheiroContado: number;
  diferencaDinheiro: number;
  produtosVendidos: ResumoProdutoVendido[];
}

export interface CriarFechamentoInput {
  dinheiroContado: number;
}
