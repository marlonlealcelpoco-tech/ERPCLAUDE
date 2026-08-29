import React, { useState } from 'react';
import { Search, DollarSign, CheckCircle, ShieldCheck, ArrowDownCircle } from 'lucide-react';

interface ContaReceberItem {
  id: string;
  vendaId: string;
  dataEmissao: string;
  valorOriginal: number;
  saldoDevedor: number;
}

interface ClienteComDebito {
  id: string;
  nome: string;
  cpfCnpj: string;
  saldoDevedorTotal: number;
  contas: ContaReceberItem[];
}

const CLIENTES_MOCK: ClienteComDebito[] = [
  {
    id: 'cli_1',
    nome: 'João da Silva',
    cpfCnpj: '123.456.789-00',
    saldoDevedorTotal: 450.00,
    contas: [
      { id: 'cr_101', vendaId: 'vnd_01', dataEmissao: '2025-01-10', valorOriginal: 250.00, saldoDevedor: 250.00 },
      { id: 'cr_102', vendaId: 'vnd_05', dataEmissao: '2025-01-20', valorOriginal: 200.00, saldoDevedor: 200.00 }
    ]
  },
  {
    id: 'cli_2',
    nome: 'Maria Oliveira',
    cpfCnpj: '987.654.321-11',
    saldoDevedorTotal: 180.00,
    contas: [
      { id: 'cr_103', vendaId: 'vnd_08', dataEmissao: '2025-01-15', valorOriginal: 180.00, saldoDevedor: 180.00 }
    ]
  }
];

export const ReceberDebitoModal: React.FC = () => {
  const [busca, setBusca] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteComDebito | null>(null);
  const [valorPagamento, setValorPagamento] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<'dinheiro' | 'pix' | 'debito' | 'credito'>('dinheiro');
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const clientesFiltrados = CLIENTES_MOCK.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.cpfCnpj.includes(busca)
  );

  const handleAbaterDebito = () => {
    if (!clienteSelecionado) return;
    const valor = Number(valorPagamento);
    if (!valor || valor <= 0) return alert('Informe um valor de recebimento válido.');

    if (valor > clienteSelecionado.saldoDevedorTotal) {
      if (!confirm(`O valor informado (R$ ${valor.toFixed(2)}) é maior que o saldo devedor (R$ ${clienteSelecionado.saldoDevedorTotal.toFixed(2)}). Deseja continuar?`)) {
        return;
      }
    }

    setMensagemSucesso(`Recebimento de R$ ${valor.toFixed(2)} abatido com sucesso da conta do cliente ${clienteSelecionado.nome} (da parcela mais antiga para a mais nova). Lançado no fluxo deste caixa.`);
    setValorPagamento('');
    setClienteSelecionado(null);

    setTimeout(() => setMensagemSucesso(null), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner de Aviso de Regra de Negócio */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-3 text-xs text-amber-900">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <span className="font-bold">Regra Geral de Financeiro:</span> Baixas e recebimentos de contas de clientes só podem ser realizados <strong>exclusivamente através do Caixa aberto</strong>. O abate ocorre automaticamente da conta mais antiga para a mais nova.
        </div>
      </div>

      {mensagemSucesso && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-3 text-emerald-900">
          <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
          <span className="font-bold text-sm">{mensagemSucesso}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lado Esquerdo: Busca de Cliente */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
            <Search className="w-5 h-5 text-[#003366]" />
            <span>Consultar Cliente / Saldo Devedor</span>
          </h3>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar cliente por nome ou CPF..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {clientesFiltrados.map(cli => (
              <div
                key={cli.id}
                onClick={() => {
                  setClienteSelecionado(cli);
                  setValorPagamento(cli.saldoDevedorTotal.toString());
                }}
                className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                  clienteSelecionado?.id === cli.id
                    ? 'border-[#003366] bg-blue-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-800">{cli.nome}</h4>
                  <p className="text-[11px] text-slate-500">CPF: {cli.cpfCnpj}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Débito Total</span>
                  <span className="text-sm font-black text-red-600">R$ {cli.saldoDevedorTotal.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lado Direito: Formulário de Recebimento */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-2 flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Lançar Recebimento de Conta</span>
            </h3>

            {clienteSelecionado ? (
              <div className="mt-4 space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <p className="text-xs text-slate-500">Cliente Selecionado:</p>
                  <p className="text-sm font-extrabold text-slate-900">{clienteSelecionado.nome}</p>
                  <p className="text-xs text-slate-600">Saldo em Aberto: <strong className="text-red-600">R$ {clienteSelecionado.saldoDevedorTotal.toFixed(2)}</strong></p>
                </div>

                {/* Detalhe das parcelas a receber */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parcelas do Cliente (Ordem de abate automática):</label>
                  <div className="space-y-1">
                    {clienteSelecionado.contas.map((cr, idx) => (
                      <div key={cr.id} className="p-2 bg-slate-100 rounded text-xs flex justify-between items-center text-slate-700">
                        <span>{idx + 1}ª Nota ({cr.dataEmissao}):</span>
                        <span className="font-bold">R$ {cr.saldoDevedor.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Valor Recebido do Cliente (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={valorPagamento}
                    onChange={e => setValorPagamento(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-base font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Forma de Recebimento</label>
                  <select
                    value={formaPagamento}
                    onChange={e => setFormaPagamento(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold focus:outline-none"
                  >
                    <option value="dinheiro">Dinheiro (Entra na contagem física do caixa)</option>
                    <option value="pix">Pix (Informativo no relatório do caixa)</option>
                    <option value="debito">Cartão Débito</option>
                    <option value="credito">Cartão Crédito</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400">
                <ArrowDownCircle className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-1" />
                <p className="text-xs font-medium">Selecione um cliente na lista ao lado para lançar o recebimento</p>
              </div>
            )}
          </div>

          {clienteSelecionado && (
            <button
              onClick={handleAbaterDebito}
              className="w-full mt-4 py-3 bg-gradient-to-r from-[#dfb24c] to-[#c49a38] text-slate-950 font-black rounded-xl hover:brightness-105 transition shadow"
            >
              Abater Débito e Confirmar Recebimento
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
