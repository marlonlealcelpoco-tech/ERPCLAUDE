import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import { resetLocalDbForTesting } from "../../shared/database/connection";
import { UsuariosService } from "../usuarios/usuarios.service";
import { ClientesService } from "../clientes/clientes.service";
import { FornecedoresService } from "../fornecedores/fornecedores.service";
import { ProdutosService } from "../produtos/produtos.service";
import { LojasService } from "../lojas/lojas.service";
import { ConflictError } from "../../shared/errors/app-error";

describe("Módulo de Cadastros", () => {
  beforeEach(() => {
    resetLocalDbForTesting();
  });

  describe("Cadastro de Lojas", () => {
    test("deve criar e buscar loja por ID", async () => {
      const service = new LojasService();
      const loja = await service.criar({
        nome: "Loja Matriz Central",
        cnpj: "12345678000199",
        matriz: true,
        ativa: true,
      });

      assert.ok(loja.id);
      assert.strictEqual(loja.nome, "Loja Matriz Central");
      assert.strictEqual(loja.matriz, true);

      const encontrada = await service.buscarPorId(loja.id);
      assert.strictEqual(encontrada.id, loja.id);
    });
  });

  describe("Cadastro de Usuários", () => {
    test("deve criar usuario e impedir login duplicado", async () => {
      const lojasService = new LojasService();
      const loja = await lojasService.criar({ nome: "Filial A", matriz: false, ativa: true });

      const usuariosService = new UsuariosService();
      const usr = await usuariosService.criar({
        nome: "João Silva",
        login: "joao.silva",
        perfil: "vendedor",
        lojaId: loja.id,
        ativo: true,
      });

      assert.ok(usr.id);
      assert.strictEqual(usr.perfil, "vendedor");

      await assert.rejects(
        () =>
          usuariosService.criar({
            nome: "Outro João",
            login: "joao.silva",
            perfil: "supervisor",
            lojaId: loja.id,
            ativo: true,
          }),
        ConflictError
      );
    });
  });

  describe("Cadastro de Clientes", () => {
    test("deve criar cliente e buscar por nome/telefone", async () => {
      const service = new ClientesService();
      const cliente = await service.criar({
        nome: "Maria Oliveira",
        telefone: "11988887777",
        limiteCredito: 500,
      });

      assert.ok(cliente.id);
      assert.strictEqual(cliente.saldoDevedor, 0);

      const busca = await service.listar("Oliveira");
      assert.strictEqual(busca.length, 1);
      assert.strictEqual(busca[0].id, cliente.id);
    });
  });

  describe("Cadastro de Fornecedores", () => {
    test("deve cadastrar e atualizar fornecedor", async () => {
      const service = new FornecedoresService();
      const fornecedor = await service.criar({
        nomeRazao: "Distribuidora de Alimentos LTDA",
        nomeFantasia: "Distribuidora Central",
      });

      assert.ok(fornecedor.id);

      const atualizado = await service.atualizar(fornecedor.id, {
        telefone: "1133334444",
      });

      assert.strictEqual(atualizado.telefone, "1133334444");
    });
  });

  describe("Cadastro de Produtos", () => {
    test("deve cadastrar produto e impedir codigo de barras duplicado", async () => {
      const service = new ProdutosService();
      const produto = await service.criar({
        nome: "Refrigerante 2L",
        codigoBarras: "7891234567890",
        precoCusto: 4.5,
        precoVenda: 8.0,
        estoqueAtual: 50,
        ativo: true,
      });

      assert.ok(produto.id);
      assert.strictEqual(produto.estoqueAtual, 50);

      await assert.rejects(
        () =>
          service.criar({
            nome: "Refrigerante Zero 2L",
            codigoBarras: "7891234567890",
            precoCusto: 4.5,
            precoVenda: 8.5,
            estoqueAtual: 0,
            ativo: true,
          }),
        ConflictError
      );
    });
  });
});
