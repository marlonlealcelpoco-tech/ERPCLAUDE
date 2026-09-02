import type { Request, Response, NextFunction } from "express";
import { ContasPagarService } from "./contas-pagar.service";
import { criarContasPagarSchema, baixarContasPagarSchema } from "./contas-pagar.schema";

const service = new ContasPagarService();

export const contasPagarController = {
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
      const dados = criarContasPagarSchema.parse(req.body);
      const item = await service.criar(dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },

  async baixar(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = baixarContasPagarSchema.parse(req.body);
      const usuarioPerfil = req.usuario!.perfil;
      const item = await service.baixar(req.params.id, usuarioPerfil, dados);
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
};
