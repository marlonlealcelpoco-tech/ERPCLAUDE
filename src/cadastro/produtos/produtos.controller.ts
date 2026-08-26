import type { Request, Response, NextFunction } from "express";
import { ProdutosService } from "./produtos.service";
import { criarProdutosSchema, atualizarProdutosSchema } from "./produtos.schema";

const service = new ProdutosService();

export const produtosController = {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const termo = typeof req.query.busca === "string" ? req.query.busca : undefined;
      const itens = await service.listar(termo);
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
      const dados = criarProdutosSchema.parse(req.body);
      const item = await service.criar(dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },

  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = atualizarProdutosSchema.parse(req.body);
      const item = await service.atualizar(req.params.id, dados);
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
};
