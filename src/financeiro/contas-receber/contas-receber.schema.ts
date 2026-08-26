// Validação de entrada (zod) do módulo contas-receber
import { z } from "zod";

export const criarContasReceberSchema = z.object({
  // TODO: definir campos obrigatórios de contas-receber
});

export const atualizarContasReceberSchema = criarContasReceberSchema.partial();

export type CriarContasReceberDto = z.infer<typeof criarContasReceberSchema>;
export type AtualizarContasReceberDto = z.infer<typeof atualizarContasReceberSchema>;
