import { z } from "zod";

export const filtroRelatorioGeralSchema = z.object({
  lojaId: z.string().optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
});

export const criarRelatoriosSchema = filtroRelatorioGeralSchema;
export const atualizarRelatoriosSchema = filtroRelatorioGeralSchema.partial();

export type FiltroRelatorioGeralDto = z.infer<typeof filtroRelatorioGeralSchema>;
export type CriarRelatoriosDto = FiltroRelatorioGeralDto;
export type AtualizarRelatoriosDto = z.infer<typeof atualizarRelatoriosSchema>;
