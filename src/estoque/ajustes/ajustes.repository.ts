import { getLocalDb } from "../../shared/database/connection";
import type { AjusteEstoque, CriarAjusteInput } from "./ajustes.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "estoque_ajustes";

export class AjustesRepository {
  async listar(): Promise<AjusteEstoque[]> {
    const db = getLocalDb();
    return db.find<AjusteEstoque>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<AjusteEstoque | null> {
    const db = getLocalDb();
    return db.findById<AjusteEstoque>(TABLE_NAME, id);
  }

  async criar(dados: CriarAjusteInput): Promise<AjusteEstoque> {
    const db = getLocalDb();
    const agora = new Date();
    const novoAjuste: AjusteEstoque = {
      id: `ajs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      produtoId: dados.produtoId,
      estoqueAnterior: dados.estoqueAnterior,
      novoEstoque: dados.novoEstoque,
      diferenca: dados.diferenca,
      justificativa: dados.justificativa,
      usuarioId: dados.usuarioId,
      criadoEm: agora,
    };

    db.insert<AjusteEstoque>(TABLE_NAME, novoAjuste);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novoAjuste,
    });

    return novoAjuste;
  }
}
