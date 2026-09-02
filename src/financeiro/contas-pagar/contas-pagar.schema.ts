import { z } from "zod";

export const criarContasPagarSchema = z.object({
  compraId: z.string().optional(),
  fornecedorId: z.string().min(1, "fornecedorId é obrigatório"),
  descricao: z.string().min(2, "Descrição é obrigatória"),
  valorOriginal: z.number().positive("Valor original deve ser maior que zero"),
  dataVencimento: z.string().or(z.date()),
  lojaId: z.string().min(1, "lojaId é obrigatório"),
});

export const baixarContasPagarSchema = z.object({
  valorPago: z.number().positive("Valor pago deve ser maior que zero"),
  dataPagamento: z.string().or(z.date()).optional(),
});

export const atualizarContasPagarSchema = criarContasPagarSchema.partial();

export type CriarContasPagarDto = z.infer<typeof criarContasPagarSchema>;
export type BaixarContasPagarDto = z.infer<typeof baixarContasPagarSchema>;
export type AtualizarContasPagarDto = z.infer<typeof atualizarContasPagarSchema>;
