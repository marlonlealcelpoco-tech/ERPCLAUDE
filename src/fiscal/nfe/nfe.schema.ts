// Validação de entrada (zod) do módulo nfe
import { z } from "zod";

export const criarNfeSchema = z.object({
  // TODO: definir campos obrigatórios de nfe
});

export const atualizarNfeSchema = criarNfeSchema.partial();

export type CriarNfeDto = z.infer<typeof criarNfeSchema>;
export type AtualizarNfeDto = z.infer<typeof atualizarNfeSchema>;
