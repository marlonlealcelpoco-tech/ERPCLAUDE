// Rotas HTTP do módulo produtos
import { Router } from "express";
import { produtosController } from "./produtos.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const produtosRouter = Router();

produtosRouter.use(requireAuth);

produtosRouter.get("/", produtosController.listar);
produtosRouter.get("/:id", produtosController.buscarPorId);
produtosRouter.post("/", produtosController.criar);
produtosRouter.put("/:id", produtosController.atualizar);
