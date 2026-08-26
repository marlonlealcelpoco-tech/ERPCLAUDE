// Rotas HTTP do módulo notas
import { Router } from "express";
import { notasController } from "./notas.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const notasRouter = Router();

notasRouter.use(requireAuth);

notasRouter.get("/", notasController.listar);
notasRouter.get("/:id", notasController.buscarPorId);
notasRouter.post("/", notasController.criar);
notasRouter.put("/:id", notasController.atualizar);
