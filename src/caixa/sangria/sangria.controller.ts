// Controller HTTP do módulo sangria
import type { Request, Response, NextFunction } from "express";
import { SangriaService } from "./sangria.service";
import { criarSangriaSchema, atualizarSangriaSchema } from "./sangria.schema";

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

  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarSangriaSchema.parse(req.body);
      const item = await service.criar(dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },

  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = atualizarSangriaSchema.parse(req.body);
      const item = await service.atualizar(req.params.id, dados);
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
};
