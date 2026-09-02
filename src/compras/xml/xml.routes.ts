import { Router } from "express";
import { xmlController } from "./xml.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const xmlRouter = Router();

xmlRouter.use(requireAuth);
xmlRouter.use(requireRole("estoquista", "gerente", "administrador"));

xmlRouter.post("/importar", xmlController.parsearXml);
