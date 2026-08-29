import React, { useState } from 'react';
import { DollarSign, ShieldAlert, FileText, CheckCircle2, ArrowUpRight, ArrowDownLeft, BarChart3 } from 'lucide-react';

interface ContaPagar {
  id: string;
  fornecedor: string;
  descricao: string;
  vencimento: string;
  valor: number;
  status: 'pendente' | 'pago';
}

const CONTAS_PAGAR_MOCK: ContaPagar[] = [
  { id: '1', fornecedor: 'Distribuidora de Peças Bike Ltda', descricao: 'Nota Fiscal 00142 - Peças e Acessórios', vencimento: '2025-02-15', valor: 2400.00, status: 'pendente' },
  { id: '2', fornecedor: 'Indústria Metalúrgica Caloi', descricao: 'Nota Fiscal 00980 - Quadros ARO 29', vencimento: '2025-01-25', valor: 5800.00, status: 'pago' },
];

export const FinanceiroPage: React.FC = () => {
  const [aba, setAba] = useState<'pagar' | 'receber' | 'fluxo' | 'dre'>('pagar');
  const [contasPagar, setContasPagar] = useState<ContaPagar[]>(CONTAS_PAGAR_MOCK);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const handleBaixarContaPagar = (id: string) => {
    setContasPagar(prev => prev.map(c => c.id === id ? { ...c, status: 'pago' } : c));
    setSucesso('Conta a pagar baixada com sucesso! Lançada como saída no Financeiro.');
    setTimeout(() => setSucesso(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-6 h-6 text-[#003366]" />
          <h2 className="text-xl font-bold text-slate-900">Módulo Financeiro Central</h2>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setAba('pagar')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition ${
              aba === 'pagar' ? 'bg-[#003366] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Contas a Pagar
          </button>
          <button
            onClick={() => setAba('receber')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition ${
              aba === 'receber' ? 'bg-[#003366] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Contas a Receber (Demonstrativo)
          </button>
          <button
            onClick={() => setAba('fluxo')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition ${
              aba === 'fluxo' ? 'bg-[#003366] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Fluxo de Caixa
          </button>
          <button
            onClick={() => setAba('dre')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition ${
              aba === 'dre' ? 'bg-[#003366] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            DRE Sintético
          </button>
        </div>
      </div>

      {sucesso && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-2 text-emerald-900 text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{sucesso}</span>
        </div>
      )}

      {/* Aba Contas a Pagar */}
      {aba === 'pagar' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center space-x-3 text-xs text-blue-900">
            <ShieldAlert className="w-5 h-5 text-blue-700 shrink-0" />
            <div>
              <strong>Permissão Restrita:</strong> A liquidação e baixa de contas a pagar das compras é permitida <strong>exclusivamente aos perfis Financeiro e Administrador</strong>.
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Fornecedor</th>
                  <th className="p-3.5">Descrição</th>
                  <th className="p-3.5">Vencimento</th>
                  <th className="p-3.5 text-right">Valor</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contasPagar.map(cp => (
                  <tr key={cp.id} className="hover:bg-slate-50 font-medium text-slate-800">
                    <td className="p-3.5 font-bold text-slate-900">{cp.fornecedor}</td>
                    <td className="p-3.5 text-slate-600">{cp.descricao}</td>
                    <td className="p-3.5 font-mono text-slate-600">{cp.vencimento}</td>
                    <td className="p-3.5 text-right font-black text-slate-900">R$ {cp.valor.toFixed(2)}</td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        cp.status === 'pago' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {cp.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {cp.status === 'pendente' ? (
                        <button
                          onClick={() => handleBaixarContaPagar(cp.id)}
                          className="px-3 py-1 bg-emerald-600 text-white font-bold rounded text-[11px] hover:bg-emerald-700 transition"
                        >
                          Baixar Pagamento
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">Liquidado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aba Contas a Receber (Demonstrativo) */}
      {aba === 'receber' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-3 text-xs text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong>Regra Inviolável de ERP:</strong> Nesta aba o setor financeiro pode consultar e conferir o histórico de créditos de clientes. <strong>A baixa do recebimento é feita exclusivamente na tela do Caixa no PDV!</strong>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Contas a Receber por Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-semibold block">João da Silva</span>
                <span className="text-sm font-black text-red-600">Saldo a Receber: R$ 450.00</span>
                <p className="text-[11px] text-slate-400 mt-1">Vendas a prazo em 10/01/2025 e 20/01/2025</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-semibold block">Maria Oliveira</span>
                <span className="text-sm font-black text-red-600">Saldo a Receber: R$ 180.00</span>
                <p className="text-[11px] text-slate-400 mt-1">Venda a prazo em 15/01/2025</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aba Fluxo de Caixa */}
      {aba === 'fluxo' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-[#003366]" />
            <span>Fluxo de Caixa Consolidado por Vendedor / Filial</span>
          </h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="text-emerald-700 font-semibold block">Total Entradas (Vendas + Recebimentos)</span>
              <span className="text-xl font-black text-emerald-900">R$ 14.580,00</span>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <span className="text-red-700 font-semibold block">Total Saídas (Compras + Despesas)</span>
              <span className="text-xl font-black text-red-900">R$ 8.200,00</span>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-blue-700 font-semibold block">Saldo Líquido em Caixa</span>
              <span className="text-xl font-black text-blue-900">R$ 6.380,00</span>
            </div>
          </div>
        </div>
      )}

      {/* Aba DRE Sintético */}
      {aba === 'dre' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 max-w-2xl mx-auto">
          <h3 className="font-bold text-slate-900 text-base border-b pb-2">Demonstração do Resultado do Exercício (DRE Sintético)</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b">
              <span className="font-bold text-slate-800">(+) Receita Bruta de Vendas</span>
              <span className="font-extrabold text-emerald-700">R$ 24.500,00</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-slate-600">(-) Custo dos Produtos Vendidos (CPV)</span>
              <span className="font-bold text-red-600">R$ 12.300,00</span>
            </div>
            <div className="flex justify-between py-1 border-b bg-slate-50 p-1 font-bold">
              <span className="text-slate-900 font-black">(=) Lucro Bruto</span>
              <span className="font-black text-slate-900">R$ 12.200,00</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-slate-600">(-) Despesas Operacionais e Avarias</span>
              <span className="font-bold text-red-600">R$ 3.100,00</span>
            </div>
            <div className="flex justify-between py-2 bg-emerald-100 p-2 rounded text-emerald-950 font-black">
              <span>(=) LUCRO LÍQUIDO DO PERÍODO</span>
              <span className="text-sm">R$ 9.100,00</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
