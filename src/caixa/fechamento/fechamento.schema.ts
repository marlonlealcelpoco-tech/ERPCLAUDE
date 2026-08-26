// Validação de entrada (zod) do módulo fechamento
import { z } from "zod";

export const criarFechamentoSchema = z.object({
  // TODO: definir campos obrigatórios de fechamento
});

export const atualizarFechamentoSchema = criarFechamentoSchema.partial();

export type CriarFechamentoDto = z.infer<typeof criarFechamentoSchema>;
export type AtualizarFechamentoDto = z.infer<typeof atualizarFechamentoSchema>;
