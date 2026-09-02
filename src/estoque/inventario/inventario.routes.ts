import { Router } from "express";
import { inventarioController } from "./inventario.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const inventarioRouter = Router();

inventarioRouter.use(requireAuth);
inventarioRouter.use(requireRole("estoquista", "gerente", "administrador"));

inventarioRouter.get("/", inventarioController.listar);
inventarioRouter.get("/:id", inventarioController.buscarPorId);
inventarioRouter.post("/", inventarioController.realizarInventario);
