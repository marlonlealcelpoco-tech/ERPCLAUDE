import { z } from "zod";

export const criarDevolucoesSchema = z.object({
  vendaId: z.string().min(1, "vendaId é obrigatório"),
  produtoId: z.string().optional(),
  motivo: z.string().optional(),
  restaurarEstoque: z.boolean().default(true),
});

export const atualizarDevolucoesSchema = criarDevolucoesSchema.partial();

export type CriarDevolucoesDto = z.infer<typeof criarDevolucoesSchema>;
export type AtualizarDevolucoesDto = z.infer<typeof atualizarDevolucoesSchema>;
