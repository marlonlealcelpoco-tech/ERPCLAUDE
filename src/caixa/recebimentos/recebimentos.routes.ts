import { Router } from "express";
import { recebimentosController } from "./recebimentos.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const recebimentosRouter = Router();

recebimentosRouter.use(requireAuth);
recebimentosRouter.use(requireRole("vendedor", "supervisor", "gerente", "administrador"));

recebimentosRouter.get("/", recebimentosController.listar);
recebimentosRouter.get("/:id", recebimentosController.buscarPorId);
recebimentosRouter.post("/", recebimentosController.receberConta);
