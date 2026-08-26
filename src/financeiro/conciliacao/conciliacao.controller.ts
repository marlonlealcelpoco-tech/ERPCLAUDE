// Controller HTTP do módulo conciliacao
import type { Request, Response, NextFunction } from "express";
import { ConciliacaoService } from "./conciliacao.service";
import { criarConciliacaoSchema, atualizarConciliacaoSchema } from "./conciliacao.schema";

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

  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarConciliacaoSchema.parse(req.body);
      const item = await service.criar(dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },

  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = atualizarConciliacaoSchema.parse(req.body);
      const item = await service.atualizar(req.params.id, dados);
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
};
