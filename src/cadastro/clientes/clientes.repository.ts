import { getLocalDb } from "../../shared/database/connection";
import type { Cliente, CriarClienteInput, AtualizarClienteInput } from "./clientes.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "clientes";

export class ClientesRepository {
  async listar(): Promise<Cliente[]> {
    const db = getLocalDb();
    return db.find<Cliente>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<Cliente | null> {
    const db = getLocalDb();
    return db.findById<Cliente>(TABLE_NAME, id);
  }

  async buscarPorTermo(termo: string): Promise<Cliente[]> {
    const db = getLocalDb();
    const termoLower = termo.toLowerCase();
    return db.find<Cliente>(TABLE_NAME, (c) =>
      c.nome.toLowerCase().includes(termoLower) ||
      (c.cpfCnpj ? c.cpfCnpj.includes(termoLower) : false) ||
      (c.telefone ? c.telefone.includes(termoLower) : false)
    );
  }

  async criar(dados: CriarClienteInput): Promise<Cliente> {
    const db = getLocalDb();
    const agora = new Date();
    const novoCliente: Cliente = {
      id: `cli_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      nome: dados.nome,
      cpfCnpj: dados.cpfCnpj,
      telefone: dados.telefone,
      email: dados.email,
      endereco: dados.endereco,
      limiteCredito: dados.limiteCredito ?? 0,
      saldoDevedor: 0,
      criadoEm: agora,
      atualizadoEm: agora,
    };

    db.insert<Cliente>(TABLE_NAME, novoCliente);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novoCliente,
    });

    return novoCliente;
  }

  async atualizar(id: string, dados: AtualizarClienteInput): Promise<Cliente> {
    const db = getLocalDb();
    const payload = {
      ...dados,
      atualizadoEm: new Date(),
    };

    const clienteAtualizado = db.update<Cliente>(TABLE_NAME, id, payload);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "update",
      payload: clienteAtualizado,
    });

    return clienteAtualizado;
  }
}
