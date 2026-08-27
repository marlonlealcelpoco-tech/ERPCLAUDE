export interface ItemInventario {
  produtoId: string;
  nomeProduto: string;
  quantidadeContada: number;
  quantidadeSistema: number;
  diferenca: number;
}

export interface InventarioEstoque {
  id: string;
  usuarioId: string;
  lojaId: string;
  itens: ItemInventario[];
  observacao?: string;
  criadoEm: Date;
}

export interface CriarInventarioInput {
  usuarioId: string;
  lojaId: string;
  itens: ItemInventario[];
  observacao?: string;
}
