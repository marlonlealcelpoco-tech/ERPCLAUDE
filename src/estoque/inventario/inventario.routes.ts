// Rotas HTTP do módulo inventario
import { Router } from "express";
import { inventarioController } from "./inventario.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const inventarioRouter = Router();

inventarioRouter.use(requireAuth);

inventarioRouter.get("/", inventarioController.listar);
inventarioRouter.get("/:id", inventarioController.buscarPorId);
inventarioRouter.post("/", inventarioController.criar);
inventarioRouter.put("/:id", inventarioController.atualizar);
