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
  MessageSquare,
  Star
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
    openWhatsappModal,
    userRole
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
      {/* Top Header Navigation (Only Shows Admin Return Button if SuperAdmin) */}
      {userRole === 'superadmin' && (
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
      )}

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
        {/* Main Company Header Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-slate-800 text-white p-6 md:p-8 group">
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden border-4 border-sky-300 shadow-2xl bg-slate-900 flex-shrink-0">
              <img src={empresa.logo} alt={empresa.nome} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-sky-400 text-slate-950 shadow-md">
                  {empresa.segmento}
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Agendamento Online Seguro
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">{empresa.nome}</h1>
              <p className="text-xs md:text-sm text-slate-300 font-medium max-w-2xl">{empresa.descricao}</p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-extrabold text-slate-300">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-sky-300" /> {empresa.endereco} - {empresa.cidade}/{empresa.estado}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-emerald-400" /> {empresa.telefone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DEDICATED PROFESSIONAL BANNER (WHEN LINK DE PROFISSIONAL É ACESSADO) */}
        {preSelectedFunc && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-900 via-cyan-900 to-slate-900 border-2 border-sky-400 text-white shadow-2xl flex flex-col md:flex-row items-center gap-5 animate-scaleUp">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-xl flex-shrink-0">
              <img src={preSelectedFunc.foto} alt={preSelectedFunc.nome} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 text-center md:text-left space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase bg-amber-400 text-slate-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Agenda Direta do Profissional
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">{preSelectedFunc.nome}</h2>
              <p className="text-xs text-sky-200 font-bold">{preSelectedFunc.cargo} • {preSelectedFunc.descricao || 'Atendimento com excelência'}</p>
              
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-amber-300 pt-1">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" /> 
                <span>{preSelectedFunc.notaMedia || 5.0} ({preSelectedFunc.avaliacoesCount || 48} avaliações)</span>
              </div>
            </div>
          </div>
        )}

        {/* BOOKING STEP-BY-STEP FORM */}
        {!confirmedBooking ? (
          <form onSubmit={handleBook} className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl space-y-8">
            {/* Step 1: Select Service */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Scissors className="w-6 h-6 text-sky-400" /> 1. Escolha o Serviço
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicos.map(s => {
                  const isSelected = selectedServico?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedServico(s)}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected 
                          ? 'bg-sky-500/20 border-sky-400 shadow-lg scale-[1.02]' 
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="font-black text-base text-white">{s.nome}</h4>
                        <p className="text-xs text-slate-400 font-medium line-clamp-1">{s.descricao}</p>
                        <span className="text-xs text-sky-300 font-bold block">⏱️ {s.duracaoMinutos} Minutos</span>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xl font-black text-emerald-400 block">R$ {s.preco.toFixed(2)}</span>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-sky-300 uppercase mt-1">
                            <CheckCircle2 className="w-4 h-4 text-sky-400" /> Selecionado
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Professional */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <User className="w-6 h-6 text-indigo-400" /> 2. Escolha o Profissional
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {staff.map(f => {
                  const isSelected = selectedFunc?.id === f.id;
                  const isPre = preSelectedFunc?.id === f.id;

                  return (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFunc(f)}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center gap-3.5 ${
                        isSelected 
                          ? 'bg-indigo-500/20 border-indigo-400 shadow-lg scale-[1.02]' 
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img src={f.foto} alt={f.nome} className="w-14 h-14 rounded-2xl object-cover border border-slate-700" />
                      
                      <div className="space-y-0.5 min-w-0 flex-1">
                        {isPre && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-950 uppercase block w-fit">
                            Link do Profissional
                          </span>
                        )}
                        <h4 className="font-black text-sm text-white truncate">{f.nome}</h4>
                        <p className="text-xs text-indigo-300 font-bold truncate">{f.cargo}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Select Date & Time */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <CalendarIcon className="w-6 h-6 text-amber-400" /> 3. Data & Horário
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">Data do Atendimento</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">Horários Disponíveis</label>
                  <div className="grid grid-cols-5 gap-2">
                    {availableHours.map(h => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setSelectedHorario(h)}
                        className={`py-2 rounded-xl text-xs font-black transition border ${
                          selectedHorario === h 
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-md scale-105' 
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Client Identification */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Globe className="w-6 h-6 text-emerald-400" /> 4. Seus Dados de Contato
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Digite seu nome"
                    value={clienteNome}
                    onChange={(e) => setClienteNome(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">Seu WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 99999-8888"
                    value={clienteTelefone}
                    onChange={(e) => setClienteTelefone(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">Observações Adicionais (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Prefiro atendimento silencioso, alergia..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-slate-950 font-black text-base md:text-lg rounded-2xl shadow-2xl transition transform hover:scale-[1.01] uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-6 h-6 text-slate-950" /> Confirmar Agendamento Agora
            </button>
          </form>
        ) : (
          /* Confirmation Success Screen */
          <div className="bg-slate-900 rounded-3xl p-8 border-2 border-emerald-500 text-center space-y-6 animate-scaleUp shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-emerald-500 text-slate-950 rounded-full text-xs font-black uppercase">
                Agendamento Confirmado!
              </span>
              <h2 className="text-3xl font-black text-white">Obrigado, {confirmedBooking.clienteNome}!</h2>
              <p className="text-sm text-slate-300 font-medium max-w-md mx-auto">
                Seu agendamento foi registrado com sucesso na agenda do profissional <b className="text-sky-300">{confirmedBooking.funcionarioNome}</b>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-left space-y-2 text-xs font-bold text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>Serviço:</span>
                <span className="text-white font-black">{confirmedBooking.servicoNome}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>Profissional:</span>
                <span className="text-white font-black">{confirmedBooking.funcionarioNome}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>Data & Horário:</span>
                <span className="text-emerald-400 font-black">{confirmedBooking.data} às {confirmedBooking.horario}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-black">
                <span>Valor Total:</span>
                <span className="text-sky-400">R$ {confirmedBooking.valor.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={() => setConfirmedBooking(null)}
                className="py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs transition"
              >
                Fazer Novo Agendamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
