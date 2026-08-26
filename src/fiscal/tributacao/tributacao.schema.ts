// Validação de entrada (zod) do módulo tributacao
import { z } from "zod";

export const criarTributacaoSchema = z.object({
  // TODO: definir campos obrigatórios de tributacao
});

export const atualizarTributacaoSchema = criarTributacaoSchema.partial();

export type CriarTributacaoDto = z.infer<typeof criarTributacaoSchema>;
export type AtualizarTributacaoDto = z.infer<typeof atualizarTributacaoSchema>;
