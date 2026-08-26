// Validação de entrada (zod) do módulo contas-pagar
import { z } from "zod";

export const criarContasPagarSchema = z.object({
  // TODO: definir campos obrigatórios de contas-pagar
});

export const atualizarContasPagarSchema = criarContasPagarSchema.partial();

export type CriarContasPagarDto = z.infer<typeof criarContasPagarSchema>;
export type AtualizarContasPagarDto = z.infer<typeof atualizarContasPagarSchema>;
