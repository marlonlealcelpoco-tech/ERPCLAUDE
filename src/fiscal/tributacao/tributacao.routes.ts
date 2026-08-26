// Rotas HTTP do módulo tributacao
import { Router } from "express";
import { tributacaoController } from "./tributacao.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const tributacaoRouter = Router();

tributacaoRouter.use(requireAuth);

tributacaoRouter.get("/", tributacaoController.listar);
tributacaoRouter.get("/:id", tributacaoController.buscarPorId);
tributacaoRouter.post("/", tributacaoController.criar);
tributacaoRouter.put("/:id", tributacaoController.atualizar);
