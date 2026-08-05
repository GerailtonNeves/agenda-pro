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
  Palette
} from 'lucide-react';

export const Sidebar = ({ onItemClick }) => {
  const { currentView, setCurrentView, activeEmpresa, openPublicBookingPage, userRole, isResellerAuthorized, systemTheme } = useApp();
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
    { id: 'configuracoes', label: 'Configurações', icon: Settings, color: 'text-slate-700' }
  ];

  if (isResellerAuthorized) {
    navItems.push({ id: 'superadmin', label: 'Painel Master & Licenciamento', icon: Crown, super: true, color: 'text-amber-500' });
  }

  const publicUrl = `${window.location.origin}/agendar/${activeEmpresa.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
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

  const currentTheme = themeStyles[systemTheme] || themeStyles.cyan;

  return (
    <aside className={`w-72 ${currentTheme.sidebarBg} flex flex-col flex-shrink-0 h-[100dvh] max-h-screen shadow-xl transition-colors duration-300 overflow-hidden`}>
      {/* Brand Header */}
      <div className="p-5 border-b border-black/10 flex items-center justify-between bg-white/40 backdrop-blur-xs flex-shrink-0">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${currentTheme.brandGradient} text-white flex items-center justify-center font-black shadow-md border border-white/20`}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-black text-xl tracking-tight leading-none">
              Agenda<span className="opacity-90">Pro</span>
            </h2>
            <span className="text-xs font-black uppercase tracking-widest block mt-1 opacity-80 truncate max-w-[140px]">
              {activeEmpresa.nome}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List - Full Mobile Touch Scrollable */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto min-h-0 scrollbar-thin">
        <div className="px-3 py-1 text-[11px] font-black uppercase tracking-wider opacity-70">
          Menu Principal
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-extrabold transition-all group ${
                isActive
                  ? currentTheme.activeItem
                  : item.super 
                  ? 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300'
                  : 'text-slate-800 hover:bg-black/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-xl transition-transform group-hover:scale-110 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white shadow-xs border border-black/10'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    isActive ? 'text-white' : item.color
                  }`} />
                </div>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-black/10 text-slate-900'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Public Link Footer Box */}
      <div className="p-3 border-t border-black/10 bg-white/40 flex-shrink-0">
        <div className="p-3 rounded-2xl bg-white/80 border border-black/10 text-center space-y-1.5">
          <p className="text-[11px] font-black text-slate-900">Link Público de Agendamento</p>
          <p className="text-[11px] font-mono font-bold truncate bg-white p-1.5 rounded-xl border border-black/10 text-slate-950">{publicUrl}</p>
          
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              onClick={handleCopyLink}
              className={`py-1.5 rounded-xl text-[11px] font-black transition flex items-center justify-center gap-1 border shadow-xs ${
                copiedLink ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-slate-950 hover:bg-slate-800 text-white border-slate-800'
              }`}
            >
              {copiedLink ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedLink ? 'Copiado!' : 'Copiar'}
            </button>

            <button
              onClick={() => {
                openPublicBookingPage(activeEmpresa.slug);
                if (onItemClick) onItemClick();
              }}
              className={`py-1.5 rounded-xl ${currentTheme.buttonPrimary} text-[11px] font-black transition flex items-center justify-center gap-1 shadow-xs`}
            >
              <ExternalLink className="w-3 h-3 text-current" /> Testar
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
