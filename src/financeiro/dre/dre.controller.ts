import type { Request, Response, NextFunction } from "express";
import { DreService } from "./dre.service";
import { filtroDreSchema } from "./dre.schema";

const service = new DreService();

export const dreController = {
  async calcularDre(req: Request, res: Response, next: NextFunction) {
    try {
      const filtro = filtroDreSchema.parse(req.query);
      const dre = await service.calcularDre(filtro);
      res.json(dre);
    } catch (err) {
      next(err);
    }
  },
};
