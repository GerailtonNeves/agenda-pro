import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  ChevronDown, 
  Bell, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Crown,
  Palette,
  ExternalLink,
  Sparkles,
  KeyRound,
  LogOut,
  User
} from 'lucide-react';

export const Navbar = () => {
  const { 
    empresas, 
    activeEmpresa, 
    setActiveEmpresaId, 
    userRole,
    currentUser,
    logoutUser,
    notificacoes,
    soundEnabled,
    setSoundEnabled,
    openPublicBookingPage,
    setCurrentView,
    systemTheme,
    setSystemTheme
  } = useApp();

  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const unreadNotifs = notificacoes.filter(n => !n.lida).length;
  const totalAlertsCount = unreadNotifs;

  const themeOptions = [
    { key: 'cyan', label: '🩵 Azul Sky (Padrão)', color: 'bg-sky-500' },
    { key: 'purple', label: '💜 Roxo Neon', color: 'bg-purple-600' },
    { key: 'emerald', label: '🟢 Verde Esmeralda', color: 'bg-emerald-600' },
    { key: 'amber', label: '🧡 Laranja Âmbar', color: 'bg-amber-500' },
    { key: 'rose', label: '🩷 Rosa Magenta', color: 'bg-rose-500' },
    { key: 'dark', label: '🖤 Dark Mode', color: 'bg-slate-900' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs text-slate-950">
      {/* Active Company Selector Header */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowCompanyMenu(!showCompanyMenu)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-950 transition border border-slate-200 group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-xs group-hover:scale-105 transition">
              <Building2 className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Empresa Ativa</div>
              <div className="text-xs font-black text-slate-950 flex items-center gap-1 leading-tight">
                <span className="truncate max-w-[150px] md:max-w-[220px]">{activeEmpresa.nome}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          </button>

          {/* Multitenant Companies Dropdown */}
          {showCompanyMenu && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-scaleUp">
              <div className="px-3 py-2 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                Trocar Empresa (Multitenant)
              </div>
              <div className="space-y-1">
                {empresas.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setActiveEmpresaId(emp.id);
                      setShowCompanyMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-extrabold transition ${
                      activeEmpresa.id === emp.id ? 'bg-slate-900 text-white font-black' : 'hover:bg-slate-100 text-slate-900'
                    }`}
                  >
                    <span className="truncate">{emp.nome}</span>
                    {emp.isReseller && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-950 uppercase">Revendedor</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Public Booking Quick Link Button */}
        <button
          onClick={() => openPublicBookingPage(activeEmpresa.slug)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-black border border-sky-200 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Ver Página Pública</span>
        </button>
      </div>

      {/* Global Action Tools */}
      <div className="flex items-center gap-2.5">
        {/* Color Theme Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 transition flex items-center gap-1.5"
            title="Mudar Cor do Sistema"
          >
            <Palette className="w-5 h-5 text-sky-600" />
            <span className="hidden sm:inline text-xs font-black">Cor</span>
          </button>

          {showThemePicker && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-scaleUp">
              <span className="px-3 py-1 text-[11px] font-black uppercase text-slate-500 block border-b border-slate-100 pb-1.5 mb-1">
                Escolha a Cor do Sistema:
              </span>
              <div className="space-y-1">
                {themeOptions.map(theme => (
                  <button
                    key={theme.key}
                    onClick={() => {
                      setSystemTheme(theme.key);
                      setShowThemePicker(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-extrabold transition ${
                      systemTheme === theme.key ? 'bg-slate-900 text-white font-black' : 'hover:bg-slate-100 text-slate-950'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${theme.color} border border-black/10`} />
                    <span>{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Audio Toggle Button */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2.5 rounded-xl border transition ${
            soundEnabled ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-rose-50 text-rose-600 border-rose-200'
          }`}
          title={soundEnabled ? 'Sons Ativados' : 'Sons Desativados'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        {/* Notification Bell Badge */}
        <button
          onClick={() => setCurrentView('notificacoes')}
          className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 transition"
          title="Central de Notificações & Alertas"
        >
          <Bell className="w-5 h-5 text-slate-800" />
          {totalAlertsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-md animate-pulse">
              {totalAlertsCount > 9 ? '9+' : totalAlertsCount}
            </span>
          )}
        </button>

        {/* LOGGED IN USER PILL & LOGOFF BUTTON (ZERO PUBLIC ROLE DROPDOWN) */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          {currentUser && (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-black text-slate-950 leading-tight">{currentUser.nome}</span>
                <span className="text-[10px] font-extrabold text-sky-700 uppercase leading-tight">
                  {currentUser.role === 'superadmin' ? '👑 Master' : '🏢 Dono'}
                </span>
              </div>

              <button
                onClick={logoutUser}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-extrabold text-xs border border-rose-200 transition flex items-center gap-1"
                title="Sair da Conta (Logoff)"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
