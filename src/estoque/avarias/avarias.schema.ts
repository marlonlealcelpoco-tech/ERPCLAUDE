// Validação de entrada (zod) do módulo avarias
import { z } from "zod";

export const criarAvariasSchema = z.object({
  // TODO: definir campos obrigatórios de avarias
});

export const atualizarAvariasSchema = criarAvariasSchema.partial();

export type CriarAvariasDto = z.infer<typeof criarAvariasSchema>;
export type AtualizarAvariasDto = z.infer<typeof atualizarAvariasSchema>;
