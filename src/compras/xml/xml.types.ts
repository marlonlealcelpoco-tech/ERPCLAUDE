export interface ItemXmlNfe {
  codigoProduto: string;
  nomeProduto: string;
  ncm?: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface DadosXmlNfe {
  numeroNota: string;
  chaveNfe: string;
  cnpjFornecedor: string;
  nomeFornecedor: string;
  dataEmissao: Date;
  valorTotalNota: number;
  itens: ItemXmlNfe[];
}

export interface ParseXmlInput {
  conteudoXml: string;
}
