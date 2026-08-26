// Acesso a dados do módulo contas-a-prazo
// Usa o banco local da filial (ver shared/database) — cada filial tem seu próprio banco,
// então este repositório sempre lê/escreve no banco local, e a sincronização com o
// banco central acontece de forma assíncrona (ver shared/database/sync).
import { getLocalDb } from "../../shared/database/connection";
import type { ContasAPrazo, CriarContasAPrazoInput, AtualizarContasAPrazoInput } from "./contas-a-prazo.types";

export class ContasAPrazoRepository {
  async listar(): Promise<ContasAPrazo[]> {
    const db = getLocalDb();
    // TODO: query real
    return [];
  }

  async buscarPorId(id: string): Promise<ContasAPrazo | null> {
    const db = getLocalDb();
    // TODO: query real
    return null;
  }

  async criar(dados: CriarContasAPrazoInput): Promise<ContasAPrazo> {
    const db = getLocalDb();
    // TODO: insert real + marcar para sincronização
    throw new Error("Não implementado");
  }

  async atualizar(id: string, dados: AtualizarContasAPrazoInput): Promise<ContasAPrazo> {
    const db = getLocalDb();
    // TODO: update real + marcar para sincronização
    throw new Error("Não implementado");
  }
}
