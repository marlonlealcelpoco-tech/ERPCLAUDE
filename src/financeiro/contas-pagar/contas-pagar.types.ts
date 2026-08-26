// Tipos do módulo contas-pagar
// TODO: substituir por tipos reais conforme desenho-erp.md

export interface ContasPagar {
  id: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarContasPagarInput {
  // TODO: campos de criação
}

export interface AtualizarContasPagarInput {
  // TODO: campos de atualização
}
