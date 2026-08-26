// Validação de entrada (zod) do módulo inventario
import { z } from "zod";

export const criarInventarioSchema = z.object({
  // TODO: definir campos obrigatórios de inventario
});

export const atualizarInventarioSchema = criarInventarioSchema.partial();

export type CriarInventarioDto = z.infer<typeof criarInventarioSchema>;
export type AtualizarInventarioDto = z.infer<typeof atualizarInventarioSchema>;
