import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Search, 
  Volume2, 
  VolumeX, 
  Building2, 
  ChevronDown, 
  Globe, 
  User, 
  LogOut, 
  Crown,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Copy,
  CheckCircle2,
  ExternalLink,
  Palette
} from 'lucide-react';

export const Navbar = () => {
  const { 
    empresas, 
    activeEmpresa, 
    activeEmpresaId, 
    setActiveEmpresaId, 
    notificacoes, 
    financeiro,
    produtos,
    soundEnabled, 
    setSoundEnabled, 
    userRole, 
    setUserRole,
    setCurrentView,
    openPublicBookingPage,
    systemTheme,
    setSystemTheme
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const dateIn3Days = new Date();
  dateIn3Days.setDate(dateIn3Days.getDate() + 3);
  const dateIn3DaysStr = dateIn3Days.toISOString().split('T')[0];

  const contasVencidasCount = financeiro.filter(f => f.tipo === 'despesa' && f.status === 'pendente' && f.dataVencimento < todayStr).length;
  const contasVencendoCount = financeiro.filter(f => f.tipo === 'despesa' && f.status === 'pendente' && f.dataVencimento >= todayStr && f.dataVencimento <= dateIn3DaysStr).length;
  const estoqueBaixoCount = produtos.filter(p => p.estoqueAtual <= (p.estoqueMinimo || 5)).length;
  const unreadNotifCount = notificacoes.filter(n => !n.lida).length;

  const totalAlertsCount = contasVencidasCount + contasVencendoCount + estoqueBaixoCount + unreadNotifCount;

  const publicUrl = `${window.location.origin}/agendar/${activeEmpresa.slug}`;

  const handleCopyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const themeOptions = [
    { key: 'cyan', label: '🩵 Azul Sky / Cyan', color: 'bg-cyan-500' },
    { key: 'purple', label: '💜 Roxo Neon', color: 'bg-purple-600' },
    { key: 'emerald', label: '🟢 Verde Esmeralda', color: 'bg-emerald-500' },
    { key: 'amber', label: '🧡 Laranja / Âmbar', color: 'bg-amber-500' },
    { key: 'rose', label: '🩷 Rosa Magenta', color: 'bg-rose-500' },
    { key: 'dark', label: '🖤 Modo Escuro (Dark)', color: 'bg-slate-900' }
  ];

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Active Multi-tenant Tenant Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <Building2 className="w-5 h-5 text-sky-600 ml-2" />
          <select
            value={activeEmpresaId}
            onChange={(e) => setActiveEmpresaId(e.target.value)}
            className="bg-transparent text-sm font-black text-slate-950 outline-none pr-3 cursor-pointer"
          >
            {empresas.map(emp => (
              <option key={emp.id} value={emp.id} className="bg-white text-slate-950 font-bold">{emp.nome} ({emp.segmento})</option>
            ))}
          </select>
        </div>

        {/* Public Booking Link Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => openPublicBookingPage(activeEmpresa.slug)}
            className="flex items-center gap-1.5 text-xs font-black text-sky-700 bg-sky-50 hover:bg-sky-100 px-3.5 py-2 rounded-xl border border-sky-200 transition shadow-xs"
          >
            <Globe className="w-4 h-4 text-sky-600" /> Abrir Página Pública
          </button>

          <button
            onClick={handleCopyPublicLink}
            className={`flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl border transition shadow-xs ${
              copiedLink 
                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-950 border-slate-300'
            }`}
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-700" />}
            {copiedLink ? 'Link Copiado!' : 'Copiar Link para Enviar'}
          </button>
        </div>
      </div>

      {/* Right Action Icons & Theme Picker */}
      <div className="flex items-center gap-3">
        {/* Color Palette Theme Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 transition flex items-center gap-1.5"
            title="Mudar Cor do Sistema"
          >
            <Palette className="w-5 h-5 text-sky-600" />
            <span className="hidden sm:inline text-xs font-black">Cor do Sistema</span>
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

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2.5 rounded-xl border transition ${
            soundEnabled ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-rose-50 text-rose-600 border-rose-200'
          }`}
          title={soundEnabled ? 'Sons Ativados' : 'Sons Desativados'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

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

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="relative flex items-center">
            <ShieldCheck className="w-4 h-4 text-sky-600 absolute left-3 pointer-events-none" />
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-950 text-xs font-black outline-none border border-slate-300 cursor-pointer shadow-xs transition"
            >
              <option value="admin" className="bg-white text-slate-950 font-bold">Administrador (Empresa)</option>
              <option value="funcionario" className="bg-white text-slate-950 font-bold">Profissional (Restrito)</option>
              <option value="superadmin" className="bg-white text-amber-950 font-black">👑 SuperAdmin SaaS</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
