import React, { useState } from 'react';
import { Truck, Plus, Search, Edit2, Trash2 } from 'lucide-react';

interface Fornecedor {
  id: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual?: string;
  telefone: string;
  email: string;
}

const FORNECEDORES_MOCK: Fornecedor[] = [
  { id: '1', razaoSocial: 'Distribuidora de Peças Bike Ltda', cnpj: '12.345.678/0001-90', inscricaoEstadual: '111.222.333.444', telefone: '(11) 3333-4444', email: 'vendas@pecasbike.com.br' },
  { id: '2', razaoSocial: 'Indústria Metalúrgica Caloi S.A.', cnpj: '98.765.432/0001-11', inscricaoEstadual: '555.666.777.888', telefone: '(11) 4004-5050', email: 'contato@caloi.com.br' },
];

export const FornecedoresPage: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(FORNECEDORES_MOCK);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [novo, setNovo] = useState<Partial<Fornecedor>>({
    razaoSocial: '', cnpj: '', inscricaoEstadual: '', telefone: '', email: ''
  });

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novo.razaoSocial || !novo.cnpj) return alert('Razão Social e CNPJ são obrigatórios.');

    const criado: Fornecedor = {
      id: Date.now().toString(),
      razaoSocial: novo.razaoSocial,
      cnpj: novo.cnpj,
      inscricaoEstadual: novo.inscricaoEstadual || '',
      telefone: novo.telefone || '',
      email: novo.email || ''
    };

    setFornecedores([criado, ...fornecedores]);
    setModalAberto(false);
    setNovo({ razaoSocial: '', cnpj: '', inscricaoEstadual: '', telefone: '', email: '' });
  };

  const filtrados = fornecedores.filter(f =>
    f.razaoSocial.toLowerCase().includes(busca.toLowerCase()) || f.cnpj.includes(busca)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Truck className="w-6 h-6 text-[#003366]" />
            <span>Cadastro de Fornecedores</span>
          </h2>
          <p className="text-xs text-slate-500">Gerencie os fornecedores de mercadorias para compras e notas fiscais</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="px-4 py-2 bg-[#003366] text-white font-bold text-xs rounded-lg flex items-center space-x-2 hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Fornecedor</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Pesquisar por razão social ou CNPJ..."
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
                <th className="p-3.5">Razão Social</th>
                <th className="p-3.5">CNPJ</th>
                <th className="p-3.5">Inscrição Estadual</th>
                <th className="p-3.5">Contato</th>
                <th className="p-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map(f => (
                <tr key={f.id} className="hover:bg-slate-50 font-medium text-slate-800">
                  <td className="p-3.5 font-bold text-slate-900">{f.razaoSocial}</td>
                  <td className="p-3.5 font-mono text-slate-600">{f.cnpj}</td>
                  <td className="p-3.5 font-mono text-slate-500">{f.inscricaoEstadual || 'Isento'}</td>
                  <td className="p-3.5 text-slate-600">
                    <div>{f.telefone}</div>
                    <div className="text-[10px] text-slate-400">{f.email}</div>
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
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">Cadastrar Novo Fornecedor</h3>
            <form onSubmit={handleSalvar} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Razão Social *</label>
                <input
                  type="text"
                  required
                  value={novo.razaoSocial}
                  onChange={e => setNovo({ ...novo, razaoSocial: e.target.value })}
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
                  <label className="block font-bold text-slate-700 mb-1">Inscrição Estadual</label>
                  <input
                    type="text"
                    value={novo.inscricaoEstadual}
                    onChange={e => setNovo({ ...novo, inscricaoEstadual: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={novo.telefone}
                    onChange={e => setNovo({ ...novo, telefone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={novo.email}
                    onChange={e => setNovo({ ...novo, email: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
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
                  Salvar Fornecedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
