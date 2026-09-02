import { getLocalDb } from "../../shared/database/connection";
import type { Fornecedor, CriarFornecedorInput, AtualizarFornecedorInput } from "./fornecedores.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "fornecedores";

export class FornecedoresRepository {
  async listar(): Promise<Fornecedor[]> {
    const db = getLocalDb();
    return db.find<Fornecedor>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<Fornecedor | null> {
    const db = getLocalDb();
    return db.findById<Fornecedor>(TABLE_NAME, id);
  }

  async criar(dados: CriarFornecedorInput): Promise<Fornecedor> {
    const db = getLocalDb();
    const agora = new Date();
    const novoFornecedor: Fornecedor = {
      id: `for_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      nomeRazao: dados.nomeRazao,
      nomeFantasia: dados.nomeFantasia,
      cnpjCpf: dados.cnpjCpf,
      telefone: dados.telefone,
      email: dados.email,
      endereco: dados.endereco,
      criadoEm: agora,
      atualizadoEm: agora,
    };

    db.insert<Fornecedor>(TABLE_NAME, novoFornecedor);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novoFornecedor,
    });

    return novoFornecedor;
  }

  async atualizar(id: string, dados: AtualizarFornecedorInput): Promise<Fornecedor> {
    const db = getLocalDb();
    const payload = {
      ...dados,
      atualizadoEm: new Date(),
    };

    const fornecedorAtualizado = db.update<Fornecedor>(TABLE_NAME, id, payload);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "update",
      payload: fornecedorAtualizado,
    });

    return fornecedorAtualizado;
  }
}
