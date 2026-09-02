import React, { useState } from 'react';
import { UserCheck, Plus, Search, Edit2, Trash2, Shield } from 'lucide-react';
import { UserProfile } from '../../types/auth';

interface Usuario {
  id: string;
  nome: string;
  username: string;
  perfil: UserProfile;
  lojaNome: string;
}

const USUARIOS_MOCK: Usuario[] = [
  { id: '1', nome: 'Marlon Silva', username: 'marlon.admin', perfil: 'ADMINISTRADOR', lojaNome: 'Filial A - Matriz' },
  { id: '2', nome: 'Carlos Estoquista', username: 'carlos.est', perfil: 'ESTOQUISTA', lojaNome: 'Filial A - Matriz' },
  { id: '3', nome: 'Ana Financeiro', username: 'ana.fin', perfil: 'FINANCEIRO', lojaNome: 'Filial B - Shopping' },
];

export const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(USUARIOS_MOCK);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [novo, setNovo] = useState<Partial<Usuario>>({
    nome: '', username: '', perfil: 'VENDEDOR', lojaNome: 'Filial A - Matriz'
  });

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novo.nome || !novo.username) return alert('Nome e Nome de Usuário são obrigatórios.');

    const criado: Usuario = {
      id: Date.now().toString(),
      nome: novo.nome,
      username: novo.username,
      perfil: novo.perfil as UserProfile || 'VENDEDOR',
      lojaNome: novo.lojaNome || 'Filial A - Matriz'
    };

    setUsuarios([criado, ...usuarios]);
    setModalAberto(false);
    setNovo({ nome: '', username: '', perfil: 'VENDEDOR', lojaNome: 'Filial A - Matriz' });
  };

  const filtrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(busca.toLowerCase()) || u.username.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-[#003366]" />
            <span>Cadastro de Usuários & Vendedores (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-500">Gerencie operadores do sistema e atribua perfis de acesso restritos</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="px-4 py-2 bg-[#003366] text-white font-bold text-xs rounded-lg flex items-center space-x-2 hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Usuário</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou login de usuário..."
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
                <th className="p-3.5">Nome do Operador</th>
                <th className="p-3.5">Usuário / Login</th>
                <th className="p-3.5">Perfil de Acesso</th>
                <th className="p-3.5">Loja Vinculada</th>
                <th className="p-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 font-medium text-slate-800">
                  <td className="p-3.5 font-bold text-slate-900">{u.nome}</td>
                  <td className="p-3.5 font-mono text-slate-600">{u.username}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#003366] text-white">
                      {u.perfil}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">{u.lojaNome}</td>
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
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">Cadastrar Novo Usuário</h3>
            <form onSubmit={handleSalvar} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Usuário / Login *</label>
                  <input
                    type="text"
                    required
                    value={novo.username}
                    onChange={e => setNovo({ ...novo, username: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Perfil de Acesso (RBAC) *</label>
                  <select
                    value={novo.perfil}
                    onChange={e => setNovo({ ...novo, perfil: e.target.value as UserProfile })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none font-bold"
                  >
                    <option value="VENDEDOR">Vendedor / Caixa</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="ESTOQUISTA">Estoquista</option>
                    <option value="GERENTE">Gerente</option>
                    <option value="FINANCEIRO">Financeiro</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                  </select>
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
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
