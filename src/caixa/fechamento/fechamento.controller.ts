import type { Request, Response, NextFunction } from "express";
import { FechamentoService } from "./fechamento.service";
import { criarFechamentoSchema } from "./fechamento.schema";

const service = new FechamentoService();

export const fechamentoController = {
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

  async fecharCaixa(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarFechamentoSchema.parse(req.body);
      const usuarioId = req.usuario!.id;
      const item = await service.fecharCaixa(usuarioId, dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },

  async exportarPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const relatorioPdf = await service.gerarPdfFechamento(req.params.id);
      res.setHeader("Content-Type", "text/plain");
      res.send(relatorioPdf);
    } catch (err) {
      next(err);
    }
  },
};
