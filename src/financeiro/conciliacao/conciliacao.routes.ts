import { Router } from "express";
import { conciliacaoController } from "./conciliacao.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const conciliacaoRouter = Router();

conciliacaoRouter.use(requireAuth);
conciliacaoRouter.use(requireRole("financeiro", "administrador"));

conciliacaoRouter.get("/", conciliacaoController.listar);
conciliacaoRouter.get("/:id", conciliacaoController.buscarPorId);
conciliacaoRouter.post("/", conciliacaoController.realizarConciliacao);
