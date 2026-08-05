import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Package, 
  UserCheck, 
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const NotificacoesView = () => {
  const { 
    notificacoes, 
    markNotificacoesLidas, 
    setCurrentView, 
    financeiro, 
    produtos, 
    agendamentos,
    openWhatsappModal
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const dateIn3Days = new Date();
  dateIn3Days.setDate(dateIn3Days.getDate() + 3);
  const dateIn3DaysStr = dateIn3Days.toISOString().split('T')[0];

  // System Dynamic Alerts Generator (Alertas Financeiros e Alertas de Reposição de Estoque)
  const contasVencidasAlerts = financeiro
    .filter(f => f.tipo === 'despesa' && f.status === 'pendente' && f.dataVencimento < todayStr)
    .map(f => ({
      id: `alert-fin-venc-${f.id}`,
      titulo: '🚨 ALERTA: Conta Vencida no Financeiro!',
      mensagem: `A despesa "${f.descricao}" no valor de R$ ${f.valor.toFixed(2)} venceu no dia ${f.dataVencimento} e está pendente de baixa.`,
      tipo: 'financeiro',
      prioridade: 'alta',
      actionView: 'financeiro',
      criadoEm: f.dataVencimento,
      lida: false
    }));

  const contasVencendoAlerts = financeiro
    .filter(f => f.tipo === 'despesa' && f.status === 'pendente' && f.dataVencimento >= todayStr && f.dataVencimento <= dateIn3DaysStr)
    .map(f => ({
      id: `alert-fin-prox-${f.id}`,
      titulo: '⏰ ALERTA: Conta a Vencer em Breve!',
      mensagem: `A despesa "${f.descricao}" de R$ ${f.valor.toFixed(2)} vence em ${f.dataVencimento}.`,
      tipo: 'financeiro',
      prioridade: 'media',
      actionView: 'financeiro',
      criadoEm: f.dataVencimento,
      lida: false
    }));

  const estoqueBaixoAlerts = produtos
    .filter(p => p.estoqueAtual <= (p.estoqueMinimo || 5))
    .map(p => ({
      id: `alert-prod-est-${p.id}`,
      titulo: '📦 ALERTA DE ESTOQUE: Reposição Necessária!',
      mensagem: `O produto "${p.nome}" possui apenas ${p.estoqueAtual} unidades em estoque (mínimo: ${p.estoqueMinimo || 5}).`,
      tipo: 'estoque',
      prioridade: 'alta',
      actionView: 'produtos',
      criadoEm: todayStr,
      lida: false
    }));

  // Combine dynamic system alerts with user notifications
  const allNotifications = [
    ...contasVencidasAlerts,
    ...contasVencendoAlerts,
    ...estoqueBaixoAlerts,
    ...notificacoes.map(n => ({
      ...n,
      actionView: n.tipo === 'agendamento' ? 'agenda' : n.tipo === 'financeiro' ? 'financeiro' : 'dashboard'
    }))
  ];

  const handleNotificationClick = (notif) => {
    if (notif.actionView) {
      setCurrentView(notif.actionView);
    }
  };

  const getNotifBadgeColor = (type, priority) => {
    if (priority === 'alta') return 'bg-rose-100 text-rose-900 border-rose-300';
    if (priority === 'media') return 'bg-amber-100 text-amber-900 border-amber-300';
    if (type === 'agendamento') return 'bg-cyan-100 text-cyan-900 border-cyan-300';
    return 'bg-emerald-100 text-emerald-900 border-emerald-300';
  };

  const getNotifIcon = (type) => {
    if (type === 'financeiro') return <DollarSign className="w-6 h-6 text-rose-600" />;
    if (type === 'estoque') return <Package className="w-6 h-6 text-amber-600" />;
    if (type === 'agendamento') return <Calendar className="w-6 h-6 text-cyan-600" />;
    return <Sparkles className="w-6 h-6 text-emerald-600" />;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 flex items-center gap-2.5">
            <Bell className="w-8 h-8 text-cyan-600" /> Central Unificada de Notificações & Alertas do Sistema
          </h2>
          <p className="text-sm text-slate-600 font-extrabold mt-1">
            Todos os alertas de contas a vencer, produtos sem estoque e novos agendamentos reunidos em um só lugar
          </p>
        </div>

        <button
          onClick={markNotificacoesLidas}
          className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs md:text-sm shadow-md transition flex items-center gap-2"
        >
          <CheckCheck className="w-5 h-5 text-emerald-400" /> Marcar Todas como Lidas
        </button>
      </div>

      {/* Alert Count Summary Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 flex items-center gap-4">
          <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-sm">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-rose-800 font-black uppercase tracking-wider block">Contas Vencidas</span>
            <span className="text-2xl font-black text-rose-700">{contasVencidasAlerts.length} no sistema</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 flex items-center gap-4">
          <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shadow-sm">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-amber-900 font-black uppercase tracking-wider block">Vencendo em 3 Dias</span>
            <span className="text-2xl font-black text-amber-800">{contasVencendoAlerts.length} no sistema</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-cyan-50 border border-cyan-200 flex items-center gap-4">
          <div className="p-3 bg-cyan-600 text-white rounded-2xl shadow-sm">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-cyan-900 font-black uppercase tracking-wider block">Alertas de Estoque</span>
            <span className="text-2xl font-black text-cyan-800">{estoqueBaixoAlerts.length} no sistema</span>
          </div>
        </div>
      </div>

      {/* Interactive Notifications List (Clicking opens the item/view) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h3 className="font-black text-xl text-slate-950 border-b border-slate-100 pb-3">
          Histórico e Alertas Ativos ({allNotifications.length})
        </h3>

        <div className="space-y-3">
          {allNotifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm font-semibold">
              Nenhuma notificação ou alerta no momento. O sistema está 100% em dia!
            </div>
          ) : (
            allNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                  notif.prioridade === 'alta'
                    ? 'bg-rose-50/50 hover:bg-rose-100/70 border-rose-200 shadow-sm'
                    : notif.prioridade === 'media'
                    ? 'bg-amber-50/50 hover:bg-amber-100/70 border-amber-200 shadow-sm'
                    : 'bg-slate-50/80 hover:bg-cyan-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white shadow-xs border border-slate-200 flex-shrink-0">
                    {getNotifIcon(notif.tipo)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-base text-slate-950 group-hover:text-cyan-700 transition">
                        {notif.titulo}
                      </h4>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-black border ${getNotifBadgeColor(notif.tipo, notif.prioridade)}`}>
                        {notif.tipo.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 mt-1 leading-relaxed">
                      {notif.mensagem}
                    </p>
                    <span className="text-xs font-mono font-bold text-slate-400 mt-1 block">
                      Registrado em: {notif.criadoEm || todayStr}
                    </span>
                  </div>
                </div>

                <button
                  className="px-4 py-2.5 rounded-xl bg-slate-950 text-white font-black text-xs group-hover:bg-cyan-600 transition flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap self-start md:self-center"
                >
                  <ExternalLink className="w-4 h-4" /> Abrir para Ver
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
