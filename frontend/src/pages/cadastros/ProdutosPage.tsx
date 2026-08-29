import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Barcode } from 'lucide-react';
import { produtosService } from '../../services/produtosService';

interface ProdutoUI {
  id: string;
  codigoBarras: string;
  descricao: string;
  ncm: string;
  precoCusto: number;
  precoVenda: number;
  estoqueAtual: number;
  estoqueMinimo: number;
}

const PRODUTOS_INICIAIS: ProdutoUI[] = [
  { id: '1', codigoBarras: '7891234567890', descricao: 'Bicicleta Mountain Bike ARO 29', ncm: '87120010', precoCusto: 1200.00, precoVenda: 1890.00, estoqueAtual: 8, estoqueMinimo: 3 },
  { id: '2', codigoBarras: '7891234567891', descricao: 'Capacete de Ciclismo M/L Red', ncm: '65061000', precoCusto: 85.00, precoVenda: 149.90, estoqueAtual: 15, estoqueMinimo: 5 },
  { id: '3', codigoBarras: '7891234567892', descricao: 'Luva Gel Ciclismo Tam G', ncm: '61169300', precoCusto: 22.00, precoVenda: 45.00, estoqueAtual: 30, estoqueMinimo: 10 },
];

export const ProdutosPage: React.FC = () => {
  const [produtos, setProdutos] = useState<ProdutoUI[]>(PRODUTOS_INICIAIS);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [novoProduto, setNovoProduto] = useState<Partial<ProdutoUI>>({
    codigoBarras: '', descricao: '', ncm: '00000000', precoCusto: 0, precoVenda: 0, estoqueAtual: 0, estoqueMinimo: 5
  });

  useEffect(() => {
    produtosService.listar().then(prods => {
      if (prods && prods.length > 0) {
        setProdutos(prods.map(p => ({
          id: p.id,
          codigoBarras: p.codigoBarras,
          descricao: p.nome,
          ncm: p.ncm || '00000000',
          precoCusto: p.precoCusto,
          precoVenda: p.precoVenda,
          estoqueAtual: p.estoqueAtual,
          estoqueMinimo: p.estoqueMinimo
        })));
      }
    }).catch(() => {});
  }, []);

  const handleSalvarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoProduto.descricao || !novoProduto.codigoBarras) return alert('Descrição e Código de Barras são obrigatórios!');

    if (produtos.some(p => p.codigoBarras === novoProduto.codigoBarras)) {
      return alert(`Erro: Já existe um produto cadastrado com o código de barras ${novoProduto.codigoBarras}`);
    }

    try {
      const created = await produtosService.criar({
        codigoBarras: novoProduto.codigoBarras,
        nome: novoProduto.descricao,
        categoria: 'Geral',
        precoCusto: Number(novoProduto.precoCusto) || 0,
        precoVenda: Number(novoProduto.precoVenda) || 0,
        estoqueAtual: Number(novoProduto.estoqueAtual) || 0,
        estoqueMinimo: Number(novoProduto.estoqueMinimo) || 5,
        unidade: 'UN',
        ncm: novoProduto.ncm || '00000000'
      }).catch(() => null);

      const prodCriado: ProdutoUI = created ? {
        id: created.id,
        codigoBarras: created.codigoBarras,
        descricao: created.nome,
        ncm: created.ncm || '00000000',
        precoCusto: created.precoCusto,
        precoVenda: created.precoVenda,
        estoqueAtual: created.estoqueAtual,
        estoqueMinimo: created.estoqueMinimo
      } : {
        id: Date.now().toString(),
        codigoBarras: novoProduto.codigoBarras,
        descricao: novoProduto.descricao,
        ncm: novoProduto.ncm || '00000000',
        precoCusto: Number(novoProduto.precoCusto) || 0,
        precoVenda: Number(novoProduto.precoVenda) || 0,
        estoqueAtual: Number(novoProduto.estoqueAtual) || 0,
        estoqueMinimo: Number(novoProduto.estoqueMinimo) || 0
      };

      setProdutos([prodCriado, ...produtos]);
      setModalAberto(false);
      setNovoProduto({ codigoBarras: '', descricao: '', ncm: '00000000', precoCusto: 0, precoVenda: 0, estoqueAtual: 0, estoqueMinimo: 5 });
    } catch (err: any) {
      alert(err.message || 'Erro ao cadastrar produto');
    }
  };

  const produtosFiltrados = produtos.filter(p =>
    p.descricao.toLowerCase().includes(busca.toLowerCase()) || p.codigoBarras.includes(busca)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Package className="w-6 h-6 text-[#003366]" />
            <span>Cadastro de Produtos</span>
          </h2>
          <p className="text-xs text-slate-500">Controle fiscal, preços e validação de duplicidade de código de barras</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="px-4 py-2 bg-[#003366] text-white font-bold text-xs rounded-lg flex items-center space-x-2 hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Produto</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Pesquisar por descrição ou código de barras..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Código de Barras</th>
                <th className="p-3.5">Descrição do Produto</th>
                <th className="p-3.5">NCM Fiscal</th>
                <th className="p-3.5 text-right">Preço Custo</th>
                <th className="p-3.5 text-right">Preço Venda</th>
                <th className="p-3.5 text-right">Estoque</th>
                <th className="p-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {produtosFiltrados.map(prod => (
                <tr key={prod.id} className="hover:bg-slate-50 font-medium text-slate-800">
                  <td className="p-3.5 font-mono text-slate-600 flex items-center space-x-1.5">
                    <Barcode className="w-4 h-4 text-slate-400" />
                    <span>{prod.codigoBarras}</span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">{prod.descricao}</td>
                  <td className="p-3.5 font-mono text-slate-500">{prod.ncm}</td>
                  <td className="p-3.5 text-right text-slate-600">R$ {prod.precoCusto.toFixed(2)}</td>
                  <td className="p-3.5 text-right font-black text-[#003366]">R$ {prod.precoVenda.toFixed(2)}</td>
                  <td className="p-3.5 text-right font-bold text-slate-800">
                    <span className={`px-2 py-0.5 rounded ${prod.estoqueAtual <= prod.estoqueMinimo ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-800'}`}>
                      {prod.estoqueAtual} un.
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="p-1 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">Cadastrar Novo Produto</h3>
            <form onSubmit={handleSalvarProduto} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Código de Barras *</label>
                <input
                  type="text"
                  required
                  value={novoProduto.codigoBarras}
                  onChange={e => setNovoProduto({...novoProduto, codigoBarras: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição do Produto *</label>
                <input
                  type="text"
                  required
                  value={novoProduto.descricao}
                  onChange={e => setNovoProduto({...novoProduto, descricao: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NCM Fiscal</label>
                  <input
                    type="text"
                    value={novoProduto.ncm}
                    onChange={e => setNovoProduto({...novoProduto, ncm: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estoque Inicial</label>
                  <input
                    type="number"
                    value={novoProduto.estoqueAtual}
                    onChange={e => setNovoProduto({...novoProduto, estoqueAtual: Number(e.target.value)})}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoProduto.precoCusto}
                    onChange={e => setNovoProduto({...novoProduto, precoCusto: Number(e.target.value)})}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoProduto.precoVenda}
                    onChange={e => setNovoProduto({...novoProduto, precoVenda: Number(e.target.value)})}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-bold"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003366] text-white font-bold rounded-lg hover:bg-slate-800"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
