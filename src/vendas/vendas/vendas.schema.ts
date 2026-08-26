// Validação de entrada (zod) do módulo vendas
import { z } from "zod";

export const criarVendasSchema = z.object({
  // TODO: definir campos obrigatórios de vendas
});

export const atualizarVendasSchema = criarVendasSchema.partial();

export type CriarVendasDto = z.infer<typeof criarVendasSchema>;
export type AtualizarVendasDto = z.infer<typeof atualizarVendasSchema>;
