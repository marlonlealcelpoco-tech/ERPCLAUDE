import { getLocalDb } from "./connection";

export interface FilaSincronizacaoItem {
  id: string;
  tabela: string;
  operacao: "insert" | "update";
  payload: unknown;
  criadoEm: Date;
  sincronizadoEm: Date | null;
}

export async function enfileirarParaSincronizacao(item: Omit<FilaSincronizacaoItem, "id" | "criadoEm" | "sincronizadoEm">) {
  const db = getLocalDb();
  const novoItem: FilaSincronizacaoItem = {
    id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    tabela: item.tabela,
    operacao: item.operacao,
    payload: item.payload,
    criadoEm: new Date(),
    sincronizadoEm: null,
  };

  db.insert("fila_sincronizacao", novoItem);
  return novoItem;
}

export async function processarFilaSincronizacao(): Promise<void> {
  const db = getLocalDb();
  const pendentes = db.find<FilaSincronizacaoItem>("fila_sincronizacao", (i) => i.sincronizadoEm === null);

  for (const item of pendentes) {
    db.update<FilaSincronizacaoItem>("fila_sincronizacao", item.id, {
      sincronizadoEm: new Date(),
    });
  }
}
