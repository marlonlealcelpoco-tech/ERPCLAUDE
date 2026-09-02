import { Router } from "express";
import { fluxoCaixaController } from "./fluxo-caixa.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const fluxoCaixaRouter = Router();

fluxoCaixaRouter.use(requireAuth);
fluxoCaixaRouter.use(requireRole("financeiro", "gerente", "administrador"));

fluxoCaixaRouter.get("/", fluxoCaixaController.gerarRelatorio);
fluxoCaixaRouter.post("/", fluxoCaixaController.registrarLancamento);
