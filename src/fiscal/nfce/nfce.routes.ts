// Rotas HTTP do módulo nfce
import { Router } from "express";
import { nfceController } from "./nfce.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const nfceRouter = Router();

nfceRouter.use(requireAuth);

nfceRouter.get("/", nfceController.listar);
nfceRouter.get("/:id", nfceController.buscarPorId);
nfceRouter.post("/", nfceController.criar);
nfceRouter.put("/:id", nfceController.atualizar);
