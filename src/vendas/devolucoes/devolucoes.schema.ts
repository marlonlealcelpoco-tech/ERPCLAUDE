// Validação de entrada (zod) do módulo devolucoes
import { z } from "zod";

export const criarDevolucoesSchema = z.object({
  // TODO: definir campos obrigatórios de devolucoes
});

export const atualizarDevolucoesSchema = criarDevolucoesSchema.partial();

export type CriarDevolucoesDto = z.infer<typeof criarDevolucoesSchema>;
export type AtualizarDevolucoesDto = z.infer<typeof atualizarDevolucoesSchema>;
