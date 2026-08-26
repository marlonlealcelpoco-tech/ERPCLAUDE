// Validação de entrada (zod) do módulo fornecedores
import { z } from "zod";

export const criarFornecedoresSchema = z.object({
  // TODO: definir campos obrigatórios de fornecedores
});

export const atualizarFornecedoresSchema = criarFornecedoresSchema.partial();

export type CriarFornecedoresDto = z.infer<typeof criarFornecedoresSchema>;
export type AtualizarFornecedoresDto = z.infer<typeof atualizarFornecedoresSchema>;
