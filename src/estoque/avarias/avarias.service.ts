import { AvariasRepository } from "./avarias.repository";
import { ProdutosRepository } from "../../cadastro/produtos/produtos.repository";
import type { CriarAvariasDto } from "./avarias.schema";
import type { AvariaEstoque } from "./avarias.types";
import { NotFoundError, ValidationError } from "../../shared/errors/app-error";

export class AvariasService {
  constructor(
    private readonly repo: AvariasRepository = new AvariasRepository(),
    private readonly produtosRepo: ProdutosRepository = new ProdutosRepository()
  ) {}

  async listar(): Promise<AvariaEstoque[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<AvariaEstoque> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Avaria/Baixa não encontrada");
    return item;
  }

  async registrarAvaria(usuarioId: string, dados: CriarAvariasDto): Promise<AvariaEstoque> {
    const produto = await this.produtosRepo.buscarPorId(dados.produtoId);
    if (!produto) {
      throw new NotFoundError("Produto não encontrado");
    }

    if (produto.estoqueAtual < dados.quantidade) {
      throw new ValidationError(`Estoque insuficiente para registrar baixa por avaria/perda em ${produto.nome}`);
    }

    await this.produtosRepo.atualizar(produto.id, {
      estoqueAtual: produto.estoqueAtual - dados.quantidade,
    });

    return this.repo.criar({
      produtoId: dados.produtoId,
      quantidade: dados.quantidade,
      tipo: dados.tipo,
      motivo: dados.motivo,
      usuarioId,
    });
  }
}
