import type { Request, Response, NextFunction } from "express";
import { SangriaService } from "./sangria.service";
import { criarSangriaSchema } from "./sangria.schema";

const service = new SangriaService();

export const sangriaController = {
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

  async registrarSangria(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarSangriaSchema.parse(req.body);
      const usuarioId = req.usuario!.id;
      const item = await service.registrarSangria(usuarioId, dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
