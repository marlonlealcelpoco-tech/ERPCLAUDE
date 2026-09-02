import { z } from "zod";

export const emitirNfceSchema = z.object({
  vendaId: z.string().min(1, "vendaId é obrigatório"),
  ambiente: z.enum(["homologacao", "producao"]).default("homologacao"),
});

export const criarNfceSchema = emitirNfceSchema;
export const atualizarNfceSchema = emitirNfceSchema.partial();

export type EmitirNfceDto = z.infer<typeof emitirNfceSchema>;
export type CriarNfceDto = EmitirNfceDto;
export type AtualizarNfceDto = z.infer<typeof atualizarNfceSchema>;
