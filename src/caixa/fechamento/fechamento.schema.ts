import { z } from "zod";

export const criarFechamentoSchema = z.object({
  dinheiroContado: z.number().nonnegative("Dinheiro contado não pode ser negativo"),
});

export const atualizarFechamentoSchema = criarFechamentoSchema.partial();

export type CriarFechamentoDto = z.infer<typeof criarFechamentoSchema>;
export type AtualizarFechamentoDto = z.infer<typeof atualizarFechamentoSchema>;
