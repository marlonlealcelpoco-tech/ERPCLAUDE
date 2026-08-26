// Rotas HTTP do módulo relatorios
import { Router } from "express";
import { relatoriosController } from "./relatorios.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const relatoriosRouter = Router();

relatoriosRouter.use(requireAuth);

relatoriosRouter.get("/", relatoriosController.listar);
relatoriosRouter.get("/:id", relatoriosController.buscarPorId);
relatoriosRouter.post("/", relatoriosController.criar);
relatoriosRouter.put("/:id", relatoriosController.atualizar);
