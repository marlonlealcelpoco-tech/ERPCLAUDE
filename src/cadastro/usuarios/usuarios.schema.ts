// Validação de entrada (zod) do módulo usuarios
import { z } from "zod";

export const criarUsuariosSchema = z.object({
  // TODO: definir campos obrigatórios de usuarios
});

export const atualizarUsuariosSchema = criarUsuariosSchema.partial();

export type CriarUsuariosDto = z.infer<typeof criarUsuariosSchema>;
export type AtualizarUsuariosDto = z.infer<typeof atualizarUsuariosSchema>;
