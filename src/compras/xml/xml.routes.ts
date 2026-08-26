// Rotas HTTP do módulo xml
import { Router } from "express";
import { xmlController } from "./xml.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const xmlRouter = Router();

xmlRouter.use(requireAuth);

xmlRouter.get("/", xmlController.listar);
xmlRouter.get("/:id", xmlController.buscarPorId);
xmlRouter.post("/", xmlController.criar);
xmlRouter.put("/:id", xmlController.atualizar);
