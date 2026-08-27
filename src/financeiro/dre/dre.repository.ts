import { PdvRepository } from "../../vendas/pdv/pdv.repository";
import { ProdutosRepository } from "../../cadastro/produtos/produtos.repository";
import { ContasPagarRepository } from "../contas-pagar/contas-pagar.repository";
import { DevolucoesRepository } from "../../vendas/devolucoes/devolucoes.repository";
import type { DemonstrativoResultado } from "./dre.types";

export class DreRepository {
  constructor(
    private readonly pdvRepo: PdvRepository = new PdvRepository(),
    private readonly produtosRepo: ProdutosRepository = new ProdutosRepository(),
    private readonly contasPagarRepo: ContasPagarRepository = new ContasPagarRepository(),
    private readonly devolucoesRepo: DevolucoesRepository = new DevolucoesRepository()
  ) {}

  async calcularDre(filtro: { lojaId?: string; dataInicio?: Date; dataFim?: Date }): Promise<DemonstrativoResultado> {
    const vendas = await this.pdvRepo.listar();
    let receitaBrutaVendas = 0;
    let custoProdutosVendidos = 0;

    for (const v of vendas) {
      if (filtro.lojaId && v.lojaId !== filtro.lojaId) continue;
      if (v.status === "concluida") {
        receitaBrutaVendas += v.valorTotal;

        for (const item of v.itens) {
          const produto = await this.produtosRepo.buscarPorId(item.produtoId);
          const precoCusto = produto ? produto.precoCusto : 0;
          custoProdutosVendidos += precoCusto * item.quantidade;
        }
      }
    }

    const devolucoes = await this.devolucoesRepo.listar();
    let deducoesDevolucoes = 0;
    for (const dev of devolucoes) {
      const venda = await this.pdvRepo.buscarPorId(dev.vendaId);
      if (venda) {
        if (dev.produtoId) {
          const item = venda.itens.find((i) => i.produtoId === dev.produtoId);
          if (item) deducoesDevolucoes += item.valorTotal;
        } else {
          deducoesDevolucoes += venda.valorTotal;
        }
      }
    }

    const receitaLiquida = Math.max(0, receitaBrutaVendas - deducoesDevolucoes);
    const lucroBruto = receitaLiquida - custoProdutosVendidos;

    const contasPagar = await this.contasPagarRepo.listar();
    let despesasOperacionais = 0;
    for (const cp of contasPagar) {
      if (filtro.lojaId && cp.lojaId !== filtro.lojaId) continue;
      if (cp.valorPago > 0) {
        despesasOperacionais += cp.valorPago;
      }
    }

    const lucroLiquido = lucroBruto - despesasOperacionais;

    return {
      lojaId: filtro.lojaId,
      periodoInicio: filtro.dataInicio,
      periodoFim: filtro.dataFim,
      receitaBrutaVendas,
      deducoesDevolucoes,
      receitaLiquida,
      custoProdutosVendidos,
      lucroBruto,
      despesasOperacionais,
      lucroLiquido,
    };
  }
}
