import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UsuarioLogado } from '../../types/auth';

interface AppLayoutProps {
  usuario: UsuarioLogado;
  lojas: Array<{ id: string; nome: string }>;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onSelectLoja: (lojaId: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  usuario,
  lojas,
  activeTab,
  onSelectTab,
  onSelectLoja,
  onLogout,
  children
}) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {/* Sidebar Lateral */}
      <Sidebar
        usuario={usuario}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onLogout={onLogout}
      />

      {/* Área Principal Conteúdo */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          usuario={usuario}
          lojas={lojas}
          onSelectLoja={onSelectLoja}
        />

        {/* Dynamic Main View Window */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};
