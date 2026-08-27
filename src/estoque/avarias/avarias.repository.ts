import { getLocalDb } from "../../shared/database/connection";
import type { AvariaEstoque, CriarAvariaInput } from "./avarias.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "estoque_avarias";

export class AvariasRepository {
  async listar(): Promise<AvariaEstoque[]> {
    const db = getLocalDb();
    return db.find<AvariaEstoque>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<AvariaEstoque | null> {
    const db = getLocalDb();
    return db.findById<AvariaEstoque>(TABLE_NAME, id);
  }

  async criar(dados: CriarAvariaInput): Promise<AvariaEstoque> {
    const db = getLocalDb();
    const agora = new Date();
    const novaAvaria: AvariaEstoque = {
      id: `avr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      produtoId: dados.produtoId,
      quantidade: dados.quantidade,
      tipo: dados.tipo,
      motivo: dados.motivo,
      usuarioId: dados.usuarioId,
      criadoEm: agora,
    };

    db.insert<AvariaEstoque>(TABLE_NAME, novaAvaria);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novaAvaria,
    });

    return novaAvaria;
  }
}
