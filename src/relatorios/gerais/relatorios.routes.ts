import { Router } from "express";
import { relatoriosController } from "./relatorios.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const relatoriosRouter = Router();

relatoriosRouter.use(requireAuth);
relatoriosRouter.use(requireRole("financeiro", "gerente", "administrador"));

relatoriosRouter.get("/geral", relatoriosController.gerarRelatorioGeral);
