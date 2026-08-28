import { NfceRepository } from "./nfce.repository";
import { PdvRepository } from "../../vendas/pdv/pdv.repository";
import type { EmitirNfceDto } from "./nfce.schema";
import type { NotaFiscalConsumidor } from "./nfce.types";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error";

export class NfceService {
  constructor(
    private readonly repo: NfceRepository = new NfceRepository(),
    private readonly pdvRepo: PdvRepository = new PdvRepository()
  ) {}

  async listar(): Promise<NotaFiscalConsumidor[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<NotaFiscalConsumidor> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("NFC-e não encontrada");
    return item;
  }

  async emitirNfce(dados: EmitirNfceDto): Promise<NotaFiscalConsumidor> {
    const venda = await this.pdvRepo.buscarPorId(dados.vendaId);
    if (!venda) {
      throw new NotFoundError("Venda não encontrada para emissão de NFC-e");
    }

    const existente = await this.repo.buscarPorVendaId(venda.id);
    if (existente) {
      throw new ConflictError("Já existe uma NFC-e emitida para esta venda");
    }

    const agora = new Date();
    const uf = "35"; // SP
    const aamm = "2401";
    const cnpj = "12345678000199";
    const mod = "65"; // 65 = NFC-e
    const serie = "001";
    const numeroNota = Math.floor(Math.random() * 899999) + 100000;
    const numeroNotaPad = String(numeroNota).padStart(9, "0");
    const tpEmis = "1";
    const cNF = "12345678";
    const cDV = "9";

    const chaveAcesso = `${uf}${aamm}${cnpj}${mod}${serie}${numeroNotaPad}${tpEmis}${cNF}${cDV}`; // 44 dígitos
    const protocoloAutorizacao = `13524000${Math.floor(Math.random() * 899999) + 100000}`;
    const qrCodeUrl = `https://www.sefaz.sp.gov.br/nfce/qrcode?p=${chaveAcesso}|2|1|1|${protocoloAutorizacao}`;

    const nfce: NotaFiscalConsumidor = {
      id: `nfce_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      vendaId: venda.id,
      chaveAcesso,
      numeroNota,
      serie: 1,
      protocoloAutorizacao,
      qrCodeUrl,
      status: "emitida",
      ambiente: dados.ambiente || "homologacao",
      criadoEm: agora,
    };

    return this.repo.salvar(nfce);
  }
}
