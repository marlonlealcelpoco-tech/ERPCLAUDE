// Validação de entrada (zod) do módulo relatorios
import { z } from "zod";

export const criarRelatoriosSchema = z.object({
  // TODO: definir campos obrigatórios de relatorios
});

export const atualizarRelatoriosSchema = criarRelatoriosSchema.partial();

export type CriarRelatoriosDto = z.infer<typeof criarRelatoriosSchema>;
export type AtualizarRelatoriosDto = z.infer<typeof atualizarRelatoriosSchema>;
