import { getLocalDb } from "../../shared/database/connection";
import type { CaixaAbertura, CriarAberturaInput } from "./abertura.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "caixas";

export class AberturaRepository {
  async listar(): Promise<CaixaAbertura[]> {
    const db = getLocalDb();
    return db.find<CaixaAbertura>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<CaixaAbertura | null> {
    const db = getLocalDb();
    return db.findById<CaixaAbertura>(TABLE_NAME, id);
  }

  async buscarCaixaAbertoPorUsuario(usuarioId: string): Promise<CaixaAbertura | null> {
    const db = getLocalDb();
    const [caixa] = db.find<CaixaAbertura>(
      TABLE_NAME,
      (c) => c.usuarioId === usuarioId && c.status === "aberto"
    );
    return caixa || null;
  }

  async criar(dados: CriarAberturaInput): Promise<CaixaAbertura> {
    const db = getLocalDb();
    const agora = new Date();
    const novoCaixa: CaixaAbertura = {
      id: `cx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      usuarioId: dados.usuarioId,
      lojaId: dados.lojaId,
      valorInicial: dados.valorInicial,
      status: "aberto",
      abertoEm: agora,
    };

    db.insert<CaixaAbertura>(TABLE_NAME, novoCaixa);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novoCaixa,
    });

    return novoCaixa;
  }

  async fecharCaixa(id: string): Promise<CaixaAbertura> {
    const db = getLocalDb();
    const fechado = db.update<CaixaAbertura>(TABLE_NAME, id, {
      status: "fechado",
      fechadoEm: new Date(),
    });

    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "update",
      payload: fechado,
    });

    return fechado;
  }
}
