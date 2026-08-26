// Rotas HTTP do módulo dre
import { Router } from "express";
import { dreController } from "./dre.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const dreRouter = Router();

dreRouter.use(requireAuth);

dreRouter.get("/", dreController.listar);
dreRouter.get("/:id", dreController.buscarPorId);
dreRouter.post("/", dreController.criar);
dreRouter.put("/:id", dreController.atualizar);
