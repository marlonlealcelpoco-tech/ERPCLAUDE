import { z } from "zod";

export const criarLojasSchema = z.object({
  nome: z.string().min(2, "Nome da loja é obrigatório e deve ter no mínimo 2 caracteres"),
  cnpj: z.string().optional(),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  matriz: z.boolean().default(false),
  ativa: z.boolean().default(true),
});

export const atualizarLojasSchema = criarLojasSchema.partial();

export type CriarLojasDto = z.infer<typeof criarLojasSchema>;
export type AtualizarLojasDto = z.infer<typeof atualizarLojasSchema>;
