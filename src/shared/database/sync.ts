// Sincronização entre banco local (filial) e banco central.
// Regra: quando há internet, envia vendas/movimentações novas para o central
// e recebe atualizações (preços, cadastros, estoque de outras lojas).
// Sem internet, os registros ficam em fila local e sincronizam depois.

export interface FilaSincronizacaoItem {
  id: string;
  tabela: string;
  operacao: "insert" | "update";
  payload: unknown;
  criadoEm: Date;
  sincronizadoEm: Date | null;
}

export async function enfileirarParaSincronizacao(item: Omit<FilaSincronizacaoItem, "id" | "criadoEm" | "sincronizadoEm">) {
  // TODO: gravar na tabela local de fila de sincronização
}

export async function processarFilaSincronizacao(): Promise<void> {
  // TODO: verificar conectividade, enviar itens pendentes para o banco central,
  // e baixar atualizações do central (preços, cadastros, estoque de outras lojas).
  // Deve rodar periodicamente (ex: a cada X segundos) em background.
}
