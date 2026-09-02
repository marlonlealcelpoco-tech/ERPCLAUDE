import { Router } from "express";
import { nfceController } from "./nfce.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const nfceRouter = Router();

nfceRouter.use(requireAuth);
nfceRouter.use(requireRole("vendedor", "supervisor", "gerente", "administrador"));

nfceRouter.get("/", nfceController.listar);
nfceRouter.get("/:id", nfceController.buscarPorId);
nfceRouter.post("/emitir", nfceController.emitirNfce);
