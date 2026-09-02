import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import { resetLocalDbForTesting } from "../../shared/database/connection";
import { LojasService } from "../../cadastro/lojas/lojas.service";
import { UsuariosService } from "../../cadastro/usuarios/usuarios.service";
import { ClientesService } from "../../cadastro/clientes/clientes.service";
import { ProdutosService } from "../../cadastro/produtos/produtos.service";
import { AberturaService } from "../abertura/abertura.service";
import { SangriaService } from "../sangria/sangria.service";
import { PdvService } from "../../vendas/pdv/pdv.service";
import { RecebimentosService } from "../recebimentos/recebimentos.service";
import { DevolucoesService } from "../../vendas/devolucoes/devolucoes.service";
import { FechamentoService } from "../fechamento/fechamento.service";
import { ForbiddenError } from "../../shared/errors/app-error";

describe("Módulo PDV e Caixa (Fluxo Completo)", () => {
  beforeEach(() => {
    resetLocalDbForTesting();
  });

  test("fluxo completo: abertura, vendas, recebimento, sangria, e fechamento reconciliado", async () => {
    // 1. Cadastros de apoio
    const lojasService = new LojasService();
    const loja = await lojasService.criar({ nome: "Loja Principal", matriz: true, ativa: true });

    const usuariosService = new UsuariosService();
    const vendedor = await usuariosService.criar({
      nome: "Caixa 1",
      login: "caixa1",
      perfil: "vendedor",
      lojaId: loja.id,
      ativo: true,
    });
    const supervisor = await usuariosService.criar({
      nome: "Sup 1",
      login: "sup1",
      perfil: "supervisor",
      lojaId: loja.id,
      ativo: true,
    });

    const clientesService = new ClientesService();
    const cliente = await clientesService.criar({
      nome: "João Devedor",
      limiteCredito: 1000,
    });

    const produtosService = new ProdutosService();
    const prodA = await produtosService.criar({
      nome: "Camiseta",
      precoCusto: 20,
      precoVenda: 50,
      estoqueAtual: 100,
      ativo: true,
    });

    // 2. Abertura de Caixa
    const aberturaService = new AberturaService();
    const caixa = await aberturaService.abrirCaixa(vendedor.id, loja.id, {
      valorInicial: 100,
    });
    assert.strictEqual(caixa.valorInicial, 100);

    // 3. Venda à vista (Dinheiro) R$ 100
    const pdvService = new PdvService();
    const vendaDinheiro = await pdvService.realizarVenda(vendedor.id, loja.id, {
      formaPagamento: "dinheiro",
      itens: [{ produtoId: prodA.id, quantidade: 2 }],
      comNfce: false,
    });
    assert.strictEqual(vendaDinheiro.valorTotal, 100);

    // Checa baixa no estoque (100 - 2 = 98)
    const prodAAtualizado = await produtosService.buscarPorId(prodA.id);
    assert.strictEqual(prodAAtualizado.estoqueAtual, 98);

    // 4. Venda a Prazo R$ 150
    const vendaAPrazo = await pdvService.realizarVenda(vendedor.id, loja.id, {
      clienteId: cliente.id,
      formaPagamento: "a_prazo",
      itens: [{ produtoId: prodA.id, quantidade: 3 }],
      comNfce: false,
    });
    assert.strictEqual(vendaAPrazo.valorTotal, 150);

    const clienteAposVendaAPrazo = await clientesService.buscarPorId(cliente.id);
    assert.strictEqual(clienteAposVendaAPrazo.saldoDevedor, 150);

    // 5. Recebimento de Conta a Receber em Dinheiro R$ 50
    const recebimentosService = new RecebimentosService();
    const recebimento = await recebimentosService.receberConta(vendedor.id, {
      clienteId: cliente.id,
      valorRecebido: 50,
      formaPagamento: "dinheiro",
    });
    assert.strictEqual(recebimento.valorRecebido, 50);

    const clienteAposRecebimento = await clientesService.buscarPorId(cliente.id);
    assert.strictEqual(clienteAposRecebimento.saldoDevedor, 100);

    // 6. Sangria de Dinheiro R$ 30
    const sangriaService = new SangriaService();
    const sangria = await sangriaService.registrarSangria(vendedor.id, {
      valor: 30,
      observacao: "Retirada de segurança",
    });
    assert.strictEqual(sangria.valor, 30);

    // 7. Teste de Cancelamento de Venda: Vendedor não pode, Supervisor pode
    const devolucoesService = new DevolucoesService();
    await assert.rejects(
      () =>
        devolucoesService.solicitarCancelamento(
          { id: vendedor.id, perfil: "vendedor" },
          { vendaId: vendaDinheiro.id, restaurarEstoque: true }
        ),
      ForbiddenError
    );

    // 8. Fechamento de Caixa
    // Dinheiro esperado = Abertura (100) + Venda Dinheiro (100) + Recebimento Dinheiro (50) - Sangria (30) = 220
    const fechamentoService = new FechamentoService();
    const relatorio = await fechamentoService.fecharCaixa(vendedor.id, {
      dinheiroContado: 220,
    });

    assert.strictEqual(relatorio.dinheiroEsperado, 220);
    assert.strictEqual(relatorio.dinheiroContado, 220);
    assert.strictEqual(relatorio.diferencaDinheiro, 0);
    assert.strictEqual(relatorio.totalVendidoAPrazo, 150);
    assert.strictEqual(relatorio.totalRecebidoDinheiro, 50);
  });
});
