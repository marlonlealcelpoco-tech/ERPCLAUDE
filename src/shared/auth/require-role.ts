// Middleware de autorização por perfil (ver hierarquia de acesso no desenho-erp.md).
import type { Request, Response, NextFunction } from "express";
import type { UsuarioAutenticado } from "./require-auth";
import { ForbiddenError } from "../errors/app-error";

export function requireRole(...perfisPermitidos: UsuarioAutenticado["perfil"][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const perfil = req.usuario?.perfil;
    if (!perfil || !perfisPermitidos.includes(perfil)) {
      return next(new ForbiddenError());
    }
    next();
  };
}
