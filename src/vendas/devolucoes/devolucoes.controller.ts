import type { Request, Response, NextFunction } from "express";
import { DevolucoesService } from "./devolucoes.service";
import { criarDevolucoesSchema } from "./devolucoes.schema";

const service = new DevolucoesService();

export const devolucoesController = {
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

  async solicitarCancelamento(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarDevolucoesSchema.parse(req.body);
      const usuario = req.usuario!;
      const item = await service.solicitarCancelamento(usuario, dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
