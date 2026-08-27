import { getLocalDb } from "../../shared/database/connection";
import type { RecebimentoCliente, CriarRecebimentoInput } from "./recebimentos.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "recebimentos";

export class RecebimentosRepository {
  async listar(): Promise<RecebimentoCliente[]> {
    const db = getLocalDb();
    return db.find<RecebimentoCliente>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<RecebimentoCliente | null> {
    const db = getLocalDb();
    return db.findById<RecebimentoCliente>(TABLE_NAME, id);
  }

  async buscarPorCaixaId(caixaId: string): Promise<RecebimentoCliente[]> {
    const db = getLocalDb();
    return db.find<RecebimentoCliente>(TABLE_NAME, (r) => r.caixaId === caixaId);
  }

  async criar(dados: CriarRecebimentoInput): Promise<RecebimentoCliente> {
    const db = getLocalDb();
    const agora = new Date();
    const novoRecebimento: RecebimentoCliente = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      caixaId: dados.caixaId,
      vendedorId: dados.vendedorId,
      clienteId: dados.clienteId,
      nomeCliente: dados.nomeCliente,
      valorRecebido: dados.valorRecebido,
      formaPagamento: dados.formaPagamento,
      criadoEm: agora,
    };

    db.insert<RecebimentoCliente>(TABLE_NAME, novoRecebimento);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novoRecebimento,
    });

    return novoRecebimento;
  }
}
