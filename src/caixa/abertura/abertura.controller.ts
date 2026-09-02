import type { Request, Response, NextFunction } from "express";
import { AberturaService } from "./abertura.service";
import { criarAberturaSchema } from "./abertura.schema";

const service = new AberturaService();

export const aberturaController = {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const itens = await service.listar();
      res.json(itens);
    } catch (err) {
      next(err);
    }
  },

  async buscarAtivo(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = req.usuario!.id;
      const item = await service.buscarCaixaAberto(usuarioId);
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  async abrirCaixa(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarAberturaSchema.parse(req.body);
      const usuarioId = req.usuario!.id;
      const lojaId = req.usuario!.lojaId;
      const item = await service.abrirCaixa(usuarioId, lojaId, dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
