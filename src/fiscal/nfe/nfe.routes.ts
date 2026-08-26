// Rotas HTTP do módulo nfe
import { Router } from "express";
import { nfeController } from "./nfe.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const nfeRouter = Router();

nfeRouter.use(requireAuth);

nfeRouter.get("/", nfeController.listar);
nfeRouter.get("/:id", nfeController.buscarPorId);
nfeRouter.post("/", nfeController.criar);
nfeRouter.put("/:id", nfeController.atualizar);
