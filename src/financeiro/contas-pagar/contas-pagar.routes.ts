// Rotas HTTP do módulo contas-pagar
import { Router } from "express";
import { contasPagarController } from "./contas-pagar.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const contasPagarRouter = Router();

contasPagarRouter.use(requireAuth);

contasPagarRouter.get("/", contasPagarController.listar);
contasPagarRouter.get("/:id", contasPagarController.buscarPorId);
contasPagarRouter.post("/", contasPagarController.criar);
contasPagarRouter.put("/:id", contasPagarController.atualizar);
