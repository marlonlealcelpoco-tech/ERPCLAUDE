import type { Request, Response, NextFunction } from "express";
import { validarTokenUsuario } from "../../auth/auth.service";

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
  const authHeader = req.headers.authorization || (req.headers["x-access-token"] as string);

  if (!authHeader) {
    return res.status(401).json({ erro: "Cabeçalho de autorização não fornecido" });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
  const usuario = validarTokenUsuario(token);

  if (!usuario) {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }

  req.usuario = usuario;
  next();
}
