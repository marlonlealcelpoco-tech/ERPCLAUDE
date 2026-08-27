export type FormaPagamento = "dinheiro" | "debito" | "credito" | "pix" | "a_prazo";

export interface ItemVenda {
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  valorTotal: number;
}

export interface VendaPDV {
  id: string;
  caixaId: string;
  vendedorId: string;
  lojaId: string;
  clienteId?: string;
  itens: ItemVenda[];
  formaPagamento: FormaPagamento;
  valorTotal: number;
  status: "concluida" | "cancelada";
  comNfce: boolean;
  criadoEm: Date;
  canceladoEm?: Date;
  canceladoPor?: string;
}

export interface CriarVendaPDVInput {
  vendedorId: string;
  lojaId: string;
  clienteId?: string;
  itens: {
    produtoId: string;
    quantidade: number;
  }[];
  formaPagamento: FormaPagamento;
  comNfce?: boolean;
}
