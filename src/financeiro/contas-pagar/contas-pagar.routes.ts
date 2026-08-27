import { Router } from "express";
import { contasPagarController } from "./contas-pagar.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const contasPagarRouter = Router();

contasPagarRouter.use(requireAuth);

contasPagarRouter.get("/", requireRole("financeiro", "gerente", "administrador"), contasPagarController.listar);
contasPagarRouter.get("/:id", requireRole("financeiro", "gerente", "administrador"), contasPagarController.buscarPorId);
contasPagarRouter.post("/", requireRole("financeiro", "gerente", "administrador"), contasPagarController.criar);
contasPagarRouter.post("/:id/baixar", requireRole("financeiro", "administrador"), contasPagarController.baixar);
