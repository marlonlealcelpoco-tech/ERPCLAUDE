import { getLocalDb } from "../../shared/database/connection";
import type { CancelamentoVenda, CriarCancelamentoInput } from "./devolucoes.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "devolucoes";

export class DevolucoesRepository {
  async listar(): Promise<CancelamentoVenda[]> {
    const db = getLocalDb();
    return db.find<CancelamentoVenda>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<CancelamentoVenda | null> {
    const db = getLocalDb();
    return db.findById<CancelamentoVenda>(TABLE_NAME, id);
  }

  async criar(dados: CriarCancelamentoInput): Promise<CancelamentoVenda> {
    const db = getLocalDb();
    const agora = new Date();
    const novoCancelamento: CancelamentoVenda = {
      id: `cncl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      vendaId: dados.vendaId,
      produtoId: dados.produtoId,
      autorizadoPorId: dados.autorizadoPorId,
      motivo: dados.motivo,
      restaurarEstoque: dados.restaurarEstoque ?? true,
      criadoEm: agora,
    };

    db.insert<CancelamentoVenda>(TABLE_NAME, novoCancelamento);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novoCancelamento,
    });

    return novoCancelamento;
  }
}
