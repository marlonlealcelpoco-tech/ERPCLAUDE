// Registro de auditoria para operações sensíveis (cancelamento de venda,
// baixa de conta a pagar, ajuste de estoque, etc).
export interface AuditoriaEntrada {
  usuarioId: string;
  acao: string;
  entidade: string;
  entidadeId: string;
  detalhes?: Record<string, unknown>;
}

export async function registrarAuditoria(entrada: AuditoriaEntrada): Promise<void> {
  // TODO: persistir no banco local da filial
}
