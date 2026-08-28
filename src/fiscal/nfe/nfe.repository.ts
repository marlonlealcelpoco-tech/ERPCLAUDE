import { getLocalDb } from "../../shared/database/connection";
import type { NotaFiscalEletronica } from "./nfe.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "nfe_emitidas";

export class NfeRepository {
  async listar(): Promise<NotaFiscalEletronica[]> {
    const db = getLocalDb();
    return db.find<NotaFiscalEletronica>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<NotaFiscalEletronica | null> {
    const db = getLocalDb();
    return db.findById<NotaFiscalEletronica>(TABLE_NAME, id);
  }

  async salvar(nfe: NotaFiscalEletronica): Promise<NotaFiscalEletronica> {
    const db = getLocalDb();
    db.insert<NotaFiscalEletronica>(TABLE_NAME, nfe);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: nfe,
    });
    return nfe;
  }
}
