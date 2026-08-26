// Rotas HTTP do módulo movimentos
import { Router } from "express";
import { movimentosController } from "./movimentos.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const movimentosRouter = Router();

movimentosRouter.use(requireAuth);

movimentosRouter.get("/", movimentosController.listar);
movimentosRouter.get("/:id", movimentosController.buscarPorId);
movimentosRouter.post("/", movimentosController.criar);
movimentosRouter.put("/:id", movimentosController.atualizar);
