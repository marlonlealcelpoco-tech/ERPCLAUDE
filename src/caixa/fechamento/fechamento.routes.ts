// Rotas HTTP do módulo fechamento
import { Router } from "express";
import { fechamentoController } from "./fechamento.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const fechamentoRouter = Router();

fechamentoRouter.use(requireAuth);

fechamentoRouter.get("/", fechamentoController.listar);
fechamentoRouter.get("/:id", fechamentoController.buscarPorId);
fechamentoRouter.post("/", fechamentoController.criar);
fechamentoRouter.put("/:id", fechamentoController.atualizar);
