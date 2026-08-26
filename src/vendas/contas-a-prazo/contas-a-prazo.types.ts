// Tipos do módulo contas-a-prazo
// TODO: substituir por tipos reais conforme desenho-erp.md

export interface ContasAPrazo {
  id: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarContasAPrazoInput {
  // TODO: campos de criação
}

export interface AtualizarContasAPrazoInput {
  // TODO: campos de atualização
}
