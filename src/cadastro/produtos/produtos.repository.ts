import { getLocalDb } from "../../shared/database/connection";
import type { Produto, CriarProdutoInput, AtualizarProdutoInput } from "./produtos.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "produtos";

export class ProdutosRepository {
  async listar(): Promise<Produto[]> {
    const db = getLocalDb();
    return db.find<Produto>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<Produto | null> {
    const db = getLocalDb();
    return db.findById<Produto>(TABLE_NAME, id);
  }

  async buscarPorCodigoBarras(codigo: string): Promise<Produto | null> {
    const db = getLocalDb();
    const [produto] = db.find<Produto>(TABLE_NAME, (p) => p.codigoBarras === codigo);
    return produto || null;
  }

  async buscarPorTermo(termo: string): Promise<Produto[]> {
    const db = getLocalDb();
    const termoLower = termo.toLowerCase();
    return db.find<Produto>(TABLE_NAME, (p) =>
      p.nome.toLowerCase().includes(termoLower) ||
      (p.codigoBarras ? p.codigoBarras.includes(termoLower) : false) ||
      (p.categoria ? p.categoria.toLowerCase().includes(termoLower) : false)
    );
  }

  async criar(dados: CriarProdutoInput): Promise<Produto> {
    const db = getLocalDb();
    const agora = new Date();
    const novoProduto: Produto = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      nome: dados.nome,
      codigoBarras: dados.codigoBarras,
      precoCusto: dados.precoCusto,
      precoVenda: dados.precoVenda,
      estoqueAtual: dados.estoqueAtual ?? 0,
      categoria: dados.categoria,
      fornecedorId: dados.fornecedorId,
      ativo: dados.ativo ?? true,
      criadoEm: agora,
      atualizadoEm: agora,
    };

    db.insert<Produto>(TABLE_NAME, novoProduto);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novoProduto,
    });

    return novoProduto;
  }

  async atualizar(id: string, dados: AtualizarProdutoInput): Promise<Produto> {
    const db = getLocalDb();
    const payload = {
      ...dados,
      atualizadoEm: new Date(),
    };

    const produtoAtualizado = db.update<Produto>(TABLE_NAME, id, payload);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "update",
      payload: produtoAtualizado,
    });

    return produtoAtualizado;
  }
}
