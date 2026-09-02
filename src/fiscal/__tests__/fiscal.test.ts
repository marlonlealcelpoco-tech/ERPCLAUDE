import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import { resetLocalDbForTesting } from "../../shared/database/connection";
import { LojasService } from "../../cadastro/lojas/lojas.service";
import { UsuariosService } from "../../cadastro/usuarios/usuarios.service";
import { ProdutosService } from "../../cadastro/produtos/produtos.service";
import { AberturaService } from "../../caixa/abertura/abertura.service";
import { PdvService } from "../../vendas/pdv/pdv.service";
import { TributacaoService } from "../tributacao/tributacao.service";
import { NfceService } from "../nfce/nfce.service";
import { NfeService } from "../nfe/nfe.service";

describe("Módulo Fiscal (Tributação, NFC-e e NF-e)", () => {
  beforeEach(() => {
    resetLocalDbForTesting();
  });

  test("deve cadastrar regra tributaria NCM/CFOP/ICMS", async () => {
    const tribService = new TributacaoService();
    const regra = await tribService.criar({
      descricao: "Tributação Geral Bebidas",
      ncm: "22021000",
      cstIcms: "00",
      cfop: "5102",
      aliquotaIcms: 18,
      aliquotaPis: 1.65,
      aliquotaCofins: 7.6,
      ativa: true,
    });

    assert.ok(regra.id);
    assert.strictEqual(regra.ncm, "22021000");
    assert.strictEqual(regra.aliquotaIcms, 18);
  });

  test("deve emitir NFC-e para venda do PDV com chave de acesso de 44 digitos", async () => {
    // 1. Setup venda no PDV
    const lojasService = new LojasService();
    const loja = await lojasService.criar({ nome: "Filial Fiscal", matriz: true, ativa: true });

    const usuariosService = new UsuariosService();
    const vendedor = await usuariosService.criar({
      nome: "Caixa Fiscal",
      login: "caixa.fisc",
      perfil: "vendedor",
      lojaId: loja.id,
      ativo: true,
    });

    const produtosService = new ProdutosService();
    const produto = await produtosService.criar({
      nome: "Água Mineral 500ml",
      precoCusto: 1.0,
      precoVenda: 3.0,
      estoqueAtual: 50,
      ativo: true,
    });

    const aberturaService = new AberturaService();
    await aberturaService.abrirCaixa(vendedor.id, loja.id, { valorInicial: 50 });

    const pdvService = new PdvService();
    const venda = await pdvService.realizarVenda(vendedor.id, loja.id, {
      formaPagamento: "pix",
      itens: [{ produtoId: produto.id, quantidade: 2 }],
      comNfce: true,
    });

    // 2. Emissão de NFC-e
    const nfceService = new NfceService();
    const nfce = await nfceService.emitirNfce({
      vendaId: venda.id,
      ambiente: "homologacao",
    });

    assert.ok(nfce.id);
    assert.strictEqual(nfce.chaveAcesso.length, 44);
    assert.strictEqual(nfce.status, "emitida");
    assert.ok(nfce.qrCodeUrl.includes(nfce.chaveAcesso));
  });

  test("deve emitir NFe corporativa com chave de acesso de 44 digitos", async () => {
    const nfeService = new NfeService();
    const nfe = await nfeService.emitirNfe({
      destinatarioCnpjCpf: "98765432000188",
      nomeDestinatario: "Empresa Compradora LTDA",
      valorTotal: 1500,
      ambiente: "homologacao",
    });

    assert.ok(nfe.id);
    assert.strictEqual(nfe.chaveAcesso.length, 44);
    assert.strictEqual(nfe.status, "emitida");
    assert.strictEqual(nfe.valorTotal, 1500);
  });
});
