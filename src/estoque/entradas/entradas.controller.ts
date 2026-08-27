import type { Request, Response, NextFunction } from "express";
import { EntradasService } from "./entradas.service";
import { criarEntradasSchema } from "./entradas.schema";

const service = new EntradasService();

export const entradasController = {
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

  async registrarEntrada(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarEntradasSchema.parse(req.body);
      const usuarioId = req.usuario!.id;
      const item = await service.registrarEntrada(usuarioId, dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
