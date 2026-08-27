import { z } from "zod";

export const criarRecebimentosSchema = z.object({
  clienteId: z.string().min(1, "clienteId é obrigatório"),
  valorRecebido: z.number().positive("Valor recebido deve ser maior que zero"),
  formaPagamento: z.enum(["dinheiro", "debito", "credito", "pix"]),
});

export const atualizarRecebimentosSchema = criarRecebimentosSchema.partial();

export type CriarRecebimentosDto = z.infer<typeof criarRecebimentosSchema>;
export type AtualizarRecebimentosDto = z.infer<typeof atualizarRecebimentosSchema>;
