// Rotas HTTP do módulo ajustes
import { Router } from "express";
import { ajustesController } from "./ajustes.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const ajustesRouter = Router();

ajustesRouter.use(requireAuth);

ajustesRouter.get("/", ajustesController.listar);
ajustesRouter.get("/:id", ajustesController.buscarPorId);
ajustesRouter.post("/", ajustesController.criar);
ajustesRouter.put("/:id", ajustesController.atualizar);
