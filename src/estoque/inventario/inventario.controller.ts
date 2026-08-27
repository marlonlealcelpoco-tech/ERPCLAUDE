import type { Request, Response, NextFunction } from "express";
import { InventarioService } from "./inventario.service";
import { criarInventarioSchema } from "./inventario.schema";

const service = new InventarioService();

export const inventarioController = {
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

  async realizarInventario(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarInventarioSchema.parse(req.body);
      const usuarioId = req.usuario!.id;
      const lojaId = req.usuario!.lojaId;
      const item = await service.realizarInventario(usuarioId, lojaId, dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
