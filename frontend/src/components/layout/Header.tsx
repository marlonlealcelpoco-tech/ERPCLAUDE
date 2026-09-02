import React from 'react';
import { Store, Wifi, Bell, Shield } from 'lucide-react';
import { UsuarioLogado } from '../../types/auth';

interface HeaderProps {
  usuario: UsuarioLogado;
  lojas: Array<{ id: string; nome: string }>;
  onSelectLoja: (lojaId: string) => void;
  onlineStatus?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  usuario,
  lojas,
  onSelectLoja,
  onlineStatus = true
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm shrink-0">
      {/* Esquerda: Seletor de Loja / Filial */}
      <div className="flex items-center space-x-3">
        <Store className="w-5 h-5 text-slate-500" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filial Ativa:</span>
        <select
          value={usuario.lojaId}
          onChange={(e) => onSelectLoja(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded-md text-xs font-bold text-slate-800 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#003366]"
        >
          {lojas.map(loja => (
            <option key={loja.id} value={loja.id}>
              {loja.nome} (ID: {loja.id})
            </option>
          ))}
        </select>
      </div>

      {/* Direita: Indicadores de Status e Perfil */}
      <div className="flex items-center space-x-6 text-xs">
        {/* Indicador Offline / Online Sync */}
        <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
          <Wifi className={`w-4 h-4 ${onlineStatus ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`} />
          <span className="font-medium text-slate-600">
            {onlineStatus ? 'Modo Online (Sincronizado)' : 'Modo Offline (BD Local)'}
          </span>
        </div>

        {/* Badge Perfil Acesso */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 font-bold uppercase tracking-wide">
          <Shield className="w-3.5 h-3.5 text-blue-700" />
          <span>Perfil: {usuario.perfil}</span>
        </div>

        {/* Notificações */}
        <button className="relative p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500"></span>
        </button>
      </div>
    </header>
  );
};
