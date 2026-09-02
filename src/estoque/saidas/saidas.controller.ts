import type { Request, Response, NextFunction } from "express";
import { SaidasService } from "./saidas.service";
import { criarSaidasSchema } from "./saidas.schema";

const service = new SaidasService();

export const saidasController = {
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

  async registrarSaida(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarSaidasSchema.parse(req.body);
      const usuarioId = req.usuario!.id;
      const item = await service.registrarSaida(usuarioId, dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
