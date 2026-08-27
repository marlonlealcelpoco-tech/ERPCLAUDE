import { XmlRepository } from "./xml.repository";
import type { DadosXmlNfe, ItemXmlNfe } from "./xml.types";
import { ValidationError } from "../../shared/errors/app-error";

export class XmlService {
  constructor(private readonly repo: XmlRepository = new XmlRepository()) {}

  async parsearXml(conteudoXml: string): Promise<DadosXmlNfe> {
    const extrairTag = (tag: string, xml: string): string => {
      const match = xml.match(new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, "i"));
      return match ? match[1].trim() : "";
    };

    const numeroNota = extrairTag("nNF", conteudoXml) || `NF-${Date.now()}`;
    const chaveNfe = extrairTag("chNFe", conteudoXml) || `CHAVE_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cnpjFornecedor = extrairTag("CNPJ", conteudoXml) || "00000000000000";
    const nomeFornecedor = extrairTag("xNome", conteudoXml) || "Fornecedor Importado XML";
    const valorTotalNotaStr = extrairTag("vNF", conteudoXml);
    const valorTotalNota = valorTotalNotaStr ? parseFloat(valorTotalNotaStr) : 0;

    const itens: ItemXmlNfe[] = [];
    const detMatches = conteudoXml.match(/<det[\s\S]*?<\/det>/gi) || [];

    for (const detXml of detMatches) {
      const codigoProduto = extrairTag("cProd", detXml) || `PROD_${itens.length + 1}`;
      const nomeProduto = extrairTag("xProd", detXml) || "Produto Sem Nome";
      const ncm = extrairTag("NCM", detXml);
      const quantidade = parseFloat(extrairTag("qCom", detXml) || "1");
      const valorUnitario = parseFloat(extrairTag("vUnCom", detXml) || "0");
      const valorTotal = parseFloat(extrairTag("vProd", detXml) || (quantidade * valorUnitario).toString());

      itens.push({
        codigoProduto,
        nomeProduto,
        ncm,
        quantidade,
        valorUnitario,
        valorTotal,
      });
    }

    if (itens.length === 0) {
      throw new ValidationError("Nenhum item válido foi encontrado no conteúdo XML fornecido");
    }

    const resultado: DadosXmlNfe = {
      numeroNota,
      chaveNfe,
      cnpjFornecedor,
      nomeFornecedor,
      dataEmissao: new Date(),
      valorTotalNota: valorTotalNota || itens.reduce((acc, i) => acc + i.valorTotal, 0),
      itens,
    };

    await this.repo.salvar(resultado);
    return resultado;
  }

  async buscarPorChave(chave: string): Promise<DadosXmlNfe | null> {
    return this.repo.buscarPorChave(chave);
  }
}
