// Controller HTTP do módulo contas-receber
import type { Request, Response, NextFunction } from "express";
import { ContasReceberService } from "./contas-receber.service";
import { criarContasReceberSchema, atualizarContasReceberSchema } from "./contas-receber.schema";

const service = new ContasReceberService();

export const contasReceberController = {
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
      const dados = criarContasReceberSchema.parse(req.body);
      const item = await service.criar(dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },

  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = atualizarContasReceberSchema.parse(req.body);
      const item = await service.atualizar(req.params.id, dados);
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
};
