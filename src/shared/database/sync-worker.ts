import { processarFilaSincronizacao } from "./sync";

let timerInterval: NodeJS.Timeout | null = null;

export function iniciarWorkerSincronizacao(intervaloMs = 5000): void {
  if (timerInterval) return;

  console.log(`[Sync Worker] Worker de Sincronização em Segundo Plano ativado (intervalo: ${intervaloMs}ms)`);

  timerInterval = setInterval(async () => {
    try {
      await processarFilaSincronizacao();
    } catch (err) {
      console.error("[Sync Worker] Erro durante sincronização em segundo plano:", err);
    }
  }, intervaloMs);
}

export function pararWorkerSincronizacao(): void {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    console.log("[Sync Worker] Worker de Sincronização pausado");
  }
}
