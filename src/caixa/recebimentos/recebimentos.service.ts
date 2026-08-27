import { RecebimentosRepository } from "./recebimentos.repository";
import { AberturaRepository } from "../abertura/abertura.repository";
import { ClientesRepository } from "../../cadastro/clientes/clientes.repository";
import { ContasAPrazoRepository } from "../../vendas/contas-a-prazo/contas-a-prazo.repository";
import type { CriarRecebimentosDto } from "./recebimentos.schema";
import type { RecebimentoCliente } from "./recebimentos.types";
import { NotFoundError, ValidationError } from "../../shared/errors/app-error";

export class RecebimentosService {
  constructor(
    private readonly repo: RecebimentosRepository = new RecebimentosRepository(),
    private readonly aberturaRepo: AberturaRepository = new AberturaRepository(),
    private readonly clientesRepo: ClientesRepository = new ClientesRepository(),
    private readonly contasAPrazoRepo: ContasAPrazoRepository = new ContasAPrazoRepository()
  ) {}

  async listar(): Promise<RecebimentoCliente[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<RecebimentoCliente> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Recebimento não encontrado");
    return item;
  }

  async receberConta(vendedorId: string, dados: CriarRecebimentosDto): Promise<RecebimentoCliente> {
    const caixaAberto = await this.aberturaRepo.buscarCaixaAbertoPorUsuario(vendedorId);
    if (!caixaAberto) {
      throw new ValidationError("Nenhum caixa aberto para registrar recebimento de conta");
    }

    const cliente = await this.clientesRepo.buscarPorId(dados.clienteId);
    if (!cliente) {
      throw new NotFoundError("Cliente não encontrado");
    }

    if (cliente.saldoDevedor <= 0) {
      throw new ValidationError("Cliente não possui saldo devedor em aberto");
    }

    const valorRecebido = dados.valorRecebido;
    let valorRestanteParaAbater = valorRecebido;

    // Abate automaticamente da conta MAIS ANTIGA para a MAIS NOVA
    const contasPendentes = await this.contasAPrazoRepo.buscarPorClienteId(cliente.id);
    for (const conta of contasPendentes) {
      if (valorRestanteParaAbater <= 0) break;

      if (conta.valorSaldo <= valorRestanteParaAbater) {
        valorRestanteParaAbater -= conta.valorSaldo;
        await this.contasAPrazoRepo.atualizarSaldo(conta.id, 0);
      } else {
        const novoSaldo = conta.valorSaldo - valorRestanteParaAbater;
        valorRestanteParaAbater = 0;
        await this.contasAPrazoRepo.atualizarSaldo(conta.id, novoSaldo);
      }
    }

    // Atualiza saldo devedor total do cliente
    const novoSaldoDevedorCliente = Math.max(0, cliente.saldoDevedor - valorRecebido);
    await this.clientesRepo.atualizar(cliente.id, {
      saldoDevedor: novoSaldoDevedorCliente,
    });

    return this.repo.criar({
      caixaId: caixaAberto.id,
      vendedorId,
      clienteId: cliente.id,
      nomeCliente: cliente.nome,
      valorRecebido,
      formaPagamento: dados.formaPagamento,
    });
  }
}
