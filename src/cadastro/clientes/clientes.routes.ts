// Rotas HTTP do módulo clientes
import { Router } from "express";
import { clientesController } from "./clientes.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const clientesRouter = Router();

clientesRouter.use(requireAuth);

clientesRouter.get("/", clientesController.listar);
clientesRouter.get("/:id", clientesController.buscarPorId);
clientesRouter.post("/", clientesController.criar);
clientesRouter.put("/:id", clientesController.atualizar);
