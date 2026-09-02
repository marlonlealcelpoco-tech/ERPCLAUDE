import type { Request, Response, NextFunction } from "express";
import { ContasReceberService } from "./contas-receber.service";

const service = new ContasReceberService();

export const contasReceberController = {
  async obterDemonstrativo(req: Request, res: Response, next: NextFunction) {
    try {
      const demonstrativo = await service.obterDemonstrativo();
      res.json(demonstrativo);
    } catch (err) {
      next(err);
    }
  },

  async tentarBaixarDireto(req: Request, res: Response, next: NextFunction) {
    try {
      await service.tentarBaixarDireto();
    } catch (err) {
      next(err);
    }
  },
};
