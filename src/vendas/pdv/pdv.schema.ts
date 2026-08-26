// Validação de entrada (zod) do módulo pdv
import { z } from "zod";

export const criarPdvSchema = z.object({
  // TODO: definir campos obrigatórios de pdv
});

export const atualizarPdvSchema = criarPdvSchema.partial();

export type CriarPdvDto = z.infer<typeof criarPdvSchema>;
export type AtualizarPdvDto = z.infer<typeof atualizarPdvSchema>;
