import { Router } from "express";
import { notasController } from "./notas.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const notasRouter = Router();

notasRouter.use(requireAuth);
notasRouter.use(requireRole("estoquista", "gerente", "administrador"));

notasRouter.get("/", notasController.listar);
notasRouter.get("/:id", notasController.buscarPorId);
notasRouter.post("/", notasController.registrarNota);
