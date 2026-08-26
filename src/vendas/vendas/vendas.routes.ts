// Rotas HTTP do módulo vendas
import { Router } from "express";
import { vendasController } from "./vendas.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const vendasRouter = Router();

vendasRouter.use(requireAuth);

vendasRouter.get("/", vendasController.listar);
vendasRouter.get("/:id", vendasController.buscarPorId);
vendasRouter.post("/", vendasController.criar);
vendasRouter.put("/:id", vendasController.atualizar);
