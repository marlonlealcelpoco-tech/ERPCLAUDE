export interface RelatorioContasReceberCliente {
  clienteId: string;
  nomeCliente: string;
  saldoDevedorTotal: number;
  totalRecebido: number;
}

export interface DemonstrativoContasReceber {
  totalGeralRecebido: number;
  totalGeralAReceber: number;
  clientes: RelatorioContasReceberCliente[];
}
