import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import { resetLocalDbForTesting } from "../../shared/database/connection";
import { LojasService } from "../../cadastro/lojas/lojas.service";
import { FornecedoresService } from "../../cadastro/fornecedores/fornecedores.service";
import { UsuariosService } from "../../cadastro/usuarios/usuarios.service";
import { ProdutosService } from "../../cadastro/produtos/produtos.service";
import { XmlService } from "../xml/xml.service";
import { ComprasService } from "../compras/compras.service";
import { ContasPagarService } from "../../financeiro/contas-pagar/contas-pagar.service";

describe("Módulo de Compras e Importação de XML", () => {
  beforeEach(() => {
    resetLocalDbForTesting();
  });

  test("deve importar XML de NFe de fornecedor", async () => {
    const xmlSample = `
      <nfeProc>
        <NFe>
          <infNFe>
            <ide>
              <nNF>12345</nNF>
              <chNFe>35230100000000000000550010000123451000000001</chNFe>
            </ide>
            <emit>
              <CNPJ>12345678000199</CNPJ>
              <xNome>Fornecedor Atacadista S/A</xNome>
            </emit>
            <total>
              <ICMSTot>
                <vNF>150.00</vNF>
              </ICMSTot>
            </total>
            <det nItem="1">
              <prod>
                <cProd>789001</cProd>
                <xProd>Arroz Tipo 1 5kg</xProd>
                <NCM>10063021</NCM>
                <qCom>10</qCom>
                <vUnCom>15.00</vUnCom>
                <vProd>150.00</vProd>
              </prod>
            </det>
          </infNFe>
        </NFe>
      </nfeProc>
    `;

    const xmlService = new XmlService();
    const dadosParsed = await xmlService.parsearXml(xmlSample);

    assert.strictEqual(dadosParsed.numeroNota, "12345");
    assert.strictEqual(dadosParsed.cnpjFornecedor, "12345678000199");
    assert.strictEqual(dadosParsed.itens.length, 1);
    assert.strictEqual(dadosParsed.itens[0].nomeProduto, "Arroz Tipo 1 5kg");
    assert.strictEqual(dadosParsed.itens[0].quantidade, 10);
  });

  test("deve realizar compra, atualizar estoque e gerar contas a pagar automaticamente", async () => {
    // 1. Cadastros
    const lojasService = new LojasService();
    const loja = await lojasService.criar({ nome: "Loja Compras", matriz: true, ativa: true });

    const fornecedoresService = new FornecedoresService();
    const fornecedor = await fornecedoresService.criar({ nomeRazao: "Distribuidora Bebidas LTDA" });

    const usuariosService = new UsuariosService();
    const usuario = await usuariosService.criar({
      nome: "Estoquista Marcos",
      login: "marcos",
      perfil: "estoquista",
      lojaId: loja.id,
      ativo: true,
    });

    const produtosService = new ProdutosService();
    const prodExistente = await produtosService.criar({
      nome: "Suco de Laranja 1L",
      codigoBarras: "7891112223334",
      precoCusto: 3.0,
      precoVenda: 6.0,
      estoqueAtual: 5,
      ativo: true,
    });

    // 2. Realizar Compra a Prazo em 2 parcelas
    const comprasService = new ComprasService();
    const compra = await comprasService.realizarCompra(usuario.id, {
      numeroNota: "9988",
      fornecedorId: fornecedor.id,
      lojaId: loja.id,
      tipo: "manual",
      formaPagamento: "a_prazo",
      numeroParcelas: 2,
      itens: [
        {
          produtoId: prodExistente.id,
          nomeProduto: prodExistente.nome,
          quantidade: 20,
          precoCusto: 3.5,
        },
        {
          nomeProduto: "Biscoito Wafer",
          codigoBarras: "7899998887776",
          quantidade: 10,
          precoCusto: 2.0,
          precoVenda: 4.0,
        },
      ],
    });

    assert.ok(compra.id);
    assert.strictEqual(compra.valorTotal, 20 * 3.5 + 10 * 2.0); // 70 + 20 = 90

    // 3. Verificar entrada de estoque automática
    const prodAtualizado = await produtosService.buscarPorId(prodExistente.id);
    assert.strictEqual(prodAtualizado.estoqueAtual, 25); // 5 + 20 = 25
    assert.strictEqual(prodAtualizado.precoCusto, 3.5);

    const prodsNovos = await produtosService.listar("Wafer");
    assert.strictEqual(prodsNovos.length, 1);
    assert.strictEqual(prodsNovos[0].estoqueAtual, 10);

    // 4. Verificar geração automática de Contas a Pagar
    const contasPagarService = new ContasPagarService();
    const contasPagar = await contasPagarService.listar();
    const contasDaCompra = contasPagar.filter((c) => c.compraId === compra.id);

    assert.strictEqual(contasDaCompra.length, 2);
    assert.strictEqual(contasDaCompra[0].valorOriginal, 45); // 90 / 2
    assert.strictEqual(contasDaCompra[1].valorOriginal, 45);
  });
});
