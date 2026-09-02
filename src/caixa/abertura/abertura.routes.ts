import { Router } from "express";
import { aberturaController } from "./abertura.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const aberturaRouter = Router();

aberturaRouter.use(requireAuth);
aberturaRouter.use(requireRole("vendedor", "supervisor", "gerente", "administrador"));

aberturaRouter.get("/", aberturaController.listar);
aberturaRouter.get("/ativo", aberturaController.buscarAtivo);
aberturaRouter.post("/", aberturaController.abrirCaixa);
