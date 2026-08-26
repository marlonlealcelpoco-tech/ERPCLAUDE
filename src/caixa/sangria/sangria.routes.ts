// Rotas HTTP do módulo sangria
import { Router } from "express";
import { sangriaController } from "./sangria.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const sangriaRouter = Router();

sangriaRouter.use(requireAuth);

sangriaRouter.get("/", sangriaController.listar);
sangriaRouter.get("/:id", sangriaController.buscarPorId);
sangriaRouter.post("/", sangriaController.criar);
sangriaRouter.put("/:id", sangriaController.atualizar);
