// Rotas HTTP do módulo fluxo-caixa
import { Router } from "express";
import { fluxoCaixaController } from "./fluxo-caixa.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const fluxoCaixaRouter = Router();

fluxoCaixaRouter.use(requireAuth);

fluxoCaixaRouter.get("/", fluxoCaixaController.listar);
fluxoCaixaRouter.get("/:id", fluxoCaixaController.buscarPorId);
fluxoCaixaRouter.post("/", fluxoCaixaController.criar);
fluxoCaixaRouter.put("/:id", fluxoCaixaController.atualizar);
