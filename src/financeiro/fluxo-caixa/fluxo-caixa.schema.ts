import { z } from "zod";

export const filtroFluxoCaixaSchema = z.object({
  vendedorId: z.string().optional(),
  lojaId: z.string().optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
});

export const criarFluxoCaixaSchema = z.object({
  tipo: z.enum(["entrada", "saida"]),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.number().positive("Valor deve ser maior que zero"),
  vendedorId: z.string().optional(),
  lojaId: z.string().min(1, "lojaId é obrigatório"),
});

export const atualizarFluxoCaixaSchema = criarFluxoCaixaSchema.partial();

export type FiltroFluxoCaixaDto = z.infer<typeof filtroFluxoCaixaSchema>;
export type CriarFluxoCaixaDto = z.infer<typeof criarFluxoCaixaSchema>;
export type AtualizarFluxoCaixaDto = z.infer<typeof atualizarFluxoCaixaSchema>;
