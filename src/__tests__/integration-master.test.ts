import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import { resetLocalDbForTesting } from "../shared/database/connection";
import { LojasService } from "../cadastro/lojas/lojas.service";
import { UsuariosService } from "../cadastro/usuarios/usuarios.service";
import { FornecedoresService } from "../cadastro/fornecedores/fornecedores.service";
import { ClientesService } from "../cadastro/clientes/clientes.service";
import { ProdutosService } from "../cadastro/produtos/produtos.service";
import { ComprasService } from "../compras/compras/compras.service";
import { ContasPagarService } from "../financeiro/contas-pagar/contas-pagar.service";
import { AberturaService } from "../caixa/abertura/abertura.service";
import { PdvService } from "../vendas/pdv/pdv.service";
import { RecebimentosService } from "../caixa/recebimentos/recebimentos.service";
import { SangriaService } from "../caixa/sangria/sangria.service";
import { FechamentoService } from "../caixa/fechamento/fechamento.service";
import { FluxoCaixaService } from "../financeiro/fluxo-caixa/fluxo-caixa.service";
import { DreService } from "../financeiro/dre/dre.service";
import { ConciliacaoService } from "../financeiro/conciliacao/conciliacao.service";
import { NfceService } from "../fiscal/nfce/nfce.service";
import { RelatoriosService } from "../relatorios/gerais/relatorios.service";

