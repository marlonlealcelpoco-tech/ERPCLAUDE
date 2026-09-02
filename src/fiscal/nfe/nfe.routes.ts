import { Router } from "express";
import { nfeController } from "./nfe.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const nfeRouter = Router();

nfeRouter.use(requireAuth);
nfeRouter.use(requireRole("gerente", "administrador"));

nfeRouter.get("/", nfeController.listar);
nfeRouter.get("/:id", nfeController.buscarPorId);
nfeRouter.post("/emitir", nfeController.emitirNfe);
