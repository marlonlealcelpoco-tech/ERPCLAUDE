import { z } from "zod";

export const criarAjustesSchema = z.object({
  produtoId: z.string().min(1, "produtoId é obrigatório"),
  novoEstoque: z.number().nonnegative("Novo estoque não pode ser negativo"),
  justificativa: z.string().min(3, "Justificativa de ajuste é obrigatória (mínimo 3 caracteres)"),
});

export const atualizarAjustesSchema = criarAjustesSchema.partial();

export type CriarAjustesDto = z.infer<typeof criarAjustesSchema>;
export type AtualizarAjustesDto = z.infer<typeof atualizarAjustesSchema>;
