import { getLocalDb } from "../../shared/database/connection";
import type { EntradaEstoque, CriarEntradaInput } from "./entradas.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "estoque_entradas";

export class EntradasRepository {
  async listar(): Promise<EntradaEstoque[]> {
    const db = getLocalDb();
    return db.find<EntradaEstoque>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<EntradaEstoque | null> {
    const db = getLocalDb();
    return db.findById<EntradaEstoque>(TABLE_NAME, id);
  }

  async criar(dados: CriarEntradaInput): Promise<EntradaEstoque> {
    const db = getLocalDb();
    const agora = new Date();
    const novaEntrada: EntradaEstoque = {
      id: `ent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      produtoId: dados.produtoId,
      quantidade: dados.quantidade,
      observacao: dados.observacao,
      usuarioId: dados.usuarioId,
      criadoEm: agora,
    };

    db.insert<EntradaEstoque>(TABLE_NAME, novaEntrada);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novaEntrada,
    });

    return novaEntrada;
  }
}
