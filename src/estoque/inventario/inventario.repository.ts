import { getLocalDb } from "../../shared/database/connection";
import type { InventarioEstoque, CriarInventarioInput } from "./inventario.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "estoque_inventarios";

export class InventarioRepository {
  async listar(): Promise<InventarioEstoque[]> {
    const db = getLocalDb();
    return db.find<InventarioEstoque>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<InventarioEstoque | null> {
    const db = getLocalDb();
    return db.findById<InventarioEstoque>(TABLE_NAME, id);
  }

  async criar(dados: CriarInventarioInput): Promise<InventarioEstoque> {
    const db = getLocalDb();
    const agora = new Date();
    const novoInventario: InventarioEstoque = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      usuarioId: dados.usuarioId,
      lojaId: dados.lojaId,
      itens: dados.itens,
      observacao: dados.observacao,
      criadoEm: agora,
    };

    db.insert<InventarioEstoque>(TABLE_NAME, novoInventario);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novoInventario,
    });

    return novoInventario;
  }
}
