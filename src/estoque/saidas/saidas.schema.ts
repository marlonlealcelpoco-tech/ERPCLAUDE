import { z } from "zod";

export const criarSaidasSchema = z.object({
  produtoId: z.string().min(1, "produtoId é obrigatório"),
  quantidade: z.number().positive("Quantidade deve ser maior que zero"),
  motivo: z.string().optional(),
});

export const atualizarSaidasSchema = criarSaidasSchema.partial();

export type CriarSaidasDto = z.infer<typeof criarSaidasSchema>;
export type AtualizarSaidasDto = z.infer<typeof atualizarSaidasSchema>;
