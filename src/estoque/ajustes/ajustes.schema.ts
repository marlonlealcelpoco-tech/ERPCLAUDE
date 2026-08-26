// Validação de entrada (zod) do módulo ajustes
import { z } from "zod";

export const criarAjustesSchema = z.object({
  // TODO: definir campos obrigatórios de ajustes
});

export const atualizarAjustesSchema = criarAjustesSchema.partial();

export type CriarAjustesDto = z.infer<typeof criarAjustesSchema>;
export type AtualizarAjustesDto = z.infer<typeof atualizarAjustesSchema>;
