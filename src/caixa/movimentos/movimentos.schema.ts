// Validação de entrada (zod) do módulo movimentos
import { z } from "zod";

export const criarMovimentosSchema = z.object({
  // TODO: definir campos obrigatórios de movimentos
});

export const atualizarMovimentosSchema = criarMovimentosSchema.partial();

export type CriarMovimentosDto = z.infer<typeof criarMovimentosSchema>;
export type AtualizarMovimentosDto = z.infer<typeof atualizarMovimentosSchema>;
