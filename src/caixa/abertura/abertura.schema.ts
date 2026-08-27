import { z } from "zod";

export const criarAberturaSchema = z.object({
  valorInicial: z.number().nonnegative("Valor inicial não pode ser negativo"),
});

export const atualizarAberturaSchema = criarAberturaSchema.partial();

export type CriarAberturaDto = z.infer<typeof criarAberturaSchema>;
export type AtualizarAberturaDto = z.infer<typeof atualizarAberturaSchema>;
