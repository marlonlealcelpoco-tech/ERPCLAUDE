import { getLocalDb } from "../../shared/database/connection";
import type { Loja, CriarLojaInput, AtualizarLojaInput } from "./lojas.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "lojas";

export class LojasRepository {
  async listar(): Promise<Loja[]> {
    const db = getLocalDb();
    return db.find<Loja>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<Loja | null> {
    const db = getLocalDb();
    return db.findById<Loja>(TABLE_NAME, id);
  }

  async criar(dados: CriarLojaInput): Promise<Loja> {
    const db = getLocalDb();
    const agora = new Date();
    const novaLoja: Loja = {
      id: `loja_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      nome: dados.nome,
      cnpj: dados.cnpj,
      endereco: dados.endereco,
      telefone: dados.telefone,
      matriz: dados.matriz ?? false,
      ativa: dados.ativa ?? true,
      criadoEm: agora,
      atualizadoEm: agora,
    };

    db.insert<Loja>(TABLE_NAME, novaLoja);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novaLoja,
    });

    return novaLoja;
  }

  async atualizar(id: string, dados: AtualizarLojaInput): Promise<Loja> {
    const db = getLocalDb();
    const payload = {
      ...dados,
      atualizadoEm: new Date(),
    };

    const lojaAtualizada = db.update<Loja>(TABLE_NAME, id, payload);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "update",
      payload: lojaAtualizada,
    });

    return lojaAtualizada;
  }
}
