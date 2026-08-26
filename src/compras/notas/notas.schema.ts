// Validação de entrada (zod) do módulo notas
import { z } from "zod";

export const criarNotasSchema = z.object({
  // TODO: definir campos obrigatórios de notas
});

export const atualizarNotasSchema = criarNotasSchema.partial();

export type CriarNotasDto = z.infer<typeof criarNotasSchema>;
export type AtualizarNotasDto = z.infer<typeof atualizarNotasSchema>;
