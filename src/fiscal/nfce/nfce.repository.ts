import { getLocalDb } from "../../shared/database/connection";
import type { NotaFiscalConsumidor } from "./nfce.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "nfce_emitidas";

export class NfceRepository {
  async listar(): Promise<NotaFiscalConsumidor[]> {
    const db = getLocalDb();
    return db.find<NotaFiscalConsumidor>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<NotaFiscalConsumidor | null> {
    const db = getLocalDb();
    return db.findById<NotaFiscalConsumidor>(TABLE_NAME, id);
  }

  async buscarPorVendaId(vendaId: string): Promise<NotaFiscalConsumidor | null> {
    const db = getLocalDb();
    const [item] = db.find<NotaFiscalConsumidor>(TABLE_NAME, (n) => n.vendaId === vendaId);
    return item || null;
  }

  async salvar(nfce: NotaFiscalConsumidor): Promise<NotaFiscalConsumidor> {
    const db = getLocalDb();
    db.insert<NotaFiscalConsumidor>(TABLE_NAME, nfce);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: nfce,
    });
    return nfce;
  }
}
