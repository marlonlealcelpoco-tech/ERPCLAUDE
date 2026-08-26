// Rotas HTTP do módulo fornecedores
import { Router } from "express";
import { fornecedoresController } from "./fornecedores.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const fornecedoresRouter = Router();

fornecedoresRouter.use(requireAuth);

fornecedoresRouter.get("/", fornecedoresController.listar);
fornecedoresRouter.get("/:id", fornecedoresController.buscarPorId);
fornecedoresRouter.post("/", fornecedoresController.criar);
fornecedoresRouter.put("/:id", fornecedoresController.atualizar);
