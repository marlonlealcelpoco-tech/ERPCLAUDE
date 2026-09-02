import { getLocalDb } from "../../shared/database/connection";
import type { NotaCompra, CriarNotaCompraInput } from "./notas.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "notas_compra";

export class NotasRepository {
  async listar(): Promise<NotaCompra[]> {
    const db = getLocalDb();
    return db.find<NotaCompra>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<NotaCompra | null> {
    const db = getLocalDb();
    return db.findById<NotaCompra>(TABLE_NAME, id);
  }

  async criar(dados: CriarNotaCompraInput): Promise<NotaCompra> {
    const db = getLocalDb();
    const agora = new Date();
    const novaNota: NotaCompra = {
      id: `nta_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      numeroNota: dados.numeroNota,
      chaveNfe: dados.chaveNfe,
      fornecedorId: dados.fornecedorId,
      nomeFornecedor: dados.nomeFornecedor,
      valorTotal: dados.valorTotal,
      dataEmissao: dados.dataEmissao ? new Date(dados.dataEmissao) : agora,
      tipo: dados.tipo,
      lojaId: dados.lojaId,
      criadoEm: agora,
    };

    db.insert<NotaCompra>(TABLE_NAME, novaNota);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novaNota,
    });

    return novaNota;
  }
}
