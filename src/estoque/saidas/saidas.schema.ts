// Validação de entrada (zod) do módulo saidas
import { z } from "zod";

export const criarSaidasSchema = z.object({
  // TODO: definir campos obrigatórios de saidas
});

export const atualizarSaidasSchema = criarSaidasSchema.partial();

export type CriarSaidasDto = z.infer<typeof criarSaidasSchema>;
export type AtualizarSaidasDto = z.infer<typeof atualizarSaidasSchema>;
