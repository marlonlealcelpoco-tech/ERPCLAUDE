import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, ClipboardList, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import { estoqueService } from '../../services/estoqueService';
import { produtosService, Produto } from '../../services/produtosService';

interface MovimentacaoEstoque {
  id: string;
  produtoNome: string;
  tipo: 'entrada' | 'saida' | 'avaria' | 'inventario';
  quantidade: number;
  motivo: string;
  data: string;
  usuario: string;
}

const MOVIMENTACOES_MOCK: MovimentacaoEstoque[] = [
  { id: '1', produtoNome: 'Bicicleta Mountain Bike ARO 29', tipo: 'saida', quantidade: 1, motivo: 'Venda no PDV (Caixa 01)', data: '2025-01-20 14:30', usuario: 'Marlon' },
  { id: '2', produtoNome: 'Capacete de Ciclismo M/L Red', tipo: 'avaria', quantidade: 2, motivo: 'Baixa por avaria no transporte', data: '2025-01-19 10:15', usuario: 'Estoquista Carlos' },
  { id: '3', produtoNome: 'Luva Gel Ciclismo Tam G', tipo: 'entrada', quantidade: 20, motivo: 'Entrada manual por compra de nota balcão', data: '2025-01-18 09:00', usuario: 'Gerente Ana' },
];

export const EstoquePage: React.FC = () => {
  const [abaEstoque, setAbaEstoque] = useState<'movimentacao' | 'avarias' | 'inventario'>('movimentacao');
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>(MOVIMENTACOES_MOCK);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Form states de avaria
  const [produtoAvaria, setProdutoAvaria] = useState('');
  const [qtdAvaria, setQtdAvaria] = useState('1');
  const [motivoAvaria, setMotivoAvaria] = useState('Danificado no transporte');

  useEffect(() => {
    produtosService.listar().then(prods => {
      if (prods && prods.length > 0) setProdutos(prods);
    }).catch(() => {});
  }, []);

  const handleLancarAvaria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtoAvaria) return alert('Selecione um produto.');

    try {
      await estoqueService.registrarBaixaAvaria({
        produtoId: produtoAvaria,
        lojaId: 'loja-01',
        quantidade: Number(qtdAvaria),
        tipo: 'avaria',
        motivo: motivoAvaria
      }).catch(() => {});

      const prodObj = produtos.find(p => p.id === produtoAvaria);
      const prodNome = prodObj ? prodObj.nome : produtoAvaria;

      const nova: MovimentacaoEstoque = {
        id: Date.now().toString(),
        produtoNome: prodNome,
        tipo: 'avaria',
        quantidade: Number(qtdAvaria),
        motivo: motivoAvaria,
        data: new Date().toLocaleString(),
        usuario: 'Estoquista Logado'
      };

      setMovimentacoes([nova, ...movimentacoes]);
      setSucesso(`Baixa por avaria realizada com sucesso para: ${prodNome}`);
      setTimeout(() => setSucesso(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Erro ao lancar avaria');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header Navigation */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="w-6 h-6 text-[#003366]" />
          <h2 className="text-xl font-bold text-slate-900">Gestão & Controle de Estoque</h2>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setAbaEstoque('movimentacao')}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition ${
              abaEstoque === 'movimentacao'
                ? 'bg-[#003366] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Movimentações</span>
          </button>
          <button
            onClick={() => setAbaEstoque('avarias')}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition ${
              abaEstoque === 'avarias'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Lançar Avaria / Perda</span>
          </button>
          <button
            onClick={() => setAbaEstoque('inventario')}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition ${
              abaEstoque === 'inventario'
                ? 'bg-[#003366] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Inventário Físico</span>
          </button>
        </div>
      </div>

      {sucesso && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-2 text-emerald-900 text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{sucesso}</span>
        </div>
      )}

      {/* Conteúdo Aba Movimentações */}
      {abaEstoque === 'movimentacao' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700">
            Histórico Recente de Entradas, Saídas e Ajustes de Estoque
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Data / Hora</th>
                <th className="p-3.5">Produto</th>
                <th className="p-3.5">Tipo</th>
                <th className="p-3.5 text-right">Qtd</th>
                <th className="p-3.5">Motivo / Origem</th>
                <th className="p-3.5">Usuário</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movimentacoes.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 font-medium text-slate-800">
                  <td className="p-3.5 text-slate-500 font-mono">{m.data}</td>
                  <td className="p-3.5 font-bold text-slate-900">{m.produtoNome}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      m.tipo === 'entrada' ? 'bg-emerald-100 text-emerald-800' :
                      m.tipo === 'saida' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {m.tipo}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-extrabold">{m.quantidade} un.</td>
                  <td className="p-3.5 text-slate-600">{m.motivo}</td>
                  <td className="p-3.5 text-slate-500 font-semibold">{m.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Conteúdo Aba Avarias */}
      {abaEstoque === 'avarias' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2 border-b pb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Registrar Baixa por Avaria / Perda / Validade</span>
          </h3>

          <form onSubmit={handleLancarAvaria} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Selecione o Produto *</label>
              <select
                value={produtoAvaria}
                onChange={e => setProdutoAvaria(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none text-xs font-semibold"
              >
                <option value="">Selecione...</option>
                {produtos.length > 0 ? (
                  produtos.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} (Cod: {p.codigoBarras})</option>
                  ))
                ) : (
                  <>
                    <option value="Bicicleta Mountain Bike ARO 29">Bicicleta Mountain Bike ARO 29</option>
                    <option value="Capacete de Ciclismo M/L Red">Capacete de Ciclismo M/L Red</option>
                    <option value="Luva Gel Ciclismo Tam G">Luva Gel Ciclismo Tam G</option>
                  </>
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantidade Avariada *</label>
                <input
                  type="number"
                  min={1}
                  value={qtdAvaria}
                  onChange={e => setQtdAvaria(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Motivo / Causa</label>
                <select
                  value={motivoAvaria}
                  onChange={e => setMotivoAvaria(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                >
                  <option value="Danificado no transporte">Danificado no transporte</option>
                  <option value="Vencido / Fora da Validade">Vencido / Fora da Validade</option>
                  <option value="Defeito de Fábrica">Defeito de Fábrica</option>
                  <option value="Furto / Perda">Furto / Perda</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 text-white font-black rounded-xl hover:bg-amber-700 transition shadow"
            >
              Confirmar Baixa no Estoque
            </button>
          </form>
        </div>
      )}

      {/* Conteúdo Aba Inventário Físico */}
      {abaEstoque === 'inventario' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2 border-b pb-2">
            <ClipboardList className="w-5 h-5 text-[#003366]" />
            <span>Auditoria & Inventário Físico de Loja</span>
          </h3>
          <p className="text-xs text-slate-500">Realize a contagem física dos itens da prateleira para ajustar eventuais divergências do sistema.</p>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
            Painel de auditoria pronto para iniciar sessão de contagem com leitor de código de barras.
          </div>
        </div>
      )}
    </div>
  );
};
