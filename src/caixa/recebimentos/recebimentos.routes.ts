// Rotas HTTP do módulo recebimentos
import { Router } from "express";
import { recebimentosController } from "./recebimentos.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const recebimentosRouter = Router();

recebimentosRouter.use(requireAuth);

recebimentosRouter.get("/", recebimentosController.listar);
recebimentosRouter.get("/:id", recebimentosController.buscarPorId);
recebimentosRouter.post("/", recebimentosController.criar);
recebimentosRouter.put("/:id", recebimentosController.atualizar);
