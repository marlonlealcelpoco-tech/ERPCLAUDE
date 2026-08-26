import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().min(1),
  senha: z.string().min(1),
});

export type LoginDto = z.infer<typeof loginSchema>;
