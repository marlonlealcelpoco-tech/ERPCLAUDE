import { z } from "zod";

export const filtroContasReceberSchema = z.object({
  clienteId: z.string().optional(),
});

export type FiltroContasReceberDto = z.infer<typeof filtroContasReceberSchema>;
