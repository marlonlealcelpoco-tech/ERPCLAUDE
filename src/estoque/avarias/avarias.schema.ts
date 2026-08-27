import { z } from "zod";

export const tipoAvariaSchema = z.enum([
  "avaria",
  "perda",
  "validade_vencida",
  "outro",
]);

export const criarAvariasSchema = z.object({
  produtoId: z.string().min(1, "produtoId é obrigatório"),
  quantidade: z.number().positive("Quantidade deve ser maior que zero"),
  tipo: tipoAvariaSchema,
  motivo: z.string().optional(),
});

export const atualizarAvariasSchema = criarAvariasSchema.partial();

export type CriarAvariasDto = z.infer<typeof criarAvariasSchema>;
export type AtualizarAvariasDto = z.infer<typeof atualizarAvariasSchema>;
