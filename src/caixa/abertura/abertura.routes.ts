// Rotas HTTP do módulo abertura
import { Router } from "express";
import { aberturaController } from "./abertura.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const aberturaRouter = Router();

aberturaRouter.use(requireAuth);

aberturaRouter.get("/", aberturaController.listar);
aberturaRouter.get("/:id", aberturaController.buscarPorId);
aberturaRouter.post("/", aberturaController.criar);
aberturaRouter.put("/:id", aberturaController.atualizar);
