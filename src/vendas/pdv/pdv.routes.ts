import { Router } from "express";
import { pdvController } from "./pdv.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const pdvRouter = Router();

pdvRouter.use(requireAuth);
pdvRouter.use(requireRole("vendedor", "supervisor", "gerente", "administrador"));

pdvRouter.get("/", pdvController.listar);
pdvRouter.get("/:id", pdvController.buscarPorId);
pdvRouter.post("/", pdvController.realizarVenda);
