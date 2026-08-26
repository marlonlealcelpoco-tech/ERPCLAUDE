// Validação de entrada (zod) do módulo compras
import { z } from "zod";

export const criarComprasSchema = z.object({
  // TODO: definir campos obrigatórios de compras
});

export const atualizarComprasSchema = criarComprasSchema.partial();

export type CriarComprasDto = z.infer<typeof criarComprasSchema>;
export type AtualizarComprasDto = z.infer<typeof atualizarComprasSchema>;
