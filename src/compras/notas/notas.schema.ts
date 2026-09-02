import { z } from "zod";

export const criarNotasSchema = z.object({
  numeroNota: z.string().min(1, "Número da nota é obrigatório"),
  chaveNfe: z.string().optional(),
  fornecedorId: z.string().min(1, "fornecedorId é obrigatório"),
  nomeFornecedor: z.string().min(1, "Nome do fornecedor é obrigatório"),
  valorTotal: z.number().positive("Valor total da nota deve ser maior que zero"),
  dataEmissao: z.string().or(z.date()).optional(),
  tipo: z.enum(["nota_balcao", "nfe_xml"]),
  lojaId: z.string().min(1, "lojaId é obrigatório"),
});

export const atualizarNotasSchema = criarNotasSchema.partial();

export type CriarNotasDto = z.infer<typeof criarNotasSchema>;
export type AtualizarNotasDto = z.infer<typeof atualizarNotasSchema>;
