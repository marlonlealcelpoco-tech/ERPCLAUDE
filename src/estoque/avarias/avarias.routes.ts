// Rotas HTTP do módulo avarias
import { Router } from "express";
import { avariasController } from "./avarias.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const avariasRouter = Router();

avariasRouter.use(requireAuth);

avariasRouter.get("/", avariasController.listar);
avariasRouter.get("/:id", avariasController.buscarPorId);
avariasRouter.post("/", avariasController.criar);
avariasRouter.put("/:id", avariasController.atualizar);
