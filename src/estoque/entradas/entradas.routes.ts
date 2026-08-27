import { Router } from "express";
import { entradasController } from "./entradas.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const entradasRouter = Router();

entradasRouter.use(requireAuth);
entradasRouter.use(requireRole("estoquista", "gerente", "administrador"));

entradasRouter.get("/", entradasController.listar);
entradasRouter.get("/:id", entradasController.buscarPorId);
entradasRouter.post("/", entradasController.registrarEntrada);
