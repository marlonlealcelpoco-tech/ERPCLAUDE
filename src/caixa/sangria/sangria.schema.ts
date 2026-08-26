// Validação de entrada (zod) do módulo sangria
import { z } from "zod";

export const criarSangriaSchema = z.object({
  // TODO: definir campos obrigatórios de sangria
});

export const atualizarSangriaSchema = criarSangriaSchema.partial();

export type CriarSangriaDto = z.infer<typeof criarSangriaSchema>;
export type AtualizarSangriaDto = z.infer<typeof atualizarSangriaSchema>;
