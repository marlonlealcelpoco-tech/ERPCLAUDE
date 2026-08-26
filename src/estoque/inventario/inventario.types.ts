// Tipos do módulo inventario
// TODO: substituir por tipos reais conforme desenho-erp.md

export interface Inventario {
  id: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarInventarioInput {
  // TODO: campos de criação
}

export interface AtualizarInventarioInput {
  // TODO: campos de atualização
}
