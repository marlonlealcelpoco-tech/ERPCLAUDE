import { getLocalDb } from "../../shared/database/connection";
import type { VendaPDV } from "./pdv.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "vendas";

export class PdvRepository {
  async listar(): Promise<VendaPDV[]> {
    const db = getLocalDb();
    return db.find<VendaPDV>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<VendaPDV | null> {
    const db = getLocalDb();
    return db.findById<VendaPDV>(TABLE_NAME, id);
  }

  async buscarPorCaixaId(caixaId: string): Promise<VendaPDV[]> {
    const db = getLocalDb();
    return db.find<VendaPDV>(TABLE_NAME, (v) => v.caixaId === caixaId);
  }

  async criar(venda: VendaPDV): Promise<VendaPDV> {
    const db = getLocalDb();
    db.insert<VendaPDV>(TABLE_NAME, venda);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: venda,
    });
    return venda;
  }

  async cancelarVenda(id: string, canceladoPor: string): Promise<VendaPDV> {
    const db = getLocalDb();
    const atualizada = db.update<VendaPDV>(TABLE_NAME, id, {
      status: "cancelada",
      canceladoEm: new Date(),
      canceladoPor,
    });
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "update",
      payload: atualizada,
    });
    return atualizada;
  }
}
