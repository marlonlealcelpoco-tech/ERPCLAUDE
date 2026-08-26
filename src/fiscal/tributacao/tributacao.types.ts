// Tipos do módulo tributacao
// TODO: substituir por tipos reais conforme desenho-erp.md

export interface Tributacao {
  id: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarTributacaoInput {
  // TODO: campos de criação
}

export interface AtualizarTributacaoInput {
  // TODO: campos de atualização
}
