import type { Request, Response, NextFunction } from "express";
import { NfceService } from "./nfce.service";
import { emitirNfceSchema } from "./nfce.schema";

const service = new NfceService();

export const nfceController = {
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

  async emitirNfce(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = emitirNfceSchema.parse(req.body);
      const item = await service.emitirNfce(dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
