import React, { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { UsuarioLogado, UserProfile, PerfilUsuario } from './types/auth';
import { LoginPage } from './pages/auth/LoginPage';
import { authService } from './services/authService';
import { getAuthToken } from './services/api';

// Import de Páginas Modulares
import { VendaPDV } from './pages/pdv/VendaPDV';
import { AbrirFecharCaixa } from './pages/pdv/AbrirFecharCaixa';
import { ReceberDebitoModal } from './pages/pdv/ReceberDebitoModal';
import { ClientesPage } from './pages/cadastros/ClientesPage';
import { ProdutosPage } from './pages/cadastros/ProdutosPage';
import { FornecedoresPage } from './pages/cadastros/FornecedoresPage';
import { UsuariosPage } from './pages/cadastros/UsuariosPage';
import { LojasPage } from './pages/cadastros/LojasPage';
import { EstoquePage } from './pages/estoque/EstoquePage';
import { FinanceiroPage } from './pages/financeiro/FinanceiroPage';
import { ComprasPage } from './pages/compras/ComprasPage';
import { RelatoriosPage } from './pages/relatorios/RelatoriosPage';
import { CertificadoA1Page } from './pages/fiscal/CertificadoA1Page';

const LOJAS_MOCK = [
  { id: 'loja_1', nome: 'Filial A - Matriz Centro' },
  { id: 'loja_2', nome: 'Filial B - Shopping Zona Sul' }
];

export default function App() {
  const [autenticado, setAutenticado] = useState<boolean>(() => !!getAuthToken());
  const [usuario, setUsuario] = useState<UsuarioLogado>({
    id: 'usr_1',
    nome: 'Marlon Silva',
    email: 'marlon@lasistema.com',
    perfil: 'administrador',
    lojaId: 'loja_1',
    lojaNome: 'Filial A - Matriz Centro'
  });

  const [activeTab, setActiveTab] = useState('pdv-frente');

  const handleLoginSuccess = (userAuth: {
    id: string;
    nome: string;
    username: string;
    perfil: UserProfile;
    lojaId: string;
  }) => {
    const perfLower = userAuth.perfil.toLowerCase() as PerfilUsuario;
    setUsuario({
      id: userAuth.id,
      nome: userAuth.nome,
      email: `${userAuth.username}@lasistema.com`,
      perfil: perfLower,
      lojaId: userAuth.lojaId,
      lojaNome: 'Filial A - Matriz Centro'
    });
    setAutenticado(true);
  };

  const handleLogout = () => {
    authService.logout();
    setAutenticado(false);
  };

  const handleSelectLoja = (lojaId: string) => {
    const loja = LOJAS_MOCK.find(l => l.id === lojaId);
    if (loja) {
      setUsuario(prev => ({
        ...prev,
        lojaId: loja.id,
        lojaNome: loja.nome
      }));
    }
  };

  if (!autenticado) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Switch de Renderização de Conteúdo Modular
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-[#0a1e42] text-white p-6 rounded-xl shadow-lg border-2 border-[#dfb24c] flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-black text-[#dfb24c]">BEM-VINDO AO LA SISTEMA ERP</h2>
                <p className="text-xs text-slate-300 mt-1">Sistema ERP Completo com PDV, Estoque, Financeiro e Multi-loja</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-[#001738] px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-xs font-semibold text-slate-400">Perfil Ativo:</span>
                <select
                  value={usuario.perfil}
                  onChange={e => setUsuario({...usuario, perfil: e.target.value as PerfilUsuario})}
                  className="bg-transparent text-xs font-bold text-[#dfb24c] focus:outline-none cursor-pointer"
                >
                  <option value="administrador" className="bg-slate-900 text-white">Administrador (Acesso Total)</option>
                  <option value="gerente" className="bg-slate-900 text-white">Gerente</option>
                  <option value="vendedor" className="bg-slate-900 text-white">Vendedor / Caixa</option>
                  <option value="estoquista" className="bg-slate-900 text-white">Estoquista</option>
                  <option value="financeiro" className="bg-slate-900 text-white">Financeiro</option>
                  <option value="supervisor" className="bg-slate-900 text-white">Supervisor</option>
                </select>
              </div>
            </div>
            <VendaPDV />
          </div>
        );

      // Módulo Vendas & PDV
      case 'pdv-frente':
        return <VendaPDV />;
      case 'pdv-caixa':
        return <AbrirFecharCaixa />;
      case 'pdv-recebimento':
        return <ReceberDebitoModal />;

      // Módulo Cadastros
      case 'cad-clientes':
        return <ClientesPage />;
      case 'cad-produtos':
        return <ProdutosPage />;
      case 'cad-fornecedores':
        return <FornecedoresPage />;
      case 'cad-vendedores':
      case 'cad-usuarios':
        return <UsuariosPage />;
      case 'cad-lojas':
        return <LojasPage />;

      // Módulo Estoque
      case 'est-consulta':
      case 'est-avarias':
      case 'est-inventario':
        return <EstoquePage />;

      // Módulo Compras
      case 'comp-nova':
      case 'comp-notas':
        return <ComprasPage />;

      // Módulo Financeiro
      case 'fin-pagar':
      case 'fin-receber':
      case 'fin-fluxo':
      case 'fin-dre':
        return <FinanceiroPage />;

      // Módulo Relatórios
      case 'relatorios':
        return <RelatoriosPage />;

      // Módulo Fiscal
      case 'fiscal':
        return <CertificadoA1Page />;

      default:
        return <VendaPDV />;
    }
  };

  return (
    <AppLayout
      usuario={usuario}
      lojas={LOJAS_MOCK}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onSelectLoja={handleSelectLoja}
      onLogout={handleLogout}
    >
      {renderContent()}
    </AppLayout>
  );
}
