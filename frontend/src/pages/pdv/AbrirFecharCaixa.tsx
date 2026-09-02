import React, { useState } from 'react';
import { DollarSign, Lock, Unlock, AlertCircle, FileText, CheckCircle2, Printer } from 'lucide-react';
import { pdvService } from '../../services/pdvService';
import { imprimirCupomEscPos } from '../../utils/impressoraEscPos';

export const AbrirFecharCaixa: React.FC = () => {
  const [statusCaixa, setStatusCaixa] = useState<'aberto' | 'fechado'>('aberto');
  const [caixaId, setCaixaId] = useState<string>('caixa_01');
  const [valorInicial, setValorInicial] = useState('100.00');

  // Estados de Fechamento (Conferência Cega de Dinheiro)
  const [dinheiroContado, setDinheiroContado] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [relatorioGerado, setRelatorioGerado] = useState<any | null>(null);

  // Totais simulados do caixa atual
  const vendasSimuladas = {
    abertura: 100.00,
    dinheiroVendido: 450.00,
    dinheiroRecebidoCliente: 120.00,
    retiradasSangria: 50.00,
    pix: 320.00,
    debito: 210.00,
    credito: 540.00,
    aPrazo: 380.00
  };

  const saldoDinheiroEsperado =
    vendasSimuladas.abertura +
    vendasSimuladas.dinheiroVendido +
    vendasSimuladas.dinheiroRecebidoCliente -
    vendasSimuladas.retiradasSangria;

  const handleAbrirCaixa = async () => {
    if (!valorInicial || Number(valorInicial) < 0) return alert('Informe um valor inicial válido!');
    try {
      await pdvService.abrirCaixa({
        lojaId: 'loja-01',
        usuarioId: 'usr-caixa',
        valorInicial: Number(valorInicial)
      }).catch(() => {});
      setStatusCaixa('aberto');
      setRelatorioGerado(null);
    } catch (err: any) {
      alert(err.message || 'Erro ao abrir caixa');
    }
  };

  const handleFecharCaixa = async () => {
    if (!dinheiroContado) return alert('Por favor, informe a contagem de dinheiro no caixa.');

    const contado = Number(dinheiroContado);
    const diferenca = contado - saldoDinheiroEsperado;

    try {
      await pdvService.fecharCaixa({
        caixaId,
        dinheiroContado: contado
      }).catch(() => {});

      const relatorio = {
        dataFechamento: new Date().toLocaleString(),
        statusConferencia: diferenca === 0 ? 'Correto (Zero)' : diferenca > 0 ? `Sobra de R$ ${diferenca.toFixed(2)}` : `Falta de R$ ${Math.abs(diferenca).toFixed(2)}`,
        diferenca,
        contado,
        esperado: saldoDinheiroEsperado,
        totaisFormas: {
          dinheiro: vendasSimuladas.dinheiroVendido,
          pix: vendasSimuladas.pix,
          debito: vendasSimuladas.debito,
          credito: vendasSimuladas.credito,
          aPrazo: vendasSimuladas.aPrazo
        }
      };

      setRelatorioGerado(relatorio);
      setStatusCaixa('fechado');
    } catch (err: any) {
      alert(err.message || 'Erro ao fechar caixa');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho Status do Caixa */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3.5 rounded-xl ${statusCaixa === 'aberto' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {statusCaixa === 'aberto' ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Status do Caixa: <span className={statusCaixa === 'aberto' ? 'text-emerald-600' : 'text-red-600'}>{statusCaixa.toUpperCase()}</span>
            </h2>
            <p className="text-xs text-slate-500">Operador: Marlon (Vendedor / Caixa 01)</p>
          </div>
        </div>

        {statusCaixa === 'aberto' && (
          <div className="text-right">
            <span className="text-xs text-slate-400 font-semibold block uppercase">Saldo de Dinheiro Esperado</span>
            <span className="text-2xl font-black text-[#003366]">R$ {saldoDinheiroEsperado.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Se Caixa Fechado -> Formulário de Abertura */}
      {statusCaixa === 'fechado' && !relatorioGerado && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
            <Unlock className="w-5 h-5 text-[#003366]" />
            <span>Abertura de Caixa</span>
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Valor Inicial de Fundo de Troco (R$)</label>
            <input
              type="number"
              step="0.01"
              value={valorInicial}
              onChange={e => setValorInicial(e.target.value)}
              className="w-full max-w-xs p-2.5 border border-slate-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>
          <button
            onClick={handleAbrirCaixa}
            className="px-6 py-2.5 bg-[#003366] text-white font-bold rounded-lg hover:bg-slate-800 transition shadow"
          >
            Confirmar Abertura de Caixa
          </button>
        </div>
      )}

      {/* Se Caixa Aberto -> Form de Fechamento / Conferência Cega */}
      {statusCaixa === 'aberto' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Resumo Operacional Informativo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-2">
              Resumo da Sessão do Caixa
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Valor Inicial (Abertura):</span>
                <span className="font-bold text-slate-800">R$ {vendasSimuladas.abertura.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Vendas em Dinheiro:</span>
                <span className="font-bold text-slate-800">R$ {vendasSimuladas.dinheiroVendido.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Recebimentos de Clientes (Dinheiro):</span>
                <span className="font-bold text-emerald-600">R$ {vendasSimuladas.dinheiroRecebidoCliente.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Retiradas / Sangrias:</span>
                <span className="font-bold text-red-500">- R$ {vendasSimuladas.retiradasSangria.toFixed(2)}</span>
              </div>

              <div className="pt-2 text-slate-400 uppercase font-semibold text-[10px]">Formas Eletrônicas (Exibição Informativa)</div>
              <div className="flex justify-between py-1 text-slate-700">
                <span>Vendas Pix:</span>
                <span className="font-semibold">R$ {vendasSimuladas.pix.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-700">
                <span>Cartão Débito:</span>
                <span className="font-semibold">R$ {vendasSimuladas.debito.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-700">
                <span>Cartão Crédito:</span>
                <span className="font-semibold">R$ {vendasSimuladas.credito.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Form de Fechamento com Conferência de Dinheiro */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
              <Lock className="w-5 h-5 text-red-600" />
              <span>Conferência de Fechamento</span>
            </h3>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
              <AlertCircle className="w-4 h-4 inline text-blue-700 mr-1" />
              Contagem cega de dinheiro: informe exatamente o valor físico em gaveta. Os valores de Pix e cartão serão comparados por fora com a maquininha.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total em Dinheiro Contado na Gaveta (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={dinheiroContado}
                onChange={e => setDinheiroContado(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-base font-bold focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Observações do Fechamento</label>
              <textarea
                rows={2}
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                placeholder="Opcional: justifique eventuais diferenças..."
                className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
              />
            </div>

            <button
              onClick={handleFecharCaixa}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow"
            >
              Fechar Caixa e Gerar Relatório PDF
            </button>
          </div>
        </div>
      )}

      {/* Relatório Final Gerado */}
      {relatorioGerado && (
        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-[#dfb24c] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h3 className="font-black text-slate-900 text-base">Relatório de Fechamento de Caixa Gerado</h3>
            </div>
            <button
              onClick={() => {
                imprimirCupomEscPos({
                  lojaNome: 'LA SISTEMA ERP - Relatório Fechamento',
                  cnpjLoja: '12.345.678/0001-99',
                  data: relatorioGerado.dataFechamento,
                  vendaId: 'FECHAMENTO_CAIXA',
                  itens: [
                    { nome: 'Dinheiro Contado', quantidade: 1, valorUnitario: relatorioGerado.contado, subtotal: relatorioGerado.contado },
                    { nome: 'Vendas Dinheiro', quantidade: 1, valorUnitario: relatorioGerado.totaisFormas.dinheiro, subtotal: relatorioGerado.totaisFormas.dinheiro },
                    { nome: 'Vendas Pix', quantidade: 1, valorUnitario: relatorioGerado.totaisFormas.pix, subtotal: relatorioGerado.totaisFormas.pix },
                    { nome: 'Vendas Débito', quantidade: 1, valorUnitario: relatorioGerado.totaisFormas.debito, subtotal: relatorioGerado.totaisFormas.debito },
                    { nome: 'Vendas Crédito', quantidade: 1, valorUnitario: relatorioGerado.totaisFormas.credito, subtotal: relatorioGerado.totaisFormas.credito }
                  ],
                  total: relatorioGerado.contado,
                  formaPagamento: relatorioGerado.statusConferencia
                });
              }}
              className="px-4 py-1.5 bg-[#003366] text-white text-xs font-bold rounded-lg flex items-center space-x-1 hover:bg-slate-800 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Impressora Térmica (ESC/POS)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Status da Conferência</span>
              <span className="font-extrabold text-slate-900">{relatorioGerado.statusConferencia}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Dinheiro Contado</span>
              <span className="font-extrabold text-slate-900">R$ {relatorioGerado.contado.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Saldo Esperado</span>
              <span className="font-extrabold text-slate-900">R$ {relatorioGerado.esperado.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Data / Hora</span>
              <span className="font-bold text-slate-800">{relatorioGerado.dataFechamento}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
