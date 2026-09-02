import { getLocalDb } from "../../shared/database/connection";
import type { ContaPagar, CriarContaPagarInput, BaixarContaPagarInput } from "./contas-pagar.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "contas_pagar";

export class ContasPagarRepository {
  async listar(): Promise<ContaPagar[]> {
    const db = getLocalDb();
    return db.find<ContaPagar>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<ContaPagar | null> {
    const db = getLocalDb();
    return db.findById<ContaPagar>(TABLE_NAME, id);
  }

  async buscarPorCompraId(compraId: string): Promise<ContaPagar[]> {
    const db = getLocalDb();
    return db.find<ContaPagar>(TABLE_NAME, (c) => c.compraId === compraId);
  }

  async criar(dados: CriarContaPagarInput): Promise<ContaPagar> {
    const db = getLocalDb();
    const agora = new Date();
    const novaConta: ContaPagar = {
      id: `cpag_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      compraId: dados.compraId,
      fornecedorId: dados.fornecedorId,
      descricao: dados.descricao,
      valorOriginal: dados.valorOriginal,
      valorPago: 0,
      status: "pendente",
      dataVencimento: new Date(dados.dataVencimento),
      lojaId: dados.lojaId,
      criadoEm: agora,
      atualizadoEm: agora,
    };

    db.insert<ContaPagar>(TABLE_NAME, novaConta);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novaConta,
    });

    return novaConta;
  }

  async baixar(id: string, dados: BaixarContaPagarInput): Promise<ContaPagar> {
    const db = getLocalDb();
    const conta = db.findById<ContaPagar>(TABLE_NAME, id);
    if (!conta) throw new Error("Conta a pagar não encontrada");

    const novoValorPago = conta.valorPago + dados.valorPago;
    const status = novoValorPago >= conta.valorOriginal ? "pago" : "pago_parcial";
    const dataPagamento = dados.dataPagamento ? new Date(dados.dataPagamento) : new Date();

    const atualizada = db.update<ContaPagar>(TABLE_NAME, id, {
      valorPago: novoValorPago,
      status,
      dataPagamento,
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
