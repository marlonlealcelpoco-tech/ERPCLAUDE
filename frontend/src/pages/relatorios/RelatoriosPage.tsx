import React, { useState } from 'react';
import { BarChart3, Calendar, Filter, FileText, Download, Store } from 'lucide-react';

export const RelatoriosPage: React.FC = () => {
  const [periodo, setPeriodo] = useState<'dia' | 'mes' | 'ano'>('mes');
  const [lojaFiltro, setLojaFiltro] = useState('todas');

  return (
    <div className="space-y-6">
      {/* Header & Filtros */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-[#003366]" />
            <span>Relatórios Gerais Consolidados</span>
          </h2>
          <p className="text-xs text-slate-500">Relatórios com filtros de período e consolidação multi-loja / filial</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          {/* Filtro Filial */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
            <Store className="w-4 h-4 text-slate-500" />
            <span>Filial:</span>
            <select
              value={lojaFiltro}
              onChange={e => setLojaFiltro(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none"
            >
              <option value="todas">Todas as Filiais (Central)</option>
              <option value="loja_1">Filial A (Matriz)</option>
              <option value="loja_2">Filial B (Shopping)</option>
            </select>
          </div>

          {/* Filtro Período */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-500 mr-1" />
            {(['dia', 'mes', 'ano'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-3 py-1 rounded capitalize transition ${
                  periodo === p ? 'bg-[#003366] text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p === 'dia' ? 'Hoje / Dia' : p === 'mes' ? 'Mês Atual' : 'Ano'}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('Exportando relatório consolidado em PDF/Excel...')}
            className="px-4 py-2 bg-[#dfb24c] text-slate-950 font-black rounded-lg hover:brightness-105 transition shadow flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Grid de Relatórios Sintéticos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Contas a Receber */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex justify-between items-center">
            <span>Contas a Receber (Conferência)</span>
            <span className="text-xs text-blue-600 font-bold">Total: R$ 630.00</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b">
              <span className="text-slate-600">Total Recebido no Período:</span>
              <span className="font-extrabold text-emerald-600">R$ 1.250,00</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">A Receber Pendente:</span>
              <span className="font-extrabold text-red-600">R$ 630,00</span>
            </div>
          </div>
        </div>

        {/* Card Contas a Pagar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex justify-between items-center">
            <span>Contas a Pagar</span>
            <span className="text-xs text-blue-600 font-bold">Total: R$ 2.400.00</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b">
              <span className="text-slate-600">Total Pago no Período:</span>
              <span className="font-extrabold text-emerald-600">R$ 5.800,00</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">A Pagar Pendente:</span>
              <span className="font-extrabold text-amber-600">R$ 2.400,00</span>
            </div>
          </div>
        </div>

        {/* Card Vendas por Período */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex justify-between items-center">
            <span>Vendas Consolidadas</span>
            <span className="text-xs text-blue-600 font-bold">Período: {periodo.toUpperCase()}</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b">
              <span className="text-slate-600">Quantidade de Vendas:</span>
              <span className="font-extrabold text-slate-900">42 cupons</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Faturamento Bruto:</span>
              <span className="font-extrabold text-emerald-600">R$ 18.950,00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
