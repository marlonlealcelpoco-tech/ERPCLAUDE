import type { Request, Response, NextFunction } from "express";
import { PdvService } from "./pdv.service";
import { criarPdvSchema } from "./pdv.schema";

const service = new PdvService();

export const pdvController = {
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

  async realizarVenda(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarPdvSchema.parse(req.body);
      const vendedorId = req.usuario!.id;
      const lojaId = req.usuario!.lojaId;
      const item = await service.realizarVenda(vendedorId, lojaId, dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
