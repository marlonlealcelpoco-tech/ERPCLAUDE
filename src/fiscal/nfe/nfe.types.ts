export interface NotaFiscalEletronica {
  id: string;
  chaveAcesso: string;
  numeroNota: number;
  serie: number;
  destinatarioCnpjCpf: string;
  nomeDestinatario: string;
  valorTotal: number;
  status: "emissao_pendente" | "emitida" | "cancelada";
  ambiente: "homologacao" | "producao";
  criadoEm: Date;
}

export interface EmitirNfeInput {
  destinatarioCnpjCpf: string;
  nomeDestinatario: string;
  valorTotal: number;
  ambiente?: "homologacao" | "producao";
}
