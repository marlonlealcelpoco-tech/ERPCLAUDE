// Validação de entrada (zod) do módulo entradas
import { z } from "zod";

export const criarEntradasSchema = z.object({
  // TODO: definir campos obrigatórios de entradas
});

export const atualizarEntradasSchema = criarEntradasSchema.partial();

export type CriarEntradasDto = z.infer<typeof criarEntradasSchema>;
export type AtualizarEntradasDto = z.infer<typeof atualizarEntradasSchema>;
