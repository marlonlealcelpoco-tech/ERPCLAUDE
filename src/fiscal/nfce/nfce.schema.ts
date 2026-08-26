// Validação de entrada (zod) do módulo nfce
import { z } from "zod";

export const criarNfceSchema = z.object({
  // TODO: definir campos obrigatórios de nfce
});

export const atualizarNfceSchema = criarNfceSchema.partial();

export type CriarNfceDto = z.infer<typeof criarNfceSchema>;
export type AtualizarNfceDto = z.infer<typeof atualizarNfceSchema>;
