import { api } from './api';

export const relatoriosService = {
  obterResumoPeriodo: (inicio: string, fim: string, lojaId?: string) =>
    api.get(`/relatorios/geral?dataInicio=${inicio}&dataFim=${fim}${lojaId ? `&lojaId=${lojaId}` : ''}`),

  obterRelatorioClientesDevedores: () =>
    api.get('/relatorios/clientes-devedores'),

  obterConsolidadoMultiloja: (inicio: string, fim: string) =>
    api.get(`/relatorios/multiloja?dataInicio=${inicio}&dataFim=${fim}`),
};
