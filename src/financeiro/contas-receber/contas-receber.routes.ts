import { Router } from "express";
import { contasReceberController } from "./contas-receber.controller";
import { requireAuth } from "../../shared/auth/require-auth";
import { requireRole } from "../../shared/auth/require-role";

export const contasReceberRouter = Router();

contasReceberRouter.use(requireAuth);
contasReceberRouter.use(requireRole("financeiro", "gerente", "administrador"));

contasReceberRouter.get("/", contasReceberController.obterDemonstrativo);
contasReceberRouter.post("/:id/baixar", contasReceberController.tentarBaixarDireto);
