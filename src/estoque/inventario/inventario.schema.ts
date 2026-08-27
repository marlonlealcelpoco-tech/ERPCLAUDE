import { z } from "zod";

export const itemInventarioInputSchema = z.object({
  produtoId: z.string().min(1, "produtoId é obrigatório"),
  quantidadeContada: z.number().nonnegative("Quantidade contada não pode ser negativa"),
});

export const criarInventarioSchema = z.object({
  itens: z.array(itemInventarioInputSchema).min(1, "Inventário deve conter pelo menos 1 item contado"),
  observacao: z.string().optional(),
});

export const atualizarInventarioSchema = criarInventarioSchema.partial();

export type CriarInventarioDto = z.infer<typeof criarInventarioSchema>;
export type AtualizarInventarioDto = z.infer<typeof atualizarInventarioSchema>;
