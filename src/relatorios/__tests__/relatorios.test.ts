import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import { resetLocalDbForTesting } from "../../shared/database/connection";
import { LojasService } from "../../cadastro/lojas/lojas.service";
import { ClientesService } from "../../cadastro/clientes/clientes.service";
import { FornecedoresService } from "../../cadastro/fornecedores/fornecedores.service";
import { ContasPagarService } from "../../financeiro/contas-pagar/contas-pagar.service";
import { RelatoriosService } from "../gerais/relatorios.service";

describe("Módulo de Relatórios Gerais", () => {
  beforeEach(() => {
    resetLocalDbForTesting();
  });

  test("deve gerar relatorio geral consolidado por filial e período", async () => {
    const lojasService = new LojasService();
    const loja = await lojasService.criar({ nome: "Filial Relatórios", matriz: true, ativa: true });

    const clientesService = new ClientesService();
    await clientesService.criar({
      nome: "Cliente Teste",
      limiteCredito: 500,
    });

    const fornecedoresService = new FornecedoresService();
    const fornecedor = await fornecedoresService.criar({
      nomeRazao: "Fornecedor Teste",
    });

    const contasPagarService = new ContasPagarService();
    await contasPagarService.criar({
      fornecedorId: fornecedor.id,
      descricao: "Nota Energia Eletrica",
      valorOriginal: 200,
      dataVencimento: new Date(),
      lojaId: loja.id,
    });

    const relatoriosService = new RelatoriosService();
    const relatorio = await relatoriosService.gerarRelatorioGeral({
      lojaId: loja.id,
    });

    assert.ok(relatorio);
    assert.strictEqual(relatorio.lojaId, loja.id);
    assert.strictEqual(relatorio.contasPagar.totalAPagar, 200);
    assert.strictEqual(relatorio.contasPagar.totalPago, 0);
  });
});
