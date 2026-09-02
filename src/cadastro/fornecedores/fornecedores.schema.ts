import { z } from "zod";

export const criarFornecedoresSchema = z.object({
  nomeRazao: z.string().min(2, "Razão Social / Nome é obrigatório e deve ter no mínimo 2 caracteres"),
  nomeFantasia: z.string().optional(),
  cnpjCpf: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  endereco: z.string().optional(),
});

export const atualizarFornecedoresSchema = criarFornecedoresSchema.partial();

export type CriarFornecedoresDto = z.infer<typeof criarFornecedoresSchema>;
export type AtualizarFornecedoresDto = z.infer<typeof atualizarFornecedoresSchema>;
