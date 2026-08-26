import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import { resetLocalDbForTesting } from "../../shared/database/connection";
import { UsuariosService } from "../../cadastro/usuarios/usuarios.service";
import { LojasService } from "../../cadastro/lojas/lojas.service";
import { AuthService, validarTokenUsuario } from "../auth.service";
import { requireRole } from "../../shared/auth/require-role";
import { AppError } from "../../shared/errors/app-error";

describe("Módulo de Autenticação & Permissões", () => {
  beforeEach(() => {
    resetLocalDbForTesting();
  });

  test("deve realizar login com sucesso e gerar token valido", async () => {
    const lojasService = new LojasService();
    const loja = await lojasService.criar({ nome: "Loja Teste", matriz: true, ativa: true });

    const usuariosService = new UsuariosService();
    await usuariosService.criar({
      nome: "Carlos Silva",
      login: "carlos",
      senha: "password123",
      perfil: "vendedor",
      lojaId: loja.id,
      ativo: true,
    });

    const authService = new AuthService();
    const resultado = await authService.login({
      login: "carlos",
      senha: "password123",
    });

    assert.ok(resultado.token);
    assert.strictEqual(resultado.usuario.login, "carlos");
    assert.strictEqual(resultado.usuario.perfil, "vendedor");

    const payload = validarTokenUsuario(resultado.token);
    assert.ok(payload);
    assert.strictEqual(payload.nome, "Carlos Silva");
    assert.strictEqual(payload.perfil, "vendedor");
  });

  test("deve rejeitar login com senha incorreta", async () => {
    const lojasService = new LojasService();
    const loja = await lojasService.criar({ nome: "Loja Teste", matriz: true, ativa: true });

    const usuariosService = new UsuariosService();
    await usuariosService.criar({
      nome: "Ana Supervisor",
      login: "ana",
      senha: "senhaCorreta",
      perfil: "supervisor",
      lojaId: loja.id,
      ativo: true,
    });

    const authService = new AuthService();
    await assert.rejects(
      () =>
        authService.login({
          login: "ana",
          senha: "senhaErrada",
        }),
      (err: any) => err instanceof AppError && err.statusCode === 401
    );
  });

  test("deve validar permissoes de perfil via requireRole", () => {
    const middlewareVendedor = requireRole("vendedor", "supervisor", "administrador");
    const reqVendedor: any = { usuario: { perfil: "vendedor" } };
    let chamouNext = false;
    middlewareVendedor(reqVendedor, {} as any, () => {
      chamouNext = true;
    });
    assert.strictEqual(chamouNext, true);

    const reqEstoquista: any = { usuario: { perfil: "estoquista" } };
    let erroRecebido: any = null;
    middlewareVendedor(reqEstoquista, {} as any, (err?: any) => {
      erroRecebido = err;
    });
    assert.ok(erroRecebido);
    assert.strictEqual(erroRecebido.statusCode, 403);
  });
});
