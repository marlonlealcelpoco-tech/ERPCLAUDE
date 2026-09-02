import { Router } from "express";
import { tributacaoController } from "./tributacao.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const tributacaoRouter = Router();

tributacaoRouter.use(requireAuth);
tributacaoRouter.use(requireRole("gerente", "administrador"));

tributacaoRouter.get("/", tributacaoController.listar);
tributacaoRouter.get("/:id", tributacaoController.buscarPorId);
tributacaoRouter.post("/", tributacaoController.criar);
tributacaoRouter.put("/:id", tributacaoController.atualizar);
