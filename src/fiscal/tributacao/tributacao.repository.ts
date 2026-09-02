import { getLocalDb } from "../../shared/database/connection";
import type { RegraTributaria, CriarTributacaoInput, AtualizarTributacaoInput } from "./tributacao.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "regras_tributarias";

export class TributacaoRepository {
  async listar(): Promise<RegraTributaria[]> {
    const db = getLocalDb();
    return db.find<RegraTributaria>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<RegraTributaria | null> {
    const db = getLocalDb();
    return db.findById<RegraTributaria>(TABLE_NAME, id);
  }

  async buscarPorNcm(ncm: string): Promise<RegraTributaria | null> {
    const db = getLocalDb();
    const [item] = db.find<RegraTributaria>(TABLE_NAME, (r) => r.ncm === ncm && r.ativa);
    return item || null;
  }

  async criar(dados: CriarTributacaoInput): Promise<RegraTributaria> {
    const db = getLocalDb();
    const agora = new Date();
    const novaRegra: RegraTributaria = {
      id: `trib_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      descricao: dados.descricao,
      ncm: dados.ncm,
      cstIcms: dados.cstIcms,
      cfop: dados.cfop,
      aliquotaIcms: dados.aliquotaIcms,
      aliquotaPis: dados.aliquotaPis ?? 0,
      aliquotaCofins: dados.aliquotaCofins ?? 0,
      ativa: dados.ativa ?? true,
      criadoEm: agora,
      atualizadoEm: agora,
    };

    db.insert<RegraTributaria>(TABLE_NAME, novaRegra);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novaRegra,
    });

    return novaRegra;
  }

  async atualizar(id: string, dados: AtualizarTributacaoInput): Promise<RegraTributaria> {
    const db = getLocalDb();
    const atualizada = db.update<RegraTributaria>(TABLE_NAME, id, {
      ...dados,
      atualizadoEm: new Date(),
    });

    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "update",
      payload: atualizada,
    });

    return atualizada;
  }
}
