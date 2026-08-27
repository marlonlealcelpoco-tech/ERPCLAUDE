import type { Request, Response, NextFunction } from "express";
import { RelatoriosService } from "./relatorios.service";
import { filtroRelatorioGeralSchema } from "./relatorios.schema";

const service = new RelatoriosService();

export const relatoriosController = {
  async gerarRelatorioGeral(req: Request, res: Response, next: NextFunction) {
    try {
      const filtro = filtroRelatorioGeralSchema.parse(req.query);
      const relatorio = await service.gerarRelatorioGeral(filtro);
      res.json(relatorio);
    } catch (err) {
      next(err);
    }
  },
};
