import React, { useState } from 'react';
import { Store, Plus, Search, Edit2, Trash2 } from 'lucide-react';

interface Loja {
  id: string;
  nome: string;
  cnpj: string;
  tipo: 'MATRIZ' | 'FILIAL';
  endereco: string;
}

const LOJAS_MOCK: Loja[] = [
  { id: 'loja_1', nome: 'Filial A - Matriz Centro', cnpj: '12.345.678/0001-99', tipo: 'MATRIZ', endereco: 'Rua Principal, 100 - Centro' },
  { id: 'loja_2', nome: 'Filial B - Shopping Zona Sul', cnpj: '12.345.678/0002-88', tipo: 'FILIAL', endereco: 'Av. das Nações, 500 - Shopping' },
];

export const LojasPage: React.FC = () => {
  const [lojas, setLojas] = useState<Loja[]>(LOJAS_MOCK);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [novo, setNovo] = useState<Partial<Loja>>({
    nome: '', cnpj: '', tipo: 'FILIAL', endereco: ''
  });

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novo.nome || !novo.cnpj) return alert('Nome da Loja e CNPJ são obrigatórios.');

    const criada: Loja = {
      id: Date.now().toString(),
      nome: novo.nome,
      cnpj: novo.cnpj,
      tipo: novo.tipo || 'FILIAL',
      endereco: novo.endereco || ''
    };

    setLojas([criada, ...lojas]);
    setModalAberto(false);
    setNovo({ nome: '', cnpj: '', tipo: 'FILIAL', endereco: '' });
  };

  const filtradas = lojas.filter(l =>
    l.nome.toLowerCase().includes(busca.toLowerCase()) || l.cnpj.includes(busca)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Store className="w-6 h-6 text-[#003366]" />
            <span>Cadastro de Lojas & Filiais</span>
          </h2>
          <p className="text-xs text-slate-500">Cadastre a Matriz e Filiais ativas para consolidação multi-loja</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="px-4 py-2 bg-[#003366] text-white font-bold text-xs rounded-lg flex items-center space-x-2 hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Filial</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou CNPJ da filial..."
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
                <th className="p-3.5">Nome da Filial / Identificação</th>
                <th className="p-3.5">CNPJ</th>
                <th className="p-3.5">Tipo de Instalação</th>
                <th className="p-3.5">Endereço</th>
                <th className="p-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtradas.map(l => (
                <tr key={l.id} className="hover:bg-slate-50 font-medium text-slate-800">
                  <td className="p-3.5 font-bold text-slate-900">{l.nome}</td>
                  <td className="p-3.5 font-mono text-slate-600">{l.cnpj}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${l.tipo === 'MATRIZ' ? 'bg-[#003366] text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {l.tipo}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">{l.endereco}</td>
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
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">Cadastrar Nova Filial</h3>
            <form onSubmit={handleSalvar} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome da Filial *</label>
                <input
                  type="text"
                  required
                  value={novo.nome}
                  onChange={e => setNovo({ ...novo, nome: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CNPJ *</label>
                  <input
                    type="text"
                    required
                    value={novo.cnpj}
                    onChange={e => setNovo({ ...novo, cnpj: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Instalação</label>
                  <select
                    value={novo.tipo}
                    onChange={e => setNovo({ ...novo, tipo: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-bold"
                  >
                    <option value="FILIAL">Filial</option>
                    <option value="MATRIZ">Matriz</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  value={novo.endereco}
                  onChange={e => setNovo({ ...novo, endereco: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
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
                  Salvar Filial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
