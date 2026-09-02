export interface NotaFiscalConsumidor {
  id: string;
  vendaId: string;
  chaveAcesso: string;
  numeroNota: number;
  serie: number;
  protocoloAutorizacao: string;
  qrCodeUrl: string;
  status: "emitida" | "cancelada" | "erro";
  ambiente: "homologacao" | "producao";
  criadoEm: Date;
}

export interface EmitirNfceInput {
  vendaId: string;
  ambiente?: "homologacao" | "producao";
}
