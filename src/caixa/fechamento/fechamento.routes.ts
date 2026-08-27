import { Router } from "express";
import { fechamentoController } from "./fechamento.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const fechamentoRouter = Router();

fechamentoRouter.use(requireAuth);
fechamentoRouter.use(requireRole("vendedor", "supervisor", "gerente", "administrador"));

fechamentoRouter.get("/", fechamentoController.listar);
fechamentoRouter.get("/:id", fechamentoController.buscarPorId);
fechamentoRouter.post("/", fechamentoController.fecharCaixa);
