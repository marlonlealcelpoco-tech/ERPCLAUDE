export interface CertificadoA1Config {
  id: string;
  lojaId: string;
  cnpjLoja: string;
  nomeArquivoPfx: string;
  certificadoPfxBase64?: string;
  senhaCertificado: string;
  cscId: string; // Ex: "000001"
  codigoCsc: string; // Ex: "12345678-ABCD-EFGH-9012-34567890ABCD"
  ambienteSefaz: "homologacao" | "producao";
  validoAte?: Date;
  status: "ativo" | "inativo" | "expirado";
  criadoEm: Date;
  atualizadoEm: Date;
}
