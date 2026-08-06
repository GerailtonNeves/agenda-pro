import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  UserCheck, 
  Scissors, 
  Package, 
  Users, 
  DollarSign, 
  Receipt, 
  FileSpreadsheet, 
  Bell, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  Crown, 
  ExternalLink,
  Sparkles,
  Copy,
  CheckCircle2,
  Building2,
  Palette,
  Database,
  LogOut,
  Eye
} from 'lucide-react';

export const Sidebar = ({ onItemClick }) => {
  const { 
    currentView, 
    setCurrentView, 
    activeEmpresa, 
    openPublicBookingPage, 
    userRole, 
    isResellerAuthorized, 
    systemTheme,
    currentUser,
    logoutUser 
  } = useApp();
  
  const [copiedLink, setCopiedLink] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-sky-600' },
    { id: 'agenda', label: 'Agenda Interativa', icon: CalendarDays, color: 'text-cyan-600' },
    { id: 'funcionarios', label: 'Funcionários & Comissão', icon: UserCheck, badge: '%', color: 'text-blue-600' },
    { id: 'servicos', label: 'Serviços', icon: Scissors, color: 'text-indigo-600' },
    { id: 'produtos', label: 'Produtos & Estoque', icon: Package, color: 'text-teal-600' },
    { id: 'clientes', label: 'Clientes (CRM)', icon: Users, color: 'text-sky-700' },
    { id: 'financeiro', label: 'Financeiro & Caixa', icon: DollarSign, color: 'text-emerald-600' },
    { id: 'recibos', label: 'Recibos PDF', icon: Receipt, color: 'text-blue-700' },
    { id: 'orcamentos', label: 'Orçamentos', icon: FileSpreadsheet, color: 'text-cyan-700' },
    { id: 'lembretes', label: 'Lembretes', icon: CheckSquare, color: 'text-amber-600' },
    { id: 'notificacoes', label: 'WhatsApp & Avisos', icon: Bell, color: 'text-rose-600' },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3, color: 'text-purple-600' },
    { id: 'configuracoes', label: 'Configurações & Licença', icon: Settings, color: 'text-slate-700' }
  ];

  // RESTRICT SUPABASE & MASTER TOOLS TO SUPERADMIN ONLY
  if (isResellerAuthorized) {
    navItems.push({ id: 'supabase', label: 'Banco Supabase (Nuvem)', icon: Database, super: true, color: 'text-emerald-600' });
    navItems.push({ id: 'superadmin', label: 'Painel Master & Licenciamento', icon: Crown, super: true, color: 'text-amber-500' });
  }

  const publicUrl = `${window.location.origin}/agendar/${activeEmpresa.slug || 'minha-empresa'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleOpenPreview = () => {
    openPublicBookingPage(activeEmpresa.slug || 'minha-empresa');
    if (onItemClick) onItemClick();
  };

  const handleSelectView = (viewId) => {
    setCurrentView(viewId);
    if (onItemClick) onItemClick();
  };

  // Dynamic Theme Gradients & Accents
  const themeStyles = {
    cyan: {
      sidebarBg: 'bg-gradient-to-b from-sky-100 via-sky-50 to-white text-slate-950 border-r border-sky-200',
      brandGradient: 'from-sky-500 via-cyan-400 to-sky-300',
      activeItem: 'bg-sky-500 text-white font-black shadow-lg shadow-sky-500/25 scale-[1.02]',
      buttonPrimary: 'bg-sky-500 hover:bg-sky-600 text-white border border-sky-400'
    },
    purple: {
      sidebarBg: 'bg-gradient-to-b from-purple-100 via-purple-50 to-white text-slate-950 border-r border-purple-200',
      brandGradient: 'from-purple-600 via-violet-500 to-fuchsia-400',
      activeItem: 'bg-purple-600 text-white font-black shadow-lg shadow-purple-600/25 scale-[1.02]',
      buttonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white border border-purple-500'
    },
    emerald: {
      sidebarBg: 'bg-gradient-to-b from-emerald-100 via-emerald-50 to-white text-slate-950 border-r border-emerald-200',
      brandGradient: 'from-emerald-600 via-teal-500 to-green-400',
      activeItem: 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-600/25 scale-[1.02]',
      buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500'
    },
    amber: {
      sidebarBg: 'bg-gradient-to-b from-amber-100 via-amber-50 to-white text-slate-950 border-r border-amber-200',
      brandGradient: 'from-amber-500 via-orange-500 to-yellow-400',
      activeItem: 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25 scale-[1.02]',
      buttonPrimary: 'bg-amber-500 hover:bg-amber-600 text-slate-950 border border-amber-400'
    },
    rose: {
      sidebarBg: 'bg-gradient-to-b from-rose-100 via-rose-50 to-white text-slate-950 border-r border-rose-200',
      brandGradient: 'from-rose-500 via-pink-500 to-rose-400',
      activeItem: 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/25 scale-[1.02]',
      buttonPrimary: 'bg-rose-500 hover:bg-rose-600 text-white border border-rose-400'
    },
    dark: {
      sidebarBg: 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-r border-slate-800',
      brandGradient: 'from-slate-800 via-cyan-600 to-slate-700',
      activeItem: 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25 scale-[1.02]',
      buttonPrimary: 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 border border-cyan-400'
    }
  };

  const currentStyle = themeStyles[systemTheme] || themeStyles.cyan;

  return (
    <aside className={`w-72 h-full ${currentStyle.sidebarBg} flex flex-col justify-between p-4 flex-shrink-0 shadow-sm transition-all duration-300 font-sans`}>
      {/* Top Header Logo */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${currentStyle.brandGradient} text-white flex items-center justify-center font-black shadow-lg shadow-sky-500/20`}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          <div>
            <h1 className="font-black text-lg tracking-tight text-slate-950 leading-tight">
              Agenda<span className="text-sky-600">Pro</span>
            </h1>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
              SaaS Multi-Empresa
            </span>
          </div>
        </div>

        {/* Navigation Item List */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-340px)] pr-1 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isActive 
                    ? currentStyle.activeItem
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white font-black' : item.color || 'text-slate-600'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {item.super && (
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-amber-400 text-slate-950">
                    Master
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section: Copy Link & Open Booking Page Preview */}
      <div className="pt-3 border-t border-slate-200 space-y-2">
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 text-slate-950 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-600">
            <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-sky-600" /> Link de Agendamento</span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">Ativo</span>
          </div>

          <p className="text-xs font-black text-slate-950 truncate">
            /agendar/{activeEmpresa.slug || 'minha-empresa'}
          </p>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={handleOpenPreview}
              className="w-full py-2 px-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 text-[11px] font-black transition flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 text-sky-600" /> Ver Agenda
            </button>

            <button
              onClick={handleCopyLink}
              className={`w-full py-2 px-2 rounded-xl text-[11px] font-black transition flex items-center justify-center gap-1 shadow-xs ${
                copiedLink
                  ? 'bg-emerald-600 text-white'
                  : `${currentStyle.buttonPrimary}`
              }`}
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copiar Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* DEDICATED LOGOUT BUTTON IN SIDEBAR */}
        {currentUser && (
          <button
            onClick={logoutUser}
            className="w-full py-2.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs border border-rose-300 transition flex items-center justify-center gap-2 shadow-xs uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Sair do Sistema</span>
          </button>
        )}
      </div>
    </aside>
  );
};
