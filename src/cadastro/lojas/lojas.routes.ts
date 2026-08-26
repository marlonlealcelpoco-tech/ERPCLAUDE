// Rotas HTTP do módulo lojas
import { Router } from "express";
import { lojasController } from "./lojas.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const lojasRouter = Router();

lojasRouter.use(requireAuth);

lojasRouter.get("/", lojasController.listar);
lojasRouter.get("/:id", lojasController.buscarPorId);
lojasRouter.post("/", lojasController.criar);
lojasRouter.put("/:id", lojasController.atualizar);
