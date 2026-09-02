import { getLocalDb } from "../../shared/database/connection";
import type { Sangria, CriarSangriaInput } from "./sangria.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "sangrias";

export class SangriaRepository {
  async listar(): Promise<Sangria[]> {
    const db = getLocalDb();
    return db.find<Sangria>(TABLE_NAME);
  }

  async buscarPorCaixaId(caixaId: string): Promise<Sangria[]> {
    const db = getLocalDb();
    return db.find<Sangria>(TABLE_NAME, (s) => s.caixaId === caixaId);
  }

  async buscarPorId(id: string): Promise<Sangria | null> {
    const db = getLocalDb();
    return db.findById<Sangria>(TABLE_NAME, id);
  }

  async criar(dados: CriarSangriaInput): Promise<Sangria> {
    const db = getLocalDb();
    const agora = new Date();
    const novaSangria: Sangria = {
      id: `sng_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      caixaId: dados.caixaId,
      usuarioId: dados.usuarioId,
      valor: dados.valor,
      observacao: dados.observacao,
      criadoEm: agora,
    };

    db.insert<Sangria>(TABLE_NAME, novaSangria);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novaSangria,
    });

    return novaSangria;
  }
}
