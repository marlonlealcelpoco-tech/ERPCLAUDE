import { z } from "zod";

export const filtroDreSchema = z.object({
  lojaId: z.string().optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
});

export type FiltroDreDto = z.infer<typeof filtroDreSchema>;
