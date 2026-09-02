import { z } from "zod";

export const criarSangriaSchema = z.object({
  valor: z.number().positive("Valor da sangria deve ser maior que zero"),
  observacao: z.string().optional(),
});

export const atualizarSangriaSchema = criarSangriaSchema.partial();

export type CriarSangriaDto = z.infer<typeof criarSangriaSchema>;
export type AtualizarSangriaDto = z.infer<typeof atualizarSangriaSchema>;
