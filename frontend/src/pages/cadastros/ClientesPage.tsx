import React, { useState } from 'react';
import { Users, Plus, Search, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  limiteCredito: number;
  saldoDevedor: number;
}

const CLIENTES_INICIAIS: Cliente[] = [
  { id: '1', nome: 'João da Silva', cpfCnpj: '123.456.789-00', telefone: '(11) 98765-4321', email: 'joao@email.com', limiteCredito: 1000.00, saldoDevedor: 450.00 },
  { id: '2', nome: 'Maria Oliveira', cpfCnpj: '987.654.321-11', telefone: '(11) 91234-5678', email: 'maria@email.com', limiteCredito: 1500.00, saldoDevedor: 180.00 },
  { id: '3', nome: 'Empresa ABC Ltda', cpfCnpj: '12.345.678/0001-90', telefone: '(11) 3333-4444', email: 'contato@abc.com', limiteCredito: 5000.00, saldoDevedor: 0.00 },
];

export const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES_INICIAIS);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [novoCliente, setNovoCliente] = useState<Partial<Cliente>>({
    nome: '', cpfCnpj: '', telefone: '', email: '', limiteCredito: 1000
  });

  const handleSalvarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCliente.nome || !novoCliente.cpfCnpj) return alert('Nome e CPF/CNPJ são obrigatórios!');

    const clienteCriado: Cliente = {
      id: Date.now().toString(),
      nome: novoCliente.nome,
      cpfCnpj: novoCliente.cpfCnpj,
      telefone: novoCliente.telefone || '',
      email: novoCliente.email || '',
      limiteCredito: Number(novoCliente.limiteCredito) || 0,
      saldoDevedor: 0
    };

    setClientes([clienteCriado, ...clientes]);
    setModalAberto(false);
    setNovoCliente({ nome: '', cpfCnpj: '', telefone: '', email: '', limiteCredito: 1000 });
  };

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) || c.cpfCnpj.includes(busca)
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-6 h-6 text-[#003366]" />
            <span>Cadastro de Clientes</span>
          </h2>
          <p className="text-xs text-slate-500">Gerencie a base de clientes e controle de saldo devedor/crédito</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="px-4 py-2 bg-[#003366] text-white font-bold text-xs rounded-lg flex items-center space-x-2 hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Busca e Tabela */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou CPF/CNPJ..."
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
                <th className="p-3.5">Nome / Razão Social</th>
                <th className="p-3.5">CPF / CNPJ</th>
                <th className="p-3.5">Contato</th>
                <th className="p-3.5 text-right">Limite de Crédito</th>
                <th className="p-3.5 text-right">Saldo Devedor</th>
                <th className="p-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientesFiltrados.map(cli => (
                <tr key={cli.id} className="hover:bg-slate-50 font-medium text-slate-800">
                  <td className="p-3.5 font-bold text-slate-900">{cli.nome}</td>
                  <td className="p-3.5 font-mono text-slate-600">{cli.cpfCnpj}</td>
                  <td className="p-3.5 text-slate-600">
                    <div>{cli.telefone}</div>
                    <div className="text-[10px] text-slate-400">{cli.email}</div>
                  </td>
                  <td className="p-3.5 text-right font-bold text-slate-700">R$ {cli.limiteCredito.toFixed(2)}</td>
                  <td className="p-3.5 text-right font-extrabold text-red-600">
                    {cli.saldoDevedor > 0 ? `R$ ${cli.saldoDevedor.toFixed(2)}` : 'R$ 0.00'}
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

      {/* Modal Cadastro de Cliente */}
      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">Cadastrar Novo Cliente</h3>
            <form onSubmit={handleSalvarCliente} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={novoCliente.nome}
                  onChange={e => setNovoCliente({...novoCliente, nome: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CPF / CNPJ *</label>
                  <input
                    type="text"
                    required
                    value={novoCliente.cpfCnpj}
                    onChange={e => setNovoCliente({...novoCliente, cpfCnpj: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={novoCliente.telefone}
                    onChange={e => setNovoCliente({...novoCliente, telefone: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={novoCliente.email}
                    onChange={e => setNovoCliente({...novoCliente, email: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Limite de Crédito (R$)</label>
                  <input
                    type="number"
                    value={novoCliente.limiteCredito}
                    onChange={e => setNovoCliente({...novoCliente, limiteCredito: Number(e.target.value)})}
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
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
