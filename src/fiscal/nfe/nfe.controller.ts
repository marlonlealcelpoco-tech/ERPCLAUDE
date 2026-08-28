import type { Request, Response, NextFunction } from "express";
import { NfeService } from "./nfe.service";
import { emitirNfeSchema } from "./nfe.schema";

const service = new NfeService();

export const nfeController = {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const itens = await service.listar();
      res.json(itens);
    } catch (err) {
      next(err);
    }
  },

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await service.buscarPorId(req.params.id);
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  async emitirNfe(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = emitirNfeSchema.parse(req.body);
      const item = await service.emitirNfe(dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
