// Rotas HTTP do módulo devolucoes
import { Router } from "express";
import { devolucoesController } from "./devolucoes.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const devolucoesRouter = Router();

devolucoesRouter.use(requireAuth);

devolucoesRouter.get("/", devolucoesController.listar);
devolucoesRouter.get("/:id", devolucoesController.buscarPorId);
devolucoesRouter.post("/", devolucoesController.criar);
devolucoesRouter.put("/:id", devolucoesController.atualizar);
