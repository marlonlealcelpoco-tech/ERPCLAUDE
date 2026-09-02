import type { Request, Response, NextFunction } from "express";
import { FluxoCaixaService } from "./fluxo-caixa.service";
import { filtroFluxoCaixaSchema, criarFluxoCaixaSchema } from "./fluxo-caixa.schema";

const service = new FluxoCaixaService();

export const fluxoCaixaController = {
  async gerarRelatorio(req: Request, res: Response, next: NextFunction) {
    try {
      const filtro = filtroFluxoCaixaSchema.parse(req.query);
      const relatorio = await service.gerarRelatorio(filtro);
      res.json(relatorio);
    } catch (err) {
      next(err);
    }
  },

  async registrarLancamento(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarFluxoCaixaSchema.parse(req.body);
      const item = await service.registrarLancamento(dados);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
};
