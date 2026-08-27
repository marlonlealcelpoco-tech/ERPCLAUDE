import { getLocalDb } from "../../shared/database/connection";
import type { ContaAPrazo, CriarContaAPrazoInput } from "./contas-a-prazo.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "contas_a_prazo";

export class ContasAPrazoRepository {
  async listar(): Promise<ContaAPrazo[]> {
    const db = getLocalDb();
    return db.find<ContaAPrazo>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<ContaAPrazo | null> {
    const db = getLocalDb();
    return db.findById<ContaAPrazo>(TABLE_NAME, id);
  }

  async buscarPorClienteId(clienteId: string): Promise<ContaAPrazo[]> {
    const db = getLocalDb();
    return db
      .find<ContaAPrazo>(TABLE_NAME, (c) => c.clienteId === clienteId && c.status !== "pago")
      .sort((a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime());
  }

  async criar(dados: CriarContaAPrazoInput): Promise<ContaAPrazo> {
    const db = getLocalDb();
    const agora = new Date();
    const novaConta: ContaAPrazo = {
      id: `cp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      vendaId: dados.vendaId,
      clienteId: dados.clienteId,
      lojaId: dados.lojaId,
      valorOriginal: dados.valorOriginal,
      valorSaldo: dados.valorOriginal,
      status: "pendente",
      criadoEm: agora,
      atualizadoEm: agora,
    };

    db.insert<ContaAPrazo>(TABLE_NAME, novaConta);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novaConta,
    });

    return novaConta;
  }

  async atualizarSaldo(id: string, novoSaldo: number): Promise<ContaAPrazo> {
    const db = getLocalDb();
    const status = novoSaldo <= 0 ? "pago" : "pago_parcial";
    const atualizado = db.update<ContaAPrazo>(TABLE_NAME, id, {
      valorSaldo: Math.max(0, novoSaldo),
      status,
      atualizadoEm: new Date(),
    });

    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "update",
      payload: atualizado,
    });

    return atualizado;
  }
}
