import type { Request, Response, NextFunction } from "express";
import { AjustesService } from "./ajustes.service";
import { criarAjustesSchema } from "./ajustes.schema";

const service = new AjustesService();

export const ajustesController = {
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

  async registrarAjuste(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarAjustesSchema.parse(req.body);
      const usuarioId = req.usuario!.id;
      const item = await service.registrarAjuste(usuarioId, dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
