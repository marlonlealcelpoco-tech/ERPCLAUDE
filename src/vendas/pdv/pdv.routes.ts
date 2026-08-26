// Rotas HTTP do módulo pdv
import { Router } from "express";
import { pdvController } from "./pdv.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const pdvRouter = Router();

pdvRouter.use(requireAuth);

pdvRouter.get("/", pdvController.listar);
pdvRouter.get("/:id", pdvController.buscarPorId);
pdvRouter.post("/", pdvController.criar);
pdvRouter.put("/:id", pdvController.atualizar);
