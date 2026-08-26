// Validação de entrada (zod) do módulo dre
import { z } from "zod";

export const criarDreSchema = z.object({
  // TODO: definir campos obrigatórios de dre
});

export const atualizarDreSchema = criarDreSchema.partial();

export type CriarDreDto = z.infer<typeof criarDreSchema>;
export type AtualizarDreDto = z.infer<typeof atualizarDreSchema>;
