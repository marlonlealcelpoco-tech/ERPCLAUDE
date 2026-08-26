// Rotas HTTP do módulo saidas
import { Router } from "express";
import { saidasController } from "./saidas.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const saidasRouter = Router();

saidasRouter.use(requireAuth);

saidasRouter.get("/", saidasController.listar);
saidasRouter.get("/:id", saidasController.buscarPorId);
saidasRouter.post("/", saidasController.criar);
saidasRouter.put("/:id", saidasController.atualizar);
