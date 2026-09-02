import { NfeRepository } from "./nfe.repository";
import type { EmitirNfeDto } from "./nfe.schema";
import type { NotaFiscalEletronica } from "./nfe.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class NfeService {
  constructor(private readonly repo: NfeRepository = new NfeRepository()) {}

  async listar(): Promise<NotaFiscalEletronica[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<NotaFiscalEletronica> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("NF-e não encontrada");
    return item;
  }

  async emitirNfe(dados: EmitirNfeDto): Promise<NotaFiscalEletronica> {
    const agora = new Date();
    const uf = "35";
    const aamm = "2401";
    const cnpj = "12345678000199";
    const mod = "55"; // 55 = NF-e
    const serie = "001";
    const numeroNota = Math.floor(Math.random() * 899999) + 100000;
    const numeroNotaPad = String(numeroNota).padStart(9, "0");
    const tpEmis = "1";
    const cNF = "87654321";
    const cDV = "3";

    const chaveAcesso = `${uf}${aamm}${cnpj}${mod}${serie}${numeroNotaPad}${tpEmis}${cNF}${cDV}`; // 44 dígitos

    const nfe: NotaFiscalEletronica = {
      id: `nfe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      chaveAcesso,
      numeroNota,
      serie: 1,
      destinatarioCnpjCpf: dados.destinatarioCnpjCpf,
      nomeDestinatario: dados.nomeDestinatario,
      valorTotal: dados.valorTotal,
      status: "emitida",
      ambiente: dados.ambiente || "homologacao",
      criadoEm: agora,
    };

    return this.repo.salvar(nfe);
  }
}
