// Acesso a dados do módulo nfe
// Usa o banco local da filial (ver shared/database) — cada filial tem seu próprio banco,
// então este repositório sempre lê/escreve no banco local, e a sincronização com o
// banco central acontece de forma assíncrona (ver shared/database/sync).
import { getLocalDb } from "../../shared/database/connection";
import type { Nfe, CriarNfeInput, AtualizarNfeInput } from "./nfe.types";

export class NfeRepository {
  async listar(): Promise<Nfe[]> {
    const db = getLocalDb();
    // TODO: query real
    return [];
  }

  async buscarPorId(id: string): Promise<Nfe | null> {
    const db = getLocalDb();
    // TODO: query real
    return null;
  }

  async criar(dados: CriarNfeInput): Promise<Nfe> {
    const db = getLocalDb();
    // TODO: insert real + marcar para sincronização
    throw new Error("Não implementado");
  }

  async atualizar(id: string, dados: AtualizarNfeInput): Promise<Nfe> {
    const db = getLocalDb();
    // TODO: update real + marcar para sincronização
    throw new Error("Não implementado");
  }
}
