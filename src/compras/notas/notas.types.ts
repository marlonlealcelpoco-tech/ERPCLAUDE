export type TipoNotaCompra = "nota_balcao" | "nfe_xml";

export interface NotaCompra {
  id: string;
  numeroNota: string;
  chaveNfe?: string;
  fornecedorId: string;
  nomeFornecedor: string;
  valorTotal: number;
  dataEmissao: Date;
  tipo: TipoNotaCompra;
  lojaId: string;
  criadoEm: Date;
}

export interface CriarNotaCompraInput {
  numeroNota: string;
  chaveNfe?: string;
  fornecedorId: string;
  nomeFornecedor: string;
  valorTotal: number;
  dataEmissao?: Date;
  tipo: TipoNotaCompra;
  lojaId: string;
}
