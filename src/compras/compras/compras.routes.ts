// Rotas HTTP do módulo compras
import { Router } from "express";
import { comprasController } from "./compras.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const comprasRouter = Router();

comprasRouter.use(requireAuth);

comprasRouter.get("/", comprasController.listar);
comprasRouter.get("/:id", comprasController.buscarPorId);
comprasRouter.post("/", comprasController.criar);
comprasRouter.put("/:id", comprasController.atualizar);
