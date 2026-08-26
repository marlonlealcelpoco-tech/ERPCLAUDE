// Rotas HTTP do módulo conciliacao
import { Router } from "express";
import { conciliacaoController } from "./conciliacao.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const conciliacaoRouter = Router();

conciliacaoRouter.use(requireAuth);

conciliacaoRouter.get("/", conciliacaoController.listar);
conciliacaoRouter.get("/:id", conciliacaoController.buscarPorId);
conciliacaoRouter.post("/", conciliacaoController.criar);
conciliacaoRouter.put("/:id", conciliacaoController.atualizar);
