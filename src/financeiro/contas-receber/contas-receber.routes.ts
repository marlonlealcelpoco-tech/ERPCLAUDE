// Rotas HTTP do módulo contas-receber
import { Router } from "express";
import { contasReceberController } from "./contas-receber.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const contasReceberRouter = Router();

contasReceberRouter.use(requireAuth);

contasReceberRouter.get("/", contasReceberController.listar);
contasReceberRouter.get("/:id", contasReceberController.buscarPorId);
contasReceberRouter.post("/", contasReceberController.criar);
contasReceberRouter.put("/:id", contasReceberController.atualizar);
