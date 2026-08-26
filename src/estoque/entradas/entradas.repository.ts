// Acesso a dados do módulo entradas
// Usa o banco local da filial (ver shared/database) — cada filial tem seu próprio banco,
// então este repositório sempre lê/escreve no banco local, e a sincronização com o
// banco central acontece de forma assíncrona (ver shared/database/sync).
import { getLocalDb } from "../../shared/database/connection";
import type { Entradas, CriarEntradasInput, AtualizarEntradasInput } from "./entradas.types";

export class EntradasRepository {
  async listar(): Promise<Entradas[]> {
    const db = getLocalDb();
    // TODO: query real
    return [];
  }

  async buscarPorId(id: string): Promise<Entradas | null> {
    const db = getLocalDb();
    // TODO: query real
    return null;
  }

  async criar(dados: CriarEntradasInput): Promise<Entradas> {
    const db = getLocalDb();
    // TODO: insert real + marcar para sincronização
    throw new Error("Não implementado");
  }

  async atualizar(id: string, dados: AtualizarEntradasInput): Promise<Entradas> {
    const db = getLocalDb();
    // TODO: update real + marcar para sincronização
    throw new Error("Não implementado");
  }
}
