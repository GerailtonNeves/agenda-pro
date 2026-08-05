import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  Camera, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Percent,
  Image as ImageIcon
} from 'lucide-react';

export const HeaderCard = () => {
  const { activeEmpresa, agendamentos, openImageUploader, saveEmpresa, openPublicBookingPage } = useApp();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const agendamentosHoje = agendamentos.filter(a => a.data === todayStr);
  const totalHojeCount = agendamentosHoje.length;
  const concluidosHojeCount = agendamentosHoje.filter(a => a.status === 'concluido').length;
  const proximosClientes = agendamentosHoje.filter(a => a.status === 'agendado' || a.status === 'confirmado');
  const faturamentoHoje = agendamentosHoje
    .filter(a => a.status === 'concluido' || a.status === 'confirmado')
    .reduce((acc, curr) => acc + (curr.valor || 0), 0);

  const formattedDate = time.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const formattedTime = time.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-emerald-950 text-white mb-8 border border-sky-400/30 group">
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
        <img 
          src={activeEmpresa.capa} 
          alt="Capa da Empresa" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
      </div>

      <div className="absolute inset-0 z-0 bg-gradient-to-r from-sky-950/90 via-slate-900/85 to-emerald-950/80 backdrop-blur-[2px]" />

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/15">
          <div className="flex items-center gap-5">
            <div className="relative group/logo">
              {/* Light Blue Logo Border */}
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden border-4 border-sky-300 shadow-2xl shadow-sky-400/20 bg-slate-800 flex-shrink-0">
                <img 
                  src={activeEmpresa.logo} 
                  alt={activeEmpresa.nome} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <button 
                onClick={() => openImageUploader('Upload de Logotipo', activeEmpresa.logo, (newUrl) => saveEmpresa({ ...activeEmpresa, logo: newUrl }))}
                className="absolute inset-0 bg-slate-900/70 rounded-3xl opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center text-xs font-black text-white"
              >
                <Camera className="w-6 h-6 text-sky-300" />
              </button>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                {activeEmpresa.nome}
              </h1>

              <p className="text-sm md:text-base text-slate-200 mt-1.5 font-medium flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-300 animate-pulse" />
                <span>{getGreeting()}, <b>Equipe {activeEmpresa.nome}</b>!</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3">
            <div className="bg-slate-950/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-sky-400/30 flex items-center gap-4 shadow-inner">
              <div className="flex items-center gap-2 text-slate-200 text-xs font-bold border-r border-white/15 pr-4">
                <Calendar className="w-4 h-4 text-sky-300" />
                <span className="capitalize">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sky-300 text-base font-black tracking-wider">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{formattedTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => openImageUploader('Upload de Foto de Capa', activeEmpresa.capa, (newUrl) => saveEmpresa({ ...activeEmpresa, capa: newUrl }))}
                className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/30 text-xs font-black backdrop-blur-md transition flex items-center gap-2 border border-sky-200/30 shadow-md"
              >
                <ImageIcon className="w-4 h-4 text-sky-300" /> Trocar Capa
              </button>

              <button
                onClick={() => openPublicBookingPage(activeEmpresa.slug)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-sky-400/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-slate-950" /> Link Público da Empresa
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Top Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-6">
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-sky-400/30 hover:border-sky-300 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-slate-300 tracking-wider">Agendamentos Hoje</span>
              <Calendar className="w-5 h-5 text-sky-300" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{totalHojeCount}</span>
              <span className="text-xs text-sky-200 font-bold">horários</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-emerald-400/30 hover:border-emerald-300 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-slate-300 tracking-wider">Concluídos (Baixa)</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{concluidosHojeCount}</span>
              <span className="text-xs text-emerald-200 font-bold">atendimentos</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-amber-400/30 hover:border-amber-300 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-slate-300 tracking-wider">Faturamento Hoje</span>
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-amber-300 font-mono">R$ {faturamentoHoje.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-cyan-400/30 hover:border-cyan-300 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-slate-300 tracking-wider">Aguardando Atendimento</span>
              <Users className="w-5 h-5 text-cyan-300" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{proximosClientes.length}</span>
              <span className="text-xs text-cyan-200 font-bold">clientes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
