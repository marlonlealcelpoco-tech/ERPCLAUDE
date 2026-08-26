// Rotas HTTP do módulo contas-a-prazo
import { Router } from "express";
import { contasAPrazoController } from "./contas-a-prazo.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const contasAPrazoRouter = Router();

contasAPrazoRouter.use(requireAuth);

contasAPrazoRouter.get("/", contasAPrazoController.listar);
contasAPrazoRouter.get("/:id", contasAPrazoController.buscarPorId);
contasAPrazoRouter.post("/", contasAPrazoController.criar);
contasAPrazoRouter.put("/:id", contasAPrazoController.atualizar);
