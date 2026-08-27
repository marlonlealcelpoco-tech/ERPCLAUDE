import { getLocalDb } from "../../shared/database/connection";
import type { SaidaEstoque, CriarSaidaInput } from "./saidas.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "estoque_saidas";

export class SaidasRepository {
  async listar(): Promise<SaidaEstoque[]> {
    const db = getLocalDb();
    return db.find<SaidaEstoque>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<SaidaEstoque | null> {
    const db = getLocalDb();
    return db.findById<SaidaEstoque>(TABLE_NAME, id);
  }

  async criar(dados: CriarSaidaInput): Promise<SaidaEstoque> {
    const db = getLocalDb();
    const agora = new Date();
    const novaSaida: SaidaEstoque = {
      id: `sai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      produtoId: dados.produtoId,
      quantidade: dados.quantidade,
      motivo: dados.motivo,
      usuarioId: dados.usuarioId,
      criadoEm: agora,
    };

    db.insert<SaidaEstoque>(TABLE_NAME, novaSaida);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novaSaida,
    });

    return novaSaida;
  }
}
