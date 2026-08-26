// Tipos do módulo fechamento
// TODO: substituir por tipos reais conforme desenho-erp.md

export interface Fechamento {
  id: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarFechamentoInput {
  // TODO: campos de criação
}

export interface AtualizarFechamentoInput {
  // TODO: campos de atualização
}
