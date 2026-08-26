// Validação de entrada (zod) do módulo conciliacao
import { z } from "zod";

export const criarConciliacaoSchema = z.object({
  // TODO: definir campos obrigatórios de conciliacao
});

export const atualizarConciliacaoSchema = criarConciliacaoSchema.partial();

export type CriarConciliacaoDto = z.infer<typeof criarConciliacaoSchema>;
export type AtualizarConciliacaoDto = z.infer<typeof atualizarConciliacaoSchema>;
