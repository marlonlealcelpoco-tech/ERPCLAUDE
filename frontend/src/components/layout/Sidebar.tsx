import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Package,
  Truck,
  UserCheck,
  ShieldCheck,
  Store,
  Receipt,
  FileSpreadsheet,
  AlertTriangle,
  ClipboardList,
  Tags
} from 'lucide-react';
import { PerfilUsuario, UsuarioLogado } from '../../types/auth';

interface SidebarProps {
  usuario: UsuarioLogado;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onLogout: () => void;
}

interface NavGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  perfis: PerfilUsuario[];
  children?: {
    id: string;
    label: string;
    icon: React.ElementType;
    perfis: PerfilUsuario[];
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ usuario, activeTab, onSelectTab, onLogout }) => {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    cadastros: true,
    vendas: false,
    estoque: false,
    financeiro: false,
    relatorios: false
  });

  const toggleSubmenu = (menuId: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const navItems: NavGroup[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      perfis: ['vendedor', 'supervisor', 'estoquista', 'gerente', 'financeiro', 'administrador']
    },
    {
      id: 'vendas',
      label: 'Vendas & PDV',
      icon: ShoppingCart,
      perfis: ['vendedor', 'supervisor', 'gerente', 'administrador'],
      children: [
        { id: 'pdv-frente', label: 'Frente de Caixa (PDV)', icon: ShoppingCart, perfis: ['vendedor', 'supervisor', 'gerente', 'administrador'] },
        { id: 'pdv-caixa', label: 'Abertura/Fechamento', icon: Receipt, perfis: ['vendedor', 'supervisor', 'gerente', 'administrador'] },
        { id: 'pdv-recebimento', label: 'Receber de Cliente', icon: DollarSign, perfis: ['vendedor', 'supervisor', 'gerente', 'administrador'] }
      ]
    },
    {
      id: 'cadastros',
      label: 'Cadastros',
      icon: Users,
      perfis: ['supervisor', 'estoquista', 'gerente', 'financeiro', 'administrador'],
      children: [
        { id: 'cad-clientes', label: 'Clientes', icon: Users, perfis: ['vendedor', 'supervisor', 'gerente', 'administrador'] },
        { id: 'cad-fornecedores', label: 'Fornecedores', icon: Truck, perfis: ['gerente', 'financeiro', 'administrador'] },
        { id: 'cad-produtos', label: 'Produtos', icon: Package, perfis: ['estoquista', 'gerente', 'administrador'] },
        { id: 'cad-vendedores', label: 'Vendedores', icon: UserCheck, perfis: ['gerente', 'administrador'] },
        { id: 'cad-usuarios', label: 'Usuários & Permissões', icon: ShieldCheck, perfis: ['administrador'] },
        { id: 'cad-lojas', label: 'Lojas / Filiais', icon: Store, perfis: ['administrador'] }
      ]
    },
    {
      id: 'estoque',
      label: 'Estoque',
      icon: Package,
      perfis: ['estoquista', 'gerente', 'administrador'],
      children: [
        { id: 'est-consulta', label: 'Consulta & Movimentação', icon: Package, perfis: ['estoquista', 'gerente', 'administrador'] },
        { id: 'est-avarias', label: 'Avarias / Perdas', icon: AlertTriangle, perfis: ['estoquista', 'gerente', 'administrador'] },
        { id: 'est-inventario', label: 'Inventário Físico', icon: ClipboardList, perfis: ['estoquista', 'gerente', 'administrador'] }
      ]
    },
    {
      id: 'compras',
      label: 'Compras & XML',
      icon: Truck,
      perfis: ['gerente', 'financeiro', 'administrador'],
      children: [
        { id: 'comp-nova', label: 'Lançar Compra / XML', icon: Truck, perfis: ['gerente', 'financeiro', 'administrador'] },
        { id: 'comp-notas', label: 'Notas de Compra', icon: FileSpreadsheet, perfis: ['gerente', 'financeiro', 'administrador'] }
      ]
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: DollarSign,
      perfis: ['financeiro', 'administrador'],
      children: [
        { id: 'fin-pagar', label: 'Contas a Pagar', icon: DollarSign, perfis: ['financeiro', 'administrador'] },
        { id: 'fin-receber', label: 'Contas a Receber (Visão)', icon: Receipt, perfis: ['financeiro', 'administrador'] },
        { id: 'fin-fluxo', label: 'Fluxo de Caixa', icon: BarChart3, perfis: ['financeiro', 'administrador'] },
        { id: 'fin-dre', label: 'DRE Sintético', icon: FileSpreadsheet, perfis: ['financeiro', 'administrador'] }
      ]
    },
    {
      id: 'relatorios',
      label: 'Relatórios Gerais',
      icon: BarChart3,
      perfis: ['gerente', 'financeiro', 'administrador']
    },
    {
      id: 'fiscal',
      label: 'Fiscal (NFC-e / NF-e)',
      icon: Tags,
      perfis: ['administrador', 'gerente']
    }
  ];

  // Helper para checar permissão
  const temPermissao = (perfisItem: PerfilUsuario[]) => perfisItem.includes(usuario.perfil);

  return (
    <aside className="w-64 bg-[#0a1e42] text-slate-100 flex flex-col h-screen shadow-xl select-none shrink-0">
      {/* Top Logo Container */}
      <div className="p-4 border-b border-slate-700/60 bg-[#001738] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#003366] via-[#1b3b6f] to-[#dfb24c] flex items-center justify-center shadow-lg border-2 border-[#dfb24c]">
          <span className="text-2xl font-black text-white tracking-widest italic drop-shadow-md">LA</span>
        </div>
        <h1 className="mt-2 font-bold text-lg tracking-wider text-[#dfb24c] uppercase">LA SISTEMA</h1>
        <p className="text-xs text-slate-400 font-medium tracking-wide">Gestão ERP Sob Medida</p>
      </div>

      {/* Menu Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 custom-scrollbar">
        {navItems.filter(item => temPermissao(item.perfis)).map(item => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isSubOpen = openSubmenus[item.id];

          if (!hasChildren) {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#dfb24c] to-[#c49a38] text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          }

          // Item com submenu
          const visibleChildren = item.children?.filter(c => temPermissao(c.perfis)) || [];
          if (visibleChildren.length === 0) return null;

          const isChildActive = visibleChildren.some(c => c.id === activeTab);

          return (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => toggleSubmenu(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isChildActive
                    ? 'bg-[#1b3b6f] text-[#dfb24c] font-semibold border-l-4 border-[#dfb24c]'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-slate-400" />
                  <span>{item.label}</span>
                </div>
                {isSubOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Render Submenu */}
              {isSubOpen && (
                <div className="ml-4 pl-3 border-l-2 border-slate-700/60 space-y-1 py-1">
                  {visibleChildren.map(child => {
                    const ChildIcon = child.icon;
                    const isSelected = activeTab === child.id;
                    return (
                      <button
                        key={child.id}
                        onClick={() => onSelectTab(child.id)}
                        className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#dfb24c] to-[#c49a38] text-slate-950 font-bold shadow'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <ChildIcon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                        <span>{child.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-700/60 bg-[#001738] flex items-center justify-between">
        <div className="flex items-center space-x-3 truncate">
          <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-500 flex items-center justify-center text-sm font-bold text-[#dfb24c]">
            {usuario.nome.slice(0, 2).toUpperCase()}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-slate-200 truncate">{usuario.nome}</p>
            <p className="text-[10px] text-amber-400 capitalize font-medium">{usuario.perfil}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Sair do sistema"
          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
