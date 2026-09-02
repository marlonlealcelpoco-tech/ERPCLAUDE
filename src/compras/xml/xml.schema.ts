import { z } from "zod";

export const parseXmlSchema = z.object({
  conteudoXml: z.string().min(10, "Conteúdo XML é obrigatório"),
});

export const criarXmlSchema = parseXmlSchema;
export const atualizarXmlSchema = parseXmlSchema.partial();

export type ParseXmlDto = z.infer<typeof parseXmlSchema>;
export type CriarXmlDto = ParseXmlDto;
export type AtualizarXmlDto = z.infer<typeof atualizarXmlSchema>;
