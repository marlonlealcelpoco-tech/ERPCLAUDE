import { ClientesRepository } from "../../cadastro/clientes/clientes.repository";
import { RecebimentosRepository } from "../../caixa/recebimentos/recebimentos.repository";
import type { DemonstrativoContasReceber, RelatorioContasReceberCliente } from "./contas-receber.types";

export class ContasReceberRepository {
  constructor(
    private readonly clientesRepo: ClientesRepository = new ClientesRepository(),
    private readonly recebimentosRepo: RecebimentosRepository = new RecebimentosRepository()
  ) {}

  async obterDemonstrativo(): Promise<DemonstrativoContasReceber> {
    const clientes = await this.clientesRepo.listar();
    const recebimentos = await this.recebimentosRepo.listar();

    const clientesRelatorio: RelatorioContasReceberCliente[] = [];
    let totalGeralAReceber = 0;
    let totalGeralRecebido = 0;

    for (const c of clientes) {
      const recebidosDoCliente = recebimentos
        .filter((r) => r.clienteId === c.id)
        .reduce((acc, r) => acc + r.valorRecebido, 0);

      totalGeralAReceber += c.saldoDevedor || 0;
      totalGeralRecebido += recebidosDoCliente;

      if ((c.saldoDevedor || 0) > 0 || recebidosDoCliente > 0) {
        clientesRelatorio.push({
          clienteId: c.id,
          nomeCliente: c.nome,
          saldoDevedorTotal: c.saldoDevedor || 0,
          totalRecebido: recebidosDoCliente,
        });
      }
    }

    return {
      totalGeralRecebido,
      totalGeralAReceber,
      clientes: clientesRelatorio,
    };
  }
}
