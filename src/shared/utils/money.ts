// Utilitários monetários. Trabalhar sempre em centavos (inteiro) para evitar
// erro de ponto flutuante em valores financeiros.

export function reaisParaCentavos(valorEmReais: number): number {
  return Math.round(valorEmReais * 100);
}

export function centavosParaReais(valorEmCentavos: number): number {
  return valorEmCentavos / 100;
}

export function formatarMoeda(valorEmCentavos: number): string {
  return centavosParaReais(valorEmCentavos).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
