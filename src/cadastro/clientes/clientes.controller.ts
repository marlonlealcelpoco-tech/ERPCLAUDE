// Controller HTTP do módulo clientes
import type { Request, Response, NextFunction } from "express";
import { ClientesService } from "./clientes.service";
import { criarClientesSchema, atualizarClientesSchema } from "./clientes.schema";

const service = new ClientesService();

export const clientesController = {
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
      const dados = criarClientesSchema.parse(req.body);
      const item = await service.criar(dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },

  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = atualizarClientesSchema.parse(req.body);
      const item = await service.atualizar(req.params.id, dados);
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
};
