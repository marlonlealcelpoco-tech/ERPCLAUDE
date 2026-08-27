import type { Request, Response, NextFunction } from "express";
import { NotasService } from "./notas.service";
import { criarNotasSchema } from "./notas.schema";

const service = new NotasService();

export const notasController = {
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

  async registrarNota(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarNotasSchema.parse(req.body);
      const item = await service.registrarNota(dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
