import { z } from "zod";

export const emitirNfeSchema = z.object({
  destinatarioCnpjCpf: z.string().min(11, "CNPJ/CPF do destinatário é obrigatório"),
  nomeDestinatario: z.string().min(2, "Nome/Razão Social do destinatário é obrigatório"),
  valorTotal: z.number().positive("Valor total da NF-e deve ser maior que zero"),
  ambiente: z.enum(["homologacao", "producao"]).default("homologacao"),
});

export const criarNfeSchema = emitirNfeSchema;
export const atualizarNfeSchema = emitirNfeSchema.partial();

export type EmitirNfeDto = z.infer<typeof emitirNfeSchema>;
export type CriarNfeDto = EmitirNfeDto;
export type AtualizarNfeDto = z.infer<typeof atualizarNfeSchema>;
