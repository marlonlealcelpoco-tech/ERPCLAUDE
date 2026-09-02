import type { Request, Response, NextFunction } from "express";
import { ConciliacaoService } from "./conciliacao.service";
import { criarConciliacaoSchema } from "./conciliacao.schema";

const service = new ConciliacaoService();

export const conciliacaoController = {
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

  async realizarConciliacao(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarConciliacaoSchema.parse(req.body);
      const item = await service.realizarConciliacao(dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
