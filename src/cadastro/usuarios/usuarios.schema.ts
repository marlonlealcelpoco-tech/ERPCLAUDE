import { z } from "zod";

export const perfilUsuarioSchema = z.enum([
  "vendedor",
  "supervisor",
  "estoquista",
  "gerente",
  "financeiro",
  "administrador",
]);

export const criarUsuariosSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  login: z.string().min(3, "Login deve ter pelo menos 3 caracteres"),
  senha: z.string().min(4, "Senha deve ter pelo menos 4 caracteres").optional(),
  perfil: perfilUsuarioSchema,
  lojaId: z.string().min(1, "lojaId é obrigatório"),
  ativo: z.boolean().default(true),
});

export const atualizarUsuariosSchema = criarUsuariosSchema.partial();

export type CriarUsuariosDto = z.infer<typeof criarUsuariosSchema>;
export type AtualizarUsuariosDto = z.infer<typeof atualizarUsuariosSchema>;
