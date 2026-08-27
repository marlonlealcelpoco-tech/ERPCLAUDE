import { Router } from "express";
import { sangriaController } from "./sangria.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const sangriaRouter = Router();

sangriaRouter.use(requireAuth);
sangriaRouter.use(requireRole("vendedor", "supervisor", "gerente", "administrador"));

sangriaRouter.get("/", sangriaController.listar);
sangriaRouter.get("/:id", sangriaController.buscarPorId);
sangriaRouter.post("/", sangriaController.registrarSangria);
