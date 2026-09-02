import { Router } from "express";
import { comprasController } from "./compras.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const comprasRouter = Router();

comprasRouter.use(requireAuth);
comprasRouter.use(requireRole("estoquista", "gerente", "administrador"));

comprasRouter.get("/", comprasController.listar);
comprasRouter.get("/:id", comprasController.buscarPorId);
comprasRouter.post("/", comprasController.realizarCompra);
