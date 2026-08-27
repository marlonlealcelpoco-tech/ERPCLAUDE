import { getLocalDb } from "../../shared/database/connection";
import type { ConciliacaoBancaria, CriarConciliacaoInput } from "./conciliacao.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "conciliacoes";

export class ConciliacaoRepository {
  async listar(): Promise<ConciliacaoBancaria[]> {
    const db = getLocalDb();
    return db.find<ConciliacaoBancaria>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<ConciliacaoBancaria | null> {
    const db = getLocalDb();
    return db.findById<ConciliacaoBancaria>(TABLE_NAME, id);
  }

  async criar(dados: CriarConciliacaoInput): Promise<ConciliacaoBancaria> {
    const db = getLocalDb();
    const agora = new Date();
    const diferenca = dados.saldoExtrato - dados.saldoSistema;
    const conciliado = diferenca === 0;

    const nova: ConciliacaoBancaria = {
      id: `cnc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      lojaId: dados.lojaId,
      data: dados.data,
      saldoExtrato: dados.saldoExtrato,
      saldoSistema: dados.saldoSistema,
      diferenca,
      conciliado,
      observacao: dados.observacao,
      criadoEm: agora,
    };

    db.insert<ConciliacaoBancaria>(TABLE_NAME, nova);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: nova,
    });

    return nova;
  }
}
