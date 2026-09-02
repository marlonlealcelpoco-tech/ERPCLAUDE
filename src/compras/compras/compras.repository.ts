import { getLocalDb } from "../../shared/database/connection";
import type { Compra } from "./compras.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "compras";

export class ComprasRepository {
  async listar(): Promise<Compra[]> {
    const db = getLocalDb();
    return db.find<Compra>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<Compra | null> {
    const db = getLocalDb();
    return db.findById<Compra>(TABLE_NAME, id);
  }

  async criar(compra: Compra): Promise<Compra> {
    const db = getLocalDb();
    db.insert<Compra>(TABLE_NAME, compra);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: compra,
    });
    return compra;
  }
}
