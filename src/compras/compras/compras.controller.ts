import type { Request, Response, NextFunction } from "express";
import { ComprasService } from "./compras.service";
import { criarComprasSchema } from "./compras.schema";

const service = new ComprasService();

export const comprasController = {
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

  async realizarCompra(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarComprasSchema.parse(req.body);
      const usuarioId = req.usuario!.id;
      const item = await service.realizarCompra(usuarioId, dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
