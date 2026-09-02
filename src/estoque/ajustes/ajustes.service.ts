import { AjustesRepository } from "./ajustes.repository";
import { ProdutosRepository } from "../../cadastro/produtos/produtos.repository";
import type { CriarAjustesDto } from "./ajustes.schema";
import type { AjusteEstoque } from "./ajustes.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class AjustesService {
  constructor(
    private readonly repo: AjustesRepository = new AjustesRepository(),
    private readonly produtosRepo: ProdutosRepository = new ProdutosRepository()
  ) {}

  async listar(): Promise<AjusteEstoque[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<AjusteEstoque> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Ajuste de estoque não encontrado");
    return item;
  }

  async registrarAjuste(usuarioId: string, dados: CriarAjustesDto): Promise<AjusteEstoque> {
    const produto = await this.produtosRepo.buscarPorId(dados.produtoId);
    if (!produto) {
      throw new NotFoundError("Produto não encontrado");
    }

    const estoqueAnterior = produto.estoqueAtual;
    const diferenca = dados.novoEstoque - estoqueAnterior;

    await this.produtosRepo.atualizar(produto.id, {
      estoqueAtual: dados.novoEstoque,
    });

    return this.repo.criar({
      produtoId: dados.produtoId,
      estoqueAnterior,
      novoEstoque: dados.novoEstoque,
      diferenca,
      justificativa: dados.justificativa,
      usuarioId,
    });
  }
}
