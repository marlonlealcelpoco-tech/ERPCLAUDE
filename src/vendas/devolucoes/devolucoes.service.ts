import { DevolucoesRepository } from "./devolucoes.repository";
import { PdvRepository } from "../pdv/pdv.repository";
import { ProdutosRepository } from "../../cadastro/produtos/produtos.repository";
import type { CriarDevolucoesDto } from "./devolucoes.schema";
import type { CancelamentoVenda } from "./devolucoes.types";
import { NotFoundError, ForbiddenError, ValidationError } from "../../shared/errors/app-error";

export class DevolucoesService {
  constructor(
    private readonly repo: DevolucoesRepository = new DevolucoesRepository(),
    private readonly pdvRepo: PdvRepository = new PdvRepository(),
    private readonly produtosRepo: ProdutosRepository = new ProdutosRepository()
  ) {}

  async listar(): Promise<CancelamentoVenda[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<CancelamentoVenda> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Cancelamento/Devolução não encontrado");
    return item;
  }

  async solicitarCancelamento(
    usuarioSolicitante: { id: string; perfil: string },
    dados: CriarDevolucoesDto
  ): Promise<CancelamentoVenda> {
    const perfisAutorizados = ["supervisor", "gerente", "administrador"];
    const ehSupervisorOuSuperior = perfisAutorizados.includes(usuarioSolicitante.perfil);

    const venda = await this.pdvRepo.buscarPorId(dados.vendaId);
    if (!venda) {
      throw new NotFoundError("Venda não encontrada");
    }

    if (venda.status === "cancelada") {
      throw new ValidationError("Esta venda já está cancelada");
    }

    // Regra: Vendedor/caixa não pode cancelar venda se houve recebimento de dinheiro ou forma concluída sem autorização de supervisor
    if (!ehSupervisorOuSuperior) {
      throw new ForbiddenError(
        "Vendedores não possuem permissão para cancelar vendas. Autorização de supervisor é necessária."
      );
    }

    // Se a intenção é cancelar um item específico ou a venda inteira
    if (dados.produtoId) {
      const itemVenda = venda.itens.find((i) => i.produtoId === dados.produtoId);
      if (!itemVenda) {
        throw new NotFoundError("Item não encontrado nesta venda");
      }

      if (dados.restaurarEstoque) {
        const produto = await this.produtosRepo.buscarPorId(itemVenda.produtoId);
        if (produto) {
          await this.produtosRepo.atualizar(produto.id, {
            estoqueAtual: produto.estoqueAtual + itemVenda.quantidade,
          });
        }
      }
    } else {
      // Cancelamento da venda inteira
      await this.pdvRepo.cancelarVenda(venda.id, usuarioSolicitante.id);

      if (dados.restaurarEstoque) {
        for (const item of venda.itens) {
          const produto = await this.produtosRepo.buscarPorId(item.produtoId);
          if (produto) {
            await this.produtosRepo.atualizar(produto.id, {
              estoqueAtual: produto.estoqueAtual + item.quantidade,
            });
          }
        }
      }
    }

    return this.repo.criar({
      vendaId: dados.vendaId,
      produtoId: dados.produtoId,
      autorizadoPorId: usuarioSolicitante.id,
      motivo: dados.motivo,
      restaurarEstoque: dados.restaurarEstoque ?? true,
    });
  }
}
