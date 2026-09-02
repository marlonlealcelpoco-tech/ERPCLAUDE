import { z } from "zod";

export const criarTributacaoSchema = z.object({
  descricao: z.string().min(2, "Descrição da regra tributária é obrigatória"),
  ncm: z.string().min(8, "NCM deve possuir 8 dígitos"),
  cstIcms: z.string().min(2, "CST ICMS é obrigatório"),
  cfop: z.string().min(4, "CFOP é obrigatório"),
  aliquotaIcms: z.number().nonnegative("Alíquota ICMS não pode ser negativa"),
  aliquotaPis: z.number().nonnegative().default(0),
  aliquotaCofins: z.number().nonnegative().default(0),
  ativa: z.boolean().default(true),
});

export const atualizarTributacaoSchema = criarTributacaoSchema.partial();

export type CriarTributacaoDto = z.infer<typeof criarTributacaoSchema>;
export type AtualizarTributacaoDto = z.infer<typeof atualizarTributacaoSchema>;
