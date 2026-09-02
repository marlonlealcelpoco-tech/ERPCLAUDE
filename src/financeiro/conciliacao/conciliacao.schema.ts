import { z } from "zod";

export const criarConciliacaoSchema = z.object({
  lojaId: z.string().min(1, "lojaId é obrigatório"),
  saldoExtrato: z.number("Saldo do extrato bancário é obrigatório"),
  observacao: z.string().optional(),
});

export const atualizarConciliacaoSchema = criarConciliacaoSchema.partial();

export type CriarConciliacaoDto = z.infer<typeof criarConciliacaoSchema>;
export type AtualizarConciliacaoDto = z.infer<typeof atualizarConciliacaoSchema>;
