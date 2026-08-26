// Validação de entrada (zod) do módulo contas-a-prazo
import { z } from "zod";

export const criarContasAPrazoSchema = z.object({
  // TODO: definir campos obrigatórios de contas-a-prazo
});

export const atualizarContasAPrazoSchema = criarContasAPrazoSchema.partial();

export type CriarContasAPrazoDto = z.infer<typeof criarContasAPrazoSchema>;
export type AtualizarContasAPrazoDto = z.infer<typeof atualizarContasAPrazoSchema>;
