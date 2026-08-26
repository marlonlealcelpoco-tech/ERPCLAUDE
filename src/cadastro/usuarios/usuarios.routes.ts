// Rotas HTTP do módulo usuarios
import { Router } from "express";
import { usuariosController } from "./usuarios.controller";
import { requireAuth } from "../../shared/auth/require-auth";

export const usuariosRouter = Router();

usuariosRouter.use(requireAuth);

usuariosRouter.get("/", usuariosController.listar);
usuariosRouter.get("/:id", usuariosController.buscarPorId);
usuariosRouter.post("/", usuariosController.criar);
usuariosRouter.put("/:id", usuariosController.atualizar);
