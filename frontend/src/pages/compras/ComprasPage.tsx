import React, { useState } from 'react';
import { Truck, Upload, FileCode, CheckCircle2, Plus, ArrowRight } from 'lucide-react';

export const ComprasPage: React.FC = () => {
  const [tipoCompra, setTipoCompra] = useState<'manual' | 'xml'>('xml');
  const [xmlContent, setXmlContent] = useState('');
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Estados Form Manual
  const [fornecedor, setFornecedor] = useState('');
  const [descricaoItem, setDescricaoItem] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [condicaoPagamento, setCondicaoPagamento] = useState<'a_vista' | 'a_prazo'>('a_prazo');
  const [numeroParcelas, setNumeroParcelas] = useState('2');

  const handleImportarXML = (e: React.FormEvent) => {
    e.preventDefault();
    if (!xmlContent) return alert('Cole ou carregue a estrutura XML da NF-e.');

    setSucesso('XML de NF-e processado com sucesso! Entrada automática de estoque e contas a pagar em 2 parcelas geradas.');
    setXmlContent('');
    setTimeout(() => setSucesso(null), 5000);
  };

  const handleSalvarManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fornecedor || !valorTotal) return alert('Informe fornecedor e valor total.');

    setSucesso(`Compra manual registrada com sucesso! Lançamento em estoque e ${condicaoPagamento === 'a_prazo' ? `${numeroParcelas} parcelas em Contas a Pagar` : 'À Vista em Contas a Pagar'}.`);
    setFornecedor('');
    setDescricaoItem('');
    setValorTotal('');
    setTimeout(() => setSucesso(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Truck className="w-6 h-6 text-[#003366]" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">Módulo de Compras & NF-e</h2>
            <p className="text-xs text-slate-500">Lançamento por XML ou manual com entrada automática de estoque e parcelamento financeiro</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setTipoCompra('xml')}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition ${
              tipoCompra === 'xml' ? 'bg-[#003366] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Importar XML NF-e</span>
          </button>
          <button
            onClick={() => setTipoCompra('manual')}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition ${
              tipoCompra === 'manual' ? 'bg-[#003366] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Nota Balcão / Manual</span>
          </button>
        </div>
      </div>

      {sucesso && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-2 text-emerald-900 text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{sucesso}</span>
        </div>
      )}

      {/* Importador XML */}
      {tipoCompra === 'xml' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-[#003366]" />
            <span>Importação Direta de Arquivo XML da NF-e</span>
          </h3>

          <form onSubmit={handleImportarXML} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Conteúdo do XML da Nota Fiscal (nfeProc / NFe)</label>
              <textarea
                rows={6}
                value={xmlContent}
                onChange={e => setXmlContent(e.target.value)}
                placeholder="Cole o XML completo da NF-e ou utilize a importação de arquivo..."
                className="w-full p-3 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#003366] text-white font-bold rounded-xl hover:bg-slate-800 transition shadow flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Processar XML e Gerar Entrada + Contas a Pagar</span>
            </button>
          </form>
        </div>
      )}

      {/* Lançamento Manual */}
      {tipoCompra === 'manual' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <Plus className="w-5 h-5 text-[#003366]" />
            <span>Lançamento Manual de Compra (Nota Balcão)</span>
          </h3>

          <form onSubmit={handleSalvarManual} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Fornecedor *</label>
              <input
                type="text"
                required
                placeholder="Nome ou Razão Social do Fornecedor..."
                value={fornecedor}
                onChange={e => setFornecedor(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição dos Itens / Observações</label>
                <input
                  type="text"
                  placeholder="Ex: Lote de 10 capacetes e luvas..."
                  value={descricaoItem}
                  onChange={e => setDescricaoItem(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Valor Total da Nota (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={valorTotal}
                  onChange={e => setValorTotal(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Condição de Pagamento</label>
                <select
                  value={condicaoPagamento}
                  onChange={e => setCondicaoPagamento(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-semibold"
                >
                  <option value="a_vista">À Vista</option>
                  <option value="a_prazo">A Prazo (Parcelado)</option>
                </select>
              </div>
              {condicaoPagamento === 'a_prazo' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Número de Parcelas</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={numeroParcelas}
                    onChange={e => setNumeroParcelas(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-bold"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#003366] text-white font-bold rounded-xl hover:bg-slate-800 transition shadow"
            >
              Salvar Compra e Lançar no Financeiro
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
