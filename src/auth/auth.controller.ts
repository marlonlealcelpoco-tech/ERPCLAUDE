import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { loginSchema } from "./auth.schema";

const service = new AuthService();

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = loginSchema.parse(req.body);
      const resultado = await service.login(dados);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  },
};
