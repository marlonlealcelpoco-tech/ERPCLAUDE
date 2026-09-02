import { Router } from "express";
import { devolucoesController } from "./devolucoes.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const devolucoesRouter = Router();

devolucoesRouter.use(requireAuth);
devolucoesRouter.use(requireRole("supervisor", "gerente", "administrador"));

devolucoesRouter.get("/", devolucoesController.listar);
devolucoesRouter.get("/:id", devolucoesController.buscarPorId);
devolucoesRouter.post("/", devolucoesController.solicitarCancelamento);
