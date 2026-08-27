export interface ItemCompra {
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoCusto: number;
  valorTotal: number;
}

export interface Compra {
  id: string;
  numeroNota: string;
  fornecedorId: string;
  lojaId: string;
  tipo: "manual" | "xml";
  formaPagamento: "a_vista" | "a_prazo";
  numeroParcelas: number;
  valorTotal: number;
  itens: ItemCompra[];
  usuarioId: string;
  criadoEm: Date;
}

export interface ItemCompraInput {
  produtoId?: string;
  nomeProduto: string;
  codigoBarras?: string;
  quantidade: number;
  precoCusto: number;
  precoVenda?: number;
}

export interface CriarCompraInput {
  numeroNota: string;
  fornecedorId: string;
  lojaId: string;
  tipo: "manual" | "xml";
  formaPagamento: "a_vista" | "a_prazo";
  numeroParcelas?: number;
  diasIntervaloParcelas?: number;
  itens: ItemCompraInput[];
  usuarioId: string;
}
