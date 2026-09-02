import { getLocalDb } from "../../shared/database/connection";
import type { RelatorioFechamentoCaixa } from "./fechamento.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "fechamentos";

export class FechamentoRepository {
  async listar(): Promise<RelatorioFechamentoCaixa[]> {
    const db = getLocalDb();
    return db.find<RelatorioFechamentoCaixa>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<RelatorioFechamentoCaixa | null> {
    const db = getLocalDb();
    return db.findById<RelatorioFechamentoCaixa>(TABLE_NAME, id);
  }

  async criar(relatorio: RelatorioFechamentoCaixa): Promise<RelatorioFechamentoCaixa> {
    const db = getLocalDb();
    db.insert<RelatorioFechamentoCaixa & { id: string }>(TABLE_NAME, {
      ...relatorio,
      id: relatorio.caixaId,
    });

    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: relatorio,
    });

    return relatorio;
  }
}
