// Validação de entrada (zod) do módulo xml
import { z } from "zod";

export const criarXmlSchema = z.object({
  // TODO: definir campos obrigatórios de xml
});

export const atualizarXmlSchema = criarXmlSchema.partial();

export type CriarXmlDto = z.infer<typeof criarXmlSchema>;
export type AtualizarXmlDto = z.infer<typeof atualizarXmlSchema>;
