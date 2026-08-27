import { z } from "zod";

export const criarContasAPrazoSchema = z.object({
  vendaId: z.string().min(1, "vendaId é obrigatório"),
  clienteId: z.string().min(1, "clienteId é obrigatório"),
  valorOriginal: z.number().positive("Valor original deve ser maior que zero"),
});

export const atualizarContasAPrazoSchema = z.object({
  valorSaldo: z.number().nonnegative("Valor saldo não pode ser negativo").optional(),
});

export type CriarContasAPrazoDto = z.infer<typeof criarContasAPrazoSchema>;
export type AtualizarContasAPrazoDto = z.infer<typeof atualizarContasAPrazoSchema>;
