// Tipos do módulo fluxo-caixa
// TODO: substituir por tipos reais conforme desenho-erp.md

export interface FluxoCaixa {
  id: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarFluxoCaixaInput {
  // TODO: campos de criação
}

export interface AtualizarFluxoCaixaInput {
  // TODO: campos de atualização
}
