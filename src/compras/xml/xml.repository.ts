import { getLocalDb } from "../../shared/database/connection";
import type { DadosXmlNfe } from "./xml.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "xml_importados";

export class XmlRepository {
  async listar(): Promise<DadosXmlNfe[]> {
    const db = getLocalDb();
    return db.find<DadosXmlNfe>(TABLE_NAME);
  }

  async buscarPorChave(chaveNfe: string): Promise<DadosXmlNfe | null> {
    const db = getLocalDb();
    const [item] = db.find<DadosXmlNfe>(TABLE_NAME, (x) => x.chaveNfe === chaveNfe);
    return item || null;
  }

  async salvar(dados: DadosXmlNfe): Promise<DadosXmlNfe> {
    const db = getLocalDb();
    db.insert<DadosXmlNfe & { id: string }>(TABLE_NAME, {
      ...dados,
      id: dados.chaveNfe || `xml_${Date.now()}`,
    });

    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: dados,
    });

    return dados;
  }
}
