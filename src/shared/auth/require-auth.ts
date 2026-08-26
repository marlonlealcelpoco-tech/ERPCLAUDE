// Middleware de autenticação. Garante que a requisição tem um usuário logado
// e injeta req.usuario para uso nos controllers/services.
import type { Request, Response, NextFunction } from "express";

export interface UsuarioAutenticado {
  id: string;
  nome: string;
  perfil: "vendedor" | "supervisor" | "estoquista" | "gerente" | "financeiro" | "administrador";
  lojaId: string;
}

declare module "express-serve-static-core" {
  interface Request {
    usuario?: UsuarioAutenticado;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // TODO: validar token/sessão real e popular req.usuario
  const usuarioFake: UsuarioAutenticado | undefined = undefined;

  if (!usuarioFake) {
    return res.status(401).json({ erro: "Não autenticado" });
  }

  req.usuario = usuarioFake;
  next();
}
