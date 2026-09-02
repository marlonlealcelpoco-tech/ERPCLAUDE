import { getLocalDb } from "../../shared/database/connection";
import type { CertificadoA1Config } from "./certificado.types";
import type { SalvarCertificadoDto } from "./certificado.schema";

const TABLE_NAME = "certificados_a1";

export class CertificadoService {
  async salvarConfiguracao(dados: SalvarCertificadoDto): Promise<CertificadoA1Config> {
    const db = getLocalDb();
    const agora = new Date();
    const umAnoDepois = new Date(agora.getTime() + 365 * 24 * 60 * 60 * 1000);

    const config: CertificadoA1Config = {
      id: `cert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      lojaId: dados.lojaId,
      cnpjLoja: dados.cnpjLoja,
      nomeArquivoPfx: dados.nomeArquivoPfx,
      certificadoPfxBase64: dados.certificadoPfxBase64,
      senhaCertificado: dados.senhaCertificado,
      cscId: dados.cscId,
      codigoCsc: dados.codigoCsc,
      ambienteSefaz: dados.ambienteSefaz,
      validoAte: umAnoDepois,
      status: "ativo",
      criadoEm: agora,
      atualizadoEm: agora,
    };

    db.insert<CertificadoA1Config>(TABLE_NAME, config);
    return config;
  }

  async obterPorLoja(lojaId: string): Promise<CertificadoA1Config | null> {
    const db = getLocalDb();
    const configs = db.find<CertificadoA1Config>(TABLE_NAME, (c) => c.lojaId === lojaId && c.status === "ativo");
    return configs.length > 0 ? configs[0] : null;
  }
}
