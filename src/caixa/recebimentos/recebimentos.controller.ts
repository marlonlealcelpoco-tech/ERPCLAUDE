import type { Request, Response, NextFunction } from "express";
import { RecebimentosService } from "./recebimentos.service";
import { criarRecebimentosSchema } from "./recebimentos.schema";

const service = new RecebimentosService();

export const recebimentosController = {
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

  async receberConta(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarRecebimentosSchema.parse(req.body);
      const vendedorId = req.usuario!.id;
      const item = await service.receberConta(vendedorId, dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
