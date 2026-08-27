import { FechamentoRepository } from "./fechamento.repository";
import { AberturaRepository } from "../abertura/abertura.repository";
import { SangriaRepository } from "../sangria/sangria.repository";
import { RecebimentosRepository } from "../recebimentos/recebimentos.repository";
import { PdvRepository } from "../../vendas/pdv/pdv.repository";
import { ClientesRepository } from "../../cadastro/clientes/clientes.repository";
import type { CriarFechamentoDto } from "./fechamento.schema";
import type { RelatorioFechamentoCaixa, ResumoVendaCliente, ResumoRecebimentoCliente, ResumoProdutoVendido } from "./fechamento.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class FechamentoService {
  constructor(
    private readonly repo: FechamentoRepository = new FechamentoRepository(),
    private readonly aberturaRepo: AberturaRepository = new AberturaRepository(),
    private readonly sangriaRepo: SangriaRepository = new SangriaRepository(),
    private readonly recebimentosRepo: RecebimentosRepository = new RecebimentosRepository(),
    private readonly pdvRepo: PdvRepository = new PdvRepository(),
    private readonly clientesRepo: ClientesRepository = new ClientesRepository()
  ) {}

  async listar(): Promise<RelatorioFechamentoCaixa[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<RelatorioFechamentoCaixa> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Fechamento de caixa não encontrado");
    return item;
  }

  async fecharCaixa(usuarioId: string, dados: CriarFechamentoDto): Promise<RelatorioFechamentoCaixa> {
    const caixaAberto = await this.aberturaRepo.buscarCaixaAbertoPorUsuario(usuarioId);
    if (!caixaAberto) {
      throw new NotFoundError("Nenhum caixa aberto para fechar");
    }

    const vendas = await this.pdvRepo.buscarPorCaixaId(caixaAberto.id);
    const vendasConcluidas = vendas.filter((v) => v.status === "concluida");

    let totalVendidoDinheiro = 0;
    let totalVendidoDebito = 0;
    let totalVendidoCredito = 0;
    let totalVendidoPix = 0;
    let totalVendidoAPrazo = 0;

    const vendasAPrazoDetalhado: ResumoVendaCliente[] = [];
    const produtosMap = new Map<string, ResumoProdutoVendido>();

    for (const v of vendasConcluidas) {
      switch (v.formaPagamento) {
        case "dinheiro":
          totalVendidoDinheiro += v.valorTotal;
          break;
        case "debito":
          totalVendidoDebito += v.valorTotal;
          break;
        case "credito":
          totalVendidoCredito += v.valorTotal;
          break;
        case "pix":
          totalVendidoPix += v.valorTotal;
          break;
        case "a_prazo":
          totalVendidoAPrazo += v.valorTotal;
          if (v.clienteId) {
            const cliente = await this.clientesRepo.buscarPorId(v.clienteId);
            vendasAPrazoDetalhado.push({
              clienteId: v.clienteId,
              nomeCliente: cliente ? cliente.nome : "Cliente Desconhecido",
              valor: v.valorTotal,
            });
          }
          break;
      }

      for (const item of v.itens) {
        const existente = produtosMap.get(item.produtoId) || {
          produtoId: item.produtoId,
          nomeProduto: item.nomeProduto,
          quantidadeTotal: 0,
          valorTotal: 0,
        };

        produtosMap.set(item.produtoId, {
          ...existente,
          quantidadeTotal: existente.quantidadeTotal + item.quantidade,
          valorTotal: existente.valorTotal + item.valorTotal,
        });
      }
    }

    const totalGeralVendas =
      totalVendidoDinheiro +
      totalVendidoDebito +
      totalVendidoCredito +
      totalVendidoPix +
      totalVendidoAPrazo;

    const recebimentos = await this.recebimentosRepo.buscarPorCaixaId(caixaAberto.id);
    let totalRecebidoDinheiro = 0;
    let totalRecebidoDebito = 0;
    let totalRecebidoCredito = 0;
    let totalRecebidoPix = 0;

    const recebimentosDetalhado: ResumoRecebimentoCliente[] = [];
    for (const r of recebimentos) {
      switch (r.formaPagamento) {
        case "dinheiro":
          totalRecebidoDinheiro += r.valorRecebido;
          break;
        case "debito":
          totalRecebidoDebito += r.valorRecebido;
          break;
        case "credito":
          totalRecebidoCredito += r.valorRecebido;
          break;
        case "pix":
          totalRecebidoPix += r.valorRecebido;
          break;
      }

      recebimentosDetalhado.push({
        clienteId: r.clienteId,
        nomeCliente: r.nomeCliente,
        valorRecebido: r.valorRecebido,
        formaPagamento: r.formaPagamento,
      });
    }

    const totalGeralRecebido =
      totalRecebidoDinheiro +
      totalRecebidoDebito +
      totalRecebidoCredito +
      totalRecebidoPix;

    const sangrias = await this.sangriaRepo.buscarPorCaixaId(caixaAberto.id);
    const totalSangrias = sangrias.reduce((acc, s) => acc + s.valor, 0);

    const dinheiroEsperado =
      caixaAberto.valorInicial + totalVendidoDinheiro + totalRecebidoDinheiro - totalSangrias;

    const diferencaDinheiro = dados.dinheiroContado - dinheiroEsperado;
    const agora = new Date();

    const relatorio: RelatorioFechamentoCaixa = {
      caixaId: caixaAberto.id,
      usuarioId: caixaAberto.usuarioId,
      lojaId: caixaAberto.lojaId,
      abertoEm: caixaAberto.abertoEm,
      fechadoEm: agora,
      valorInicial: caixaAberto.valorInicial,
      totalVendidoDinheiro,
      totalVendidoDebito,
      totalVendidoCredito,
      totalVendidoPix,
      totalVendidoAPrazo,
      totalGeralVendas,
      vendasAPrazoDetalhado,
      totalRecebidoDinheiro,
      totalRecebidoDebito,
      totalRecebidoCredito,
      totalRecebidoPix,
      totalGeralRecebido,
      recebimentosDetalhado,
      totalSangrias,
      dinheiroEsperado,
      dinheiroContado: dados.dinheiroContado,
      diferencaDinheiro,
      produtosVendidos: Array.from(produtosMap.values()),
    };

    await this.aberturaRepo.fecharCaixa(caixaAberto.id);
    await this.repo.criar(relatorio);

    return relatorio;
  }
}
