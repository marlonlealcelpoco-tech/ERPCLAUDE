import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import { resetLocalDbForTesting } from "../../shared/database/connection";
import { LojasService } from "../../cadastro/lojas/lojas.service";
import { FornecedoresService } from "../../cadastro/fornecedores/fornecedores.service";
import { ContasPagarService } from "../contas-pagar/contas-pagar.service";
import { ContasReceberService } from "../contas-receber/contas-receber.service";
import { FluxoCaixaService } from "../fluxo-caixa/fluxo-caixa.service";
import { DreService } from "../dre/dre.service";
import { ConciliacaoService } from "../conciliacao/conciliacao.service";
import { ForbiddenError } from "../../shared/errors/app-error";

describe("Módulo Financeiro", () => {
  beforeEach(() => {
    resetLocalDbForTesting();
  });

  test("deve gerenciar contas a pagar com restrição de perfil", async () => {
    const lojasService = new LojasService();
    const loja = await lojasService.criar({ nome: "Loja Fin", matriz: true, ativa: true });

    const fornecedoresService = new FornecedoresService();
    const fornecedor = await fornecedoresService.criar({
      nomeRazao: "Fornecedor de Alimentos S.A.",
    });

    const contasPagarService = new ContasPagarService();
    const conta = await contasPagarService.criar({
      fornecedorId: fornecedor.id,
      descricao: "Nota de compra #1001",
      valorOriginal: 500,
      dataVencimento: new Date(),
      lojaId: loja.id,
    });

    assert.strictEqual(conta.valorOriginal, 500);
    assert.strictEqual(conta.status, "pendente");

    // Vendedor não pode dar baixa
    await assert.rejects(
      () =>
        contasPagarService.baixar(conta.id, "vendedor", {
          valorPago: 500,
        }),
      ForbiddenError
    );

    // Financeiro pode dar baixa
    const contaBaixada = await contasPagarService.baixar(conta.id, "financeiro", {
      valorPago: 500,
    });
    assert.strictEqual(contaBaixada.status, "pago");
    assert.strictEqual(contaBaixada.valorPago, 500);
  });

  test("deve bloquear baixa direta em contas a receber (somente pelo caixa)", async () => {
    const contasReceberService = new ContasReceberService();
    const demonstrativo = await contasReceberService.obterDemonstrativo();
    assert.ok(demonstrativo);

    await assert.rejects(
      () => contasReceberService.tentarBaixarDireto(),
      ForbiddenError
    );
  });

  test("deve gerar fluxo de caixa e DRE corretamente", async () => {
    const lojasService = new LojasService();
    const loja = await lojasService.criar({ nome: "Loja DRE", matriz: true, ativa: true });

    const fluxoCaixaService = new FluxoCaixaService();
    await fluxoCaixaService.registrarLancamento({
      tipo: "entrada",
      categoria: "Investimento",
      descricao: "Aporte de Capital",
      valor: 1000,
      lojaId: loja.id,
    });

    const relatorioFluxo = await fluxoCaixaService.gerarRelatorio({ lojaId: loja.id });
    assert.strictEqual(relatorioFluxo.totalEntradas, 1000);
    assert.strictEqual(relatorioFluxo.saldoLiquido, 1000);

    const dreService = new DreService();
    const dre = await dreService.calcularDre({ lojaId: loja.id });
    assert.ok(dre);

    const conciliacaoService = new ConciliacaoService();
    const conciliacao = await conciliacaoService.realizarConciliacao({
      lojaId: loja.id,
      saldoExtrato: 1000,
    });
    assert.strictEqual(conciliacao.conciliado, true);
    assert.strictEqual(conciliacao.diferenca, 0);
  });
});