describe("Teste Master de Integração End-to-End entre Todos os Módulos", () => {
  beforeEach(() => {
    resetLocalDbForTesting();
  });

  test("Ciclo de Vida Completo do ERP com Integração entre Compras, Estoque, PDV, Caixa, Financeiro, Fiscal e Relatórios", async () => {
    // =========================================================================
    // 1. CONFIGURAÇÃO INICIAL (Cadastros Base & Permissões)
    // =========================================================================
    const lojasService = new LojasService();
    const loja = await lojasService.criar({ nome: "Filial Central Matriz", matriz: true, ativa: true });

    const usuariosService = new UsuariosService();
    const vendedor = await usuariosService.criar({
      nome: "Lucas Vendedor",
      login: "lucas",
      perfil: "vendedor",
      lojaId: loja.id,
      ativo: true,
    });

    const financeiroUser = await usuariosService.criar({
      nome: "Fernanda Financeiro",
      login: "fernanda",
      perfil: "financeiro",
      lojaId: loja.id,
      ativo: true,
    });

    const fornecedoresService = new FornecedoresService();
    const fornecedor = await fornecedoresService.criar({
      nomeRazao: "Ambev Distribuição S.A.",
    });

    const clientesService = new ClientesService();
    const cliente = await clientesService.criar({
      nome: "Roberto Cliente VIP",
      limiteCredito: 2000,
    });

    const produtosService = new ProdutosService();
    const prodInicial = await produtosService.criar({
      nome: "Refrigerante Guaraná 2L",
      codigoBarras: "7891000111222",
      precoCusto: 4.0,
      precoVenda: 8.0,
      estoqueAtual: 0,
      ativo: true,
    });

    assert.strictEqual(prodInicial.estoqueAtual, 0);

    // =========================================================================
    // 2. MÓDULO DE COMPRAS (Entrada de Estoque + Geração de Contas a Pagar)
    // =========================================================================
    const comprasService = new ComprasService();
    const compra = await comprasService.realizarCompra(financeiroUser.id, {
      numeroNota: "NF-5501",
      fornecedorId: fornecedor.id,
      lojaId: loja.id,
      tipo: "manual",
      formaPagamento: "a_prazo",
      numeroParcelas: 1,
      itens: [
        {
          produtoId: prodInicial.id,
          nomeProduto: prodInicial.nome,
          quantidade: 50,
          precoCusto: 4.0,
        },
      ],
    });

    assert.strictEqual(compra.valorTotal, 200); // 50 x 4.00

    // Verifica se o estoque do produto aumentou automaticamente (0 -> 50)
    const prodAposCompra = await produtosService.buscarPorId(prodInicial.id);
    assert.strictEqual(prodAposCompra.estoqueAtual, 50);

    // Verifica se a Conta a Pagar foi gerada automaticamente em Financeiro
    const contasPagarService = new ContasPagarService();
    const contasPagar = await contasPagarService.listar();
    assert.strictEqual(contasPagar.length, 1);
    assert.strictEqual(contasPagar[0].valorOriginal, 200);
    assert.strictEqual(contasPagar[0].status, "pendente");

    // =========================================================================
    // 3. MÓDULO FINANCEIRO (Baixa de Contas a Pagar pelo usuário Financeiro)
    // =========================================================================
    const contaPagarBaixada = await contasPagarService.baixar(contasPagar[0].id, "financeiro", {
      valorPago: 200,
    });
    assert.strictEqual(contaPagarBaixada.status, "pago");

    // =========================================================================
    // 4. MÓDULO CAIXA & PDV (Abertura de Caixa, Venda à Vista e Venda a Prazo)
    // =========================================================================
    const aberturaService = new AberturaService();
    const caixa = await aberturaService.abrirCaixa(vendedor.id, loja.id, {
      valorInicial: 100, // Fundo de troco inicial
    });
    assert.strictEqual(caixa.valorInicial, 100);

    const pdvService = new PdvService();

    // Venda 1: À Vista em Dinheiro (R$ 80)
    const vendaDinheiro = await pdvService.realizarVenda(vendedor.id, loja.id, {
      formaPagamento: "dinheiro",
      itens: [{ produtoId: prodInicial.id, quantidade: 10 }], // 10 x R$ 8.00 = R$ 80
      comNfce: true,
    });
    assert.strictEqual(vendaDinheiro.valorTotal, 80);

    // Venda 2: A Prazo para Cliente VIP (R$ 160)
    const vendaAPrazo = await pdvService.realizarVenda(vendedor.id, loja.id, {
      clienteId: cliente.id,
      formaPagamento: "a_prazo",
      itens: [{ produtoId: prodInicial.id, quantidade: 20 }], // 20 x R$ 8.00 = R$ 160
      comNfce: false,
    });
    assert.strictEqual(vendaAPrazo.valorTotal, 160);

    // Verifica baixa de estoque pós-vendas (50 - 10 - 20 = 20)
    const prodAposVendas = await produtosService.buscarPorId(prodInicial.id);
    assert.strictEqual(prodAposVendas.estoqueAtual, 20);

    // Verifica se a dívida do cliente aumentou em Contas a Receber
    const clienteAposVenda = await clientesService.buscarPorId(cliente.id);
    assert.strictEqual(clienteAposVenda.saldoDevedor, 160);

    // =========================================================================
    // 5. RECEBIMENTO NO CAIXA (Cliente paga R$ 100 em Dinheiro)
    // =========================================================================
    const recebimentosService = new RecebimentosService();
    const recebimento = await recebimentosService.receberConta(vendedor.id, {
      clienteId: cliente.id,
      valorRecebido: 100,
      formaPagamento: "dinheiro",
    });
    assert.strictEqual(recebimento.valorRecebido, 100);

    // Saldo devedor do cliente deve cair de R$ 160 para R$ 60
    const clienteAposPagamento = await clientesService.buscarPorId(cliente.id);
    assert.strictEqual(clienteAposPagamento.saldoDevedor, 60);

    // =========================================================================
    // 6. SANGRIA DE CAIXA (Retirada de R$ 50 em Dinheiro)
    // =========================================================================
    const sangriaService = new SangriaService();
    const sangria = await sangriaService.registrarSangria(vendedor.id, {
      valor: 50,
      observacao: "Sangria periódica de segurança",
    });
    assert.strictEqual(sangria.valor, 50);

    // =========================================================================
    // 7. FECHAMENTO DE CAIXA & CONCILIAÇÃO CEGA
    // Dinheiro esperado:
    // + Fundo Inicial: R$ 100
    // + Venda Dinheiro: R$ 80
    // + Recebimento Dinheiro: R$ 100
    // - Sangria Dinheiro: R$ 50
    // = R$ 230 Esperado em Dinheiro.
    // =========================================================================
    const fechamentoService = new FechamentoService();
    const fechamento = await fechamentoService.fecharCaixa(vendedor.id, {
      dinheiroContado: 230,
    });

    assert.strictEqual(fechamento.dinheiroEsperado, 230);
    assert.strictEqual(fechamento.dinheiroContado, 230);
    assert.strictEqual(fechamento.diferencaDinheiro, 0); // Reconciliado com 0 diferença
    assert.strictEqual(fechamento.totalGeralVendas, 240); // R$ 80 à vista + R$ 160 a prazo

    // Exportação do relatório em texto/PDF
    const pdfTexto = await fechamentoService.gerarPdfFechamento(fechamento.caixaId);
    assert.ok(pdfTexto.includes("RELATÓRIO DE FECHAMENTO DE CAIXA"));
    assert.ok(pdfTexto.includes("DIFERENÇA DINHEIRO:      R$ 0.00 (OK - ZERO DIFERENÇA)"));

    // =========================================================================
    // 8. DEMONSTRATIVO DRE & CONCILIAÇÃO BANCÁRIA
    // =========================================================================
    const dreService = new DreService();
    const dre = await dreService.calcularDre({ lojaId: loja.id });

    assert.strictEqual(dre.receitaBrutaVendas, 240);
    assert.strictEqual(dre.custoProdutosVendidos, 120); // 30 unidades x R$ 4.00 custo
    assert.strictEqual(dre.lucroBruto, 120); // R$ 240 - R$ 120
    assert.strictEqual(dre.despesasOperacionais, 200); // Conta a Pagar quitada R$ 200

    // =========================================================================
    // 9. MÓDULO FISCAL (Emissão da NFC-e da Venda)
    // =========================================================================
    const nfceService = new NfceService();
    const nfce = await nfceService.emitirNfce({
      vendaId: vendaDinheiro.id,
      ambiente: "homologacao",
    });

    assert.strictEqual(nfce.chaveAcesso.length, 44);
    assert.strictEqual(nfce.status, "emitida");

    // =========================================================================
    // 10. ABA DE RELATÓRIOS GERAIS MULTI-LOJA
    // =========================================================================
    const relatoriosService = new RelatoriosService();
    const relatorioGeral = await relatoriosService.gerarRelatorioGeral({
      lojaId: loja.id,
    });

    assert.ok(relatorioGeral);
    assert.strictEqual(relatorioGeral.vendas.totalVendas, 240);
    assert.strictEqual(relatorioGeral.contasReceber.totalAReceber, 60);
    assert.strictEqual(relatorioGeral.contasReceber.totalRecebido, 100);
    assert.strictEqual(relatorioGeral.contasPagar.totalPago, 200);
  });
});
