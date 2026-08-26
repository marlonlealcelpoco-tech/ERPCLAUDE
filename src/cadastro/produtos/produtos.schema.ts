import { z } from "zod";

export const criarProdutosSchema = z.object({
  nome: z.string().min(2, "Nome do produto deve ter no mínimo 2 caracteres"),
  codigoBarras: z.string().optional(),
  precoCusto: z.number().nonnegative("Preço de custo não pode ser negativo"),
  precoVenda: z.number().positive("Preço de venda deve ser maior que zero"),
  estoqueAtual: z.number().default(0),
  categoria: z.string().optional(),
  fornecedorId: z.string().optional(),
  ativo: z.boolean().default(true),
});

export const atualizarProdutosSchema = criarProdutosSchema.partial();

export type CriarProdutosDto = z.infer<typeof criarProdutosSchema>;
export type AtualizarProdutosDto = z.infer<typeof atualizarProdutosSchema>;
