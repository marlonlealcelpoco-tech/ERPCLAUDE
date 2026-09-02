import { z } from "zod";

export const formaPagamentoSchema = z.enum([
  "dinheiro",
  "debito",
  "credito",
  "pix",
  "a_prazo",
]);

export const itemVendaSchema = z.object({
  produtoId: z.string().min(1, "produtoId é obrigatório"),
  quantidade: z.number().positive("Quantidade deve ser maior que zero"),
});

export const criarPdvSchema = z.object({
  clienteId: z.string().optional(),
  itens: z.array(itemVendaSchema).min(1, "Venda deve ter pelo menos 1 item"),
  formaPagamento: formaPagamentoSchema,
  comNfce: z.boolean().default(false),
});

export const atualizarPdvSchema = criarPdvSchema.partial();

export type CriarPdvDto = z.infer<typeof criarPdvSchema>;
export type AtualizarPdvDto = z.infer<typeof atualizarPdvSchema>;
