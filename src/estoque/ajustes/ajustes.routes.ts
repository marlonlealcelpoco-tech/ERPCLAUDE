import { Router } from "express";
import { ajustesController } from "./ajustes.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const ajustesRouter = Router();

ajustesRouter.use(requireAuth);
ajustesRouter.use(requireRole("estoquista", "gerente", "administrador"));

ajustesRouter.get("/", ajustesController.listar);
ajustesRouter.get("/:id", ajustesController.buscarPorId);
ajustesRouter.post("/", ajustesController.registrarAjuste);
