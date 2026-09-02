import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import { resetLocalDbForTesting } from "../../shared/database/connection";
import { LojasService } from "../../cadastro/lojas/lojas.service";
import { UsuariosService } from "../../cadastro/usuarios/usuarios.service";
import { ProdutosService } from "../../cadastro/produtos/produtos.service";
import { EntradasService } from "../entradas/entradas.service";
import { SaidasService } from "../saidas/saidas.service";
import { AjustesService } from "../ajustes/ajustes.service";
import { AvariasService } from "../avarias/avarias.service";
import { InventarioService } from "../inventario/inventario.service";
import { ValidationError } from "../../shared/errors/app-error";

describe("Módulo de Estoque", () => {
  beforeEach(() => {
    resetLocalDbForTesting();
  });

  test("deve registrar entradas, saídas, ajustes, avarias e inventário de estoque", async () => {
    // 1. Cadastros de apoio
    const lojasService = new LojasService();
    const loja = await lojasService.criar({ nome: "Filial Estoque", matriz: true, ativa: true });

    const usuariosService = new UsuariosService();
    const estoquista = await usuariosService.criar({
      nome: "Carlos Estoquista",
      login: "carlos.est",
      perfil: "estoquista",
      lojaId: loja.id,
      ativo: true,
    });

    const produtosService = new ProdutosService();
    const produto = await produtosService.criar({
      nome: "Biscoito Recheado",
      precoCusto: 2.0,
      precoVenda: 4.5,
      estoqueAtual: 10,
      ativo: true,
    });

    // 2. Entrada Manual de Estoque (+20) -> Estoque = 30
    const entradasService = new EntradasService();
    const entrada = await entradasService.registrarEntrada(estoquista.id, {
      produtoId: produto.id,
      quantidade: 20,
      observacao: "Recebimento extra de fornecedor",
    });
    assert.strictEqual(entrada.quantidade, 20);

    let prod = await produtosService.buscarPorId(produto.id);
    assert.strictEqual(prod.estoqueAtual, 30);

    // 3. Saída Manual de Estoque (-5) -> Estoque = 25
    const saidasService = new SaidasService();
    const saida = await saidasService.registrarSaida(estoquista.id, {
      produtoId: produto.id,
      quantidade: 5,
      motivo: "Transferência interna para exibição",
    });
    assert.strictEqual(saida.quantidade, 5);

    prod = await produtosService.buscarPorId(produto.id);
    assert.strictEqual(prod.estoqueAtual, 25);

    // Tentativa de saída maior que estoque
    await assert.rejects(
      () =>
        saidasService.registrarSaida(estoquista.id, {
          produtoId: produto.id,
          quantidade: 100,
        }),
      ValidationError
    );

    // 4. Baixa por Avaria/Validade (-3) -> Estoque = 22
    const avariasService = new AvariasService();
    const avaria = await avariasService.registrarAvaria(estoquista.id, {
      produtoId: produto.id,
      quantidade: 3,
      tipo: "validade_vencida",
      motivo: "Produto vencido na prateleira",
    });
    assert.strictEqual(avaria.tipo, "validade_vencida");

    prod = await produtosService.buscarPorId(produto.id);
    assert.strictEqual(prod.estoqueAtual, 22);

    // 5. Ajuste Direto de Saldo -> Define Estoque para 50
    const ajustesService = new AjustesService();
    const ajuste = await ajustesService.registrarAjuste(estoquista.id, {
      produtoId: produto.id,
      novoEstoque: 50,
      justificativa: "Recontagem física emergencial",
    });
    assert.strictEqual(ajuste.diferenca, 28); // 50 - 22

    prod = await produtosService.buscarPorId(produto.id);
    assert.strictEqual(prod.estoqueAtual, 50);

    // 6. Realização de Inventário Auditado -> Contado = 48 -> Estoque final = 48
    const inventarioService = new InventarioService();
    const inv = await inventarioService.realizarInventario(estoquista.id, loja.id, {
      itens: [{ produtoId: produto.id, quantidadeContada: 48 }],
      observacao: "Inventário mensal de fechamento",
    });

    assert.strictEqual(inv.itens[0].diferenca, -2); // 48 - 50 = -2

    prod = await produtosService.buscarPorId(produto.id);
    assert.strictEqual(prod.estoqueAtual, 48);
  });
});
