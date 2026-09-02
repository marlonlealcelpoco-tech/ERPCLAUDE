import { z } from "zod";

export const criarEntradasSchema = z.object({
  produtoId: z.string().min(1, "produtoId é obrigatório"),
  quantidade: z.number().positive("Quantidade deve ser maior que zero"),
  observacao: z.string().optional(),
});

export const atualizarEntradasSchema = criarEntradasSchema.partial();

export type CriarEntradasDto = z.infer<typeof criarEntradasSchema>;
export type AtualizarEntradasDto = z.infer<typeof atualizarEntradasSchema>;
