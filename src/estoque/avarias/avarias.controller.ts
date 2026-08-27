import type { Request, Response, NextFunction } from "express";
import { AvariasService } from "./avarias.service";
import { criarAvariasSchema } from "./avarias.schema";

const service = new AvariasService();

export const avariasController = {
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

  async registrarAvaria(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarAvariasSchema.parse(req.body);
      const usuarioId = req.usuario!.id;
      const item = await service.registrarAvaria(usuarioId, dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
