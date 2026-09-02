import { z } from "zod";

export const salvarCertificadoSchema = z.object({
  lojaId: z.string().min(1, "ID da loja é obrigatório"),
  cnpjLoja: z.string().min(14, "CNPJ deve ter no mínimo 14 dígitos"),
  nomeArquivoPfx: z.string().min(1, "Nome do arquivo PFX é obrigatório"),
  certificadoPfxBase64: z.string().optional(),
  senhaCertificado: z.string().min(1, "Senha do certificado A1 é obrigatória"),
  cscId: z.string().min(1, "ID do token CSC é obrigatório"),
  codigoCsc: z.string().min(1, "Código CSC da SEFAZ é obrigatório"),
  ambienteSefaz: z.enum(["homologacao", "producao"]).default("homologacao"),
});

export type SalvarCertificadoDto = z.infer<typeof salvarCertificadoSchema>;
