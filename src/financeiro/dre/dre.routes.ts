import { Router } from "express";
import { dreController } from "./dre.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const dreRouter = Router();

dreRouter.use(requireAuth);
dreRouter.use(requireRole("financeiro", "gerente", "administrador"));

dreRouter.get("/", dreController.calcularDre);
