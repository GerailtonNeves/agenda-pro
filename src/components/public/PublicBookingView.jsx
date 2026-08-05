import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Scissors, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Globe, 
  ShieldCheck,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

export const PublicBookingView = () => {
  const { 
    empresas, 
    todosFuncionarios, 
    servicos, 
    addAgendamento, 
    publicBookingSlug, 
    publicEmployeeSlug, 
    setCurrentView,
    openWhatsappModal
  } = useApp();

  const empresa = empresas.find(e => e.slug === publicBookingSlug) || empresas[0];
  const staff = todosFuncionarios.filter(f => f.empresaId === empresa.id);
  const preSelectedFunc = publicEmployeeSlug ? staff.find(f => f.linkPublicoSlug === publicEmployeeSlug) : null;

  const [selectedServico, setSelectedServico] = useState(servicos[0] || null);
  const [selectedFunc, setSelectedFunc] = useState(preSelectedFunc || staff[0] || null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedHorario, setSelectedHorario] = useState('10:00');
  
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const availableHours = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const handleBook = (e) => {
    e.preventDefault();
    if (!clienteNome || !selectedServico || !selectedFunc) {
      alert('Por favor, preencha seu nome e selecione o serviço e profissional.');
      return;
    }

    const created = addAgendamento({
      empresaId: empresa.id,
      clienteNome,
      clienteTelefone,
      funcionarioId: selectedFunc.id,
      funcionarioNome: selectedFunc.nome,
      servicoId: selectedServico.id,
      servicoNome: selectedServico.nome,
      data: selectedDate,
      horario: selectedHorario,
      valor: selectedServico.preco,
      observacoes
    });

    setConfirmedBooking(created);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 selection:bg-cyan-500 selection:text-white">
      {/* Top Floating Return Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 sticky top-0 z-40 flex items-center justify-between text-xs shadow-md">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-black rounded-xl transition flex items-center gap-2 border border-slate-700 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-sky-300" /> Voltar ao Painel Admin
        </button>

        <span className="text-slate-300 font-mono font-bold hidden sm:inline">
          Página Pública de Agendamento • {empresa.nome}
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-slate-800 text-white p-6 md:p-10 group">
          <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
            <img src={empresa.capa} alt={empresa.nome} className="w-full h-full object-cover" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-sky-300 shadow-2xl bg-slate-900 flex-shrink-0">
              <img src={empresa.logo} alt={empresa.nome} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-sky-400 text-slate-950 shadow-md">
                  {empresa.segmento}
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Agendamento Seguro
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">{empresa.nome}</h1>
              <p className="text-sm md:text-base text-slate-300 font-medium max-w-2xl">{empresa.descricao}</p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-extrabold text-slate-300">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-sky-300" /> {empresa.endereco} - {empresa.cidade}/{empresa.estado}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-emerald-400" /> {empresa.telefone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pre-Selected Employee Highlight Banner */}
        {preSelectedFunc && (
          <div className="p-6 rounded-3xl bg-slate-900 border-2 border-sky-400 shadow-xl flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-sky-400 flex-shrink-0 shadow-md">
              <img src={preSelectedFunc.foto} alt={preSelectedFunc.nome} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-400 text-slate-950 uppercase tracking-wider">
                Agenda Exclusiva de Profissional
              </span>
              <h3 className="text-xl font-black text-white">{preSelectedFunc.nome}</h3>
              <p className="text-sm font-bold text-sky-300">{preSelectedFunc.cargo}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-slate-300">
                <Clock className="w-4 h-4 text-sky-300" />
                <span>Atendimento: {preSelectedFunc.horarioInicio || '08:00'} às {preSelectedFunc.horarioFim || '18:00'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Screen */}
        {confirmedBooking ? (
          <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl border border-emerald-500/50 text-center space-y-6 animate-scaleUp">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 rounded-full mx-auto flex items-center justify-center font-black text-4xl shadow-md">
              ✓
            </div>

            <div>
              <h2 className="text-3xl font-black text-white">Agendamento Confirmado com Sucesso!</h2>
              <p className="text-base text-slate-300 font-semibold mt-1">
                Obrigado, <b className="text-white">{confirmedBooking.clienteNome}</b>! Seu horário foi registrado no sistema.
              </p>
            </div>

            <div className="max-w-md mx-auto p-6 rounded-3xl bg-slate-950 border border-slate-800 text-left space-y-3 shadow-inner">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-xs uppercase font-extrabold text-slate-400">Serviço:</span>
                <span className="font-black text-base text-sky-300">{confirmedBooking.servicoNome}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-xs uppercase font-extrabold text-slate-400">Profissional:</span>
                <span className="font-black text-base text-white">{confirmedBooking.funcionarioNome}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-xs uppercase font-extrabold text-slate-400">Data e Horário:</span>
                <span className="font-black text-base text-amber-300 font-mono">{confirmedBooking.data} às {confirmedBooking.horario}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-extrabold text-slate-400">Valor Total:</span>
                <span className="font-black text-2xl text-emerald-400">R$ {confirmedBooking.valor.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  const msg = `Olá! Sou *${confirmedBooking.clienteNome}* e fiz o agendamento de *${confirmedBooking.servicoNome}* para o dia *${confirmedBooking.data} às ${confirmedBooking.horario}* na ${empresa.nome}!`;
                  openWhatsappModal(empresa.whatsapp, empresa.nome, msg);
                }}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" /> Confirmar no WhatsApp da Empresa
              </button>

              <button
                onClick={() => setConfirmedBooking(null)}
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-sm rounded-2xl transition"
              >
                Fazer Novo Agendamento
              </button>
            </div>
          </div>
        ) : (
          /* Step-by-Step Booking Form */
          <form onSubmit={handleBook} className="space-y-8">
            {/* Step 1: Select Service */}
            <div className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Scissors className="w-6 h-6 text-sky-300" /> 1. Escolha o Serviço
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicos.map(s => {
                  const isSelected = selectedServico?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedServico(s)}
                      className={`p-5 rounded-3xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                        isSelected
                          ? 'border-sky-400 bg-sky-950/60 shadow-xl shadow-sky-500/10 scale-[1.01]'
                          : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                        <img src={s.foto} alt={s.nome} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-black text-base text-white">{s.nome}</h4>
                        <span className="text-xs text-slate-400 font-extrabold block">{s.duracaoMinutos} min • {s.categoria}</span>
                        <span className="text-xl font-black text-emerald-400 block mt-1">R$ {s.preco.toFixed(2)}</span>
                      </div>

                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black ${isSelected ? 'bg-sky-400 text-slate-950' : 'border border-slate-700'}`}>
                        {isSelected ? '✓' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Staff */}
            {!preSelectedFunc && (
              <div className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <User className="w-6 h-6 text-sky-300" /> 2. Escolha o Profissional
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {staff.map(f => {
                    const isSelected = selectedFunc?.id === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => setSelectedFunc(f)}
                        className={`p-4 rounded-3xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'border-sky-400 bg-sky-950/60 shadow-xl shadow-sky-500/10'
                            : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                          <img src={f.foto} alt={f.nome} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-sm text-white truncate">{f.nome}</h4>
                          <span className="text-xs font-bold text-sky-300 block truncate">{f.cargo}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Date & Hour Grid (Compact & Sleek Container) */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-sky-300" /> 3. Escolha a Data e o Horário
              </h3>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Compact Date Box */}
                <div className="w-full sm:w-auto flex-shrink-0">
                  <label className="block text-xs font-black uppercase tracking-wider text-sky-300 mb-1.5">Data do Atendimento *</label>
                  <div className="p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-2 bg-white text-slate-950 border border-sky-400 rounded-xl font-black text-xs text-black outline-none focus:ring-2 focus:ring-sky-400 shadow-xs cursor-pointer w-full sm:w-auto"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>

                {/* Available Hours */}
                <div className="flex-1 w-full">
                  <label className="block text-xs font-black uppercase tracking-wider text-sky-300 mb-1.5">Horários Disponíveis *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {availableHours.map(h => {
                      const isSelected = selectedHorario === h;
                      return (
                        <button
                          type="button"
                          key={h}
                          onClick={() => setSelectedHorario(h)}
                          className={`py-2.5 rounded-xl text-xs md:text-sm font-black transition ${
                            isSelected
                              ? 'bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 text-slate-950 shadow-md scale-[1.03]'
                              : 'bg-slate-950 border border-slate-800 text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          {h}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Customer Details Inputs */}
            <div className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <User className="w-6 h-6 text-sky-300" /> 4. Seus Dados de Contato
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-300 mb-1.5">Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Digite seu nome completo"
                    value={clienteNome}
                    onChange={(e) => setClienteNome(e.target.value)}
                    className="w-full p-4 bg-slate-950 border border-slate-700 rounded-2xl font-black text-base text-white outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-300 mb-1.5">Seu Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 99999-0000"
                    value={clienteTelefone}
                    onChange={(e) => setClienteTelefone(e.target.value)}
                    className="w-full p-4 bg-slate-950 border border-slate-700 rounded-2xl font-black text-base text-white outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-300 mb-1.5">Observações (Opcional)</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Prefiro atendimento silencioso / Preferência por tesoura"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full p-4 bg-slate-950 border border-slate-700 rounded-2xl font-semibold text-sm text-white outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>

            {/* Submit Call-to-Action Button */}
            <button
              type="submit"
              className="w-full py-5 px-8 bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-black text-xl rounded-3xl shadow-2xl shadow-sky-400/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-3 uppercase tracking-wider"
            >
              <CheckCircle2 className="w-7 h-7" /> Confirmar Meu Agendamento
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
