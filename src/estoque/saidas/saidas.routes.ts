import { Router } from "express";
import { saidasController } from "./saidas.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const saidasRouter = Router();

saidasRouter.use(requireAuth);
saidasRouter.use(requireRole("estoquista", "gerente", "administrador"));

saidasRouter.get("/", saidasController.listar);
saidasRouter.get("/:id", saidasController.buscarPorId);
saidasRouter.post("/", saidasController.registrarSaida);
