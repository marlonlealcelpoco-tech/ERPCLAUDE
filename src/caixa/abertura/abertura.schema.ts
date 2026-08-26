// Validação de entrada (zod) do módulo abertura
import { z } from "zod";

export const criarAberturaSchema = z.object({
  // TODO: definir campos obrigatórios de abertura
});

export const atualizarAberturaSchema = criarAberturaSchema.partial();

export type CriarAberturaDto = z.infer<typeof criarAberturaSchema>;
export type AtualizarAberturaDto = z.infer<typeof atualizarAberturaSchema>;
