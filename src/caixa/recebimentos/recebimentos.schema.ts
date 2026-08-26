// Validação de entrada (zod) do módulo recebimentos
import { z } from "zod";

export const criarRecebimentosSchema = z.object({
  // TODO: definir campos obrigatórios de recebimentos
});

export const atualizarRecebimentosSchema = criarRecebimentosSchema.partial();

export type CriarRecebimentosDto = z.infer<typeof criarRecebimentosSchema>;
export type AtualizarRecebimentosDto = z.infer<typeof atualizarRecebimentosSchema>;
