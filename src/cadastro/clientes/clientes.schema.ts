// Validação de entrada (zod) do módulo clientes
import { z } from "zod";

export const criarClientesSchema = z.object({
  // TODO: definir campos obrigatórios de clientes
});

export const atualizarClientesSchema = criarClientesSchema.partial();

export type CriarClientesDto = z.infer<typeof criarClientesSchema>;
export type AtualizarClientesDto = z.infer<typeof atualizarClientesSchema>;
