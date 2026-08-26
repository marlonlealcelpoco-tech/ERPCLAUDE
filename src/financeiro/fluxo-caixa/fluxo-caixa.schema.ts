// Validação de entrada (zod) do módulo fluxo-caixa
import { z } from "zod";

export const criarFluxoCaixaSchema = z.object({
  // TODO: definir campos obrigatórios de fluxo-caixa
});

export const atualizarFluxoCaixaSchema = criarFluxoCaixaSchema.partial();

export type CriarFluxoCaixaDto = z.infer<typeof criarFluxoCaixaSchema>;
export type AtualizarFluxoCaixaDto = z.infer<typeof atualizarFluxoCaixaSchema>;
