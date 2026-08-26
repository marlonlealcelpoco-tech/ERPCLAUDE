export interface Produto {
  id: string;
  nome: string;
  codigoBarras?: string;
  precoCusto: number;
  precoVenda: number;
  estoqueAtual: number;
  categoria?: string;
  fornecedorId?: string;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarProdutoInput {
  nome: string;
  codigoBarras?: string;
  precoCusto: number;
  precoVenda: number;
  estoqueAtual?: number;
  categoria?: string;
  fornecedorId?: string;
  ativo?: boolean;
}

export interface AtualizarProdutoInput {
  nome?: string;
  codigoBarras?: string;
  precoCusto?: number;
  precoVenda?: number;
  estoqueAtual?: number;
  categoria?: string;
  fornecedorId?: string;
  ativo?: boolean;
}
