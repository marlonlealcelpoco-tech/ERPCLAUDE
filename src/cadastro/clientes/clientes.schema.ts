import { z } from "zod";

export const criarClientesSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório e deve ter no mínimo 2 caracteres"),
  cpfCnpj: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  endereco: z.string().optional(),
  limiteCredito: z.number().nonnegative("Limite de crédito não pode ser negativo").default(0),
});

export const atualizarClientesSchema = criarClientesSchema.partial().extend({
  saldoDevedor: z.number().optional(),
});

export type CriarClientesDto = z.infer<typeof criarClientesSchema>;
export type AtualizarClientesDto = z.infer<typeof atualizarClientesSchema>;
