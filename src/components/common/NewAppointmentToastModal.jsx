import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Calendar, Clock, User, Scissors, DollarSign, X, CheckCircle2, Phone, Globe, Sparkles } from 'lucide-react';

export const NewAppointmentToastModal = () => {
  const { newAppointmentToast, setNewAppointmentToast, setCurrentView, openWhatsappModal } = useApp();

  if (!newAppointmentToast || !newAppointmentToast.isOpen || !newAppointmentToast.agendamento) return null;

  const age = newAppointmentToast.agendamento;

  const handleClose = () => {
    setNewAppointmentToast({ isOpen: false, agendamento: null });
  };

  const handleViewAgenda = () => {
    setCurrentView('agenda');
    handleClose();
  };

  const handleWhatsappConfirm = () => {
    const msg = `Olá *${age.clienteNome}*! 👋 Recebemos o seu agendamento realizado no nosso *LINK PÚBLICO DA AGENDA* para o serviço *${age.servicoNome}* com *${age.funcionarioNome}* no dia *${age.data} às ${age.horario}*!\n\nConfirmamos seu horário com sucesso! Te aguardamos.`;
    openWhatsappModal(age.clienteTelefone || age.clienteWhatsapp, age.clienteNome, msg);
    handleClose();
  };

  return (
    <div className="fixed top-5 right-5 z-[90] max-w-md w-full animate-slideInRight text-slate-950">
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border-2 border-sky-400 space-y-4">
        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-sky-500 to-cyan-400 text-white rounded-2xl animate-bounce shadow-md">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-400 text-slate-950 uppercase tracking-wider flex items-center gap-1 w-fit">
                <Sparkles className="w-3 h-3 text-slate-950" /> LINK PÚBLICO DA AGENDA
              </span>
              <h3 className="font-black text-lg text-white">Novo Agendamento Online!</h3>
            </div>
          </div>

          <button onClick={handleClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Card */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-sky-500/30 space-y-2 text-sm">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="font-black text-base text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-sky-400" /> {age.clienteNome}
            </span>
            <span className="font-mono font-black text-emerald-400 text-base">
              R$ {(age.valor || 0).toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-slate-300 font-extrabold flex items-center gap-1.5">
            <Scissors className="w-4 h-4 text-cyan-400" /> Serviço: <b className="text-white">{age.servicoNome}</b>
          </p>

          <p className="text-xs text-slate-300 font-extrabold flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-400" /> Data: <b className="text-white font-mono">{age.data} às {age.horario}</b>
          </p>

          <p className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            Profissional: <b className="text-white">{age.funcionarioNome}</b>
          </p>

          <div className="pt-1 flex items-center gap-1 text-[11px] font-black text-sky-300">
            <Globe className="w-3.5 h-3.5 text-sky-400" /> Realizado diretamente pelo seu Link da Agenda!
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleViewAgenda}
            className="py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md"
          >
            <Calendar className="w-4 h-4" /> Ver na Agenda
          </button>

          <button
            onClick={handleWhatsappConfirm}
            className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md uppercase"
          >
            <Phone className="w-4 h-4 text-slate-950" /> Confirmar WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
