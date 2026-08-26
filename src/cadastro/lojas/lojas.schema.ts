// Validação de entrada (zod) do módulo lojas
import { z } from "zod";

export const criarLojasSchema = z.object({
  // TODO: definir campos obrigatórios de lojas
});

export const atualizarLojasSchema = criarLojasSchema.partial();

export type CriarLojasDto = z.infer<typeof criarLojasSchema>;
export type AtualizarLojasDto = z.infer<typeof atualizarLojasSchema>;
