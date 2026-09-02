import { z } from "zod";

export const itemCompraInputSchema = z.object({
  produtoId: z.string().optional(),
  nomeProduto: z.string().min(1, "Nome do produto é obrigatório"),
  codigoBarras: z.string().optional(),
  quantidade: z.number().positive("Quantidade deve ser maior que zero"),
  precoCusto: z.number().nonnegative("Preço de custo não pode ser negativo"),
  precoVenda: z.number().positive("Preço de venda deve ser maior que zero").optional(),
});

export const criarComprasSchema = z.object({
  numeroNota: z.string().min(1, "Número da nota é obrigatório"),
  fornecedorId: z.string().min(1, "fornecedorId é obrigatório"),
  lojaId: z.string().min(1, "lojaId é obrigatório"),
  tipo: z.enum(["manual", "xml"]).default("manual"),
  formaPagamento: z.enum(["a_vista", "a_prazo"]),
  numeroParcelas: z.number().int().min(1).default(1),
  diasIntervaloParcelas: z.number().int().min(1).default(30),
  itens: z.array(itemCompraInputSchema).min(1, "Compra deve possuir pelo menos 1 item"),
});

export const atualizarComprasSchema = criarComprasSchema.partial();

export type CriarComprasDto = z.infer<typeof criarComprasSchema>;
export type AtualizarComprasDto = z.infer<typeof atualizarComprasSchema>;
