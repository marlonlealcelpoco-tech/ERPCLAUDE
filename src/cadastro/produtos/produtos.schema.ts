// Validação de entrada (zod) do módulo produtos
import { z } from "zod";

export const criarProdutosSchema = z.object({
  // TODO: definir campos obrigatórios de produtos
});

export const atualizarProdutosSchema = criarProdutosSchema.partial();

export type CriarProdutosDto = z.infer<typeof criarProdutosSchema>;
export type AtualizarProdutosDto = z.infer<typeof atualizarProdutosSchema>;
