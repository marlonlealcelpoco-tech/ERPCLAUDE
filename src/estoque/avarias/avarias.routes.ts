import { Router } from "express";
import { avariasController } from "./avarias.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const avariasRouter = Router();

avariasRouter.use(requireAuth);
avariasRouter.use(requireRole("estoquista", "gerente", "administrador"));

avariasRouter.get("/", avariasController.listar);
avariasRouter.get("/:id", avariasController.buscarPorId);
avariasRouter.post("/", avariasController.registrarAvaria);
