// Rotas HTTP do módulo entradas
import { Router } from "express";
import { entradasController } from "./entradas.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const entradasRouter = Router();

entradasRouter.use(requireAuth);

entradasRouter.get("/", entradasController.listar);
entradasRouter.get("/:id", entradasController.buscarPorId);
entradasRouter.post("/", entradasController.criar);
entradasRouter.put("/:id", entradasController.atualizar);
