// Middleware central de tratamento de erros. Registrado por último no server.ts.
import type { Request, Response, NextFunction } from "express";
import { AppError } from "./app-error";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message });
  }

  console.error(err);
  return res.status(500).json({ erro: "Erro interno do servidor" });
}
