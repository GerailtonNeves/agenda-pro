import React, { useState, useEffect } from 'react';
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
  Star,
  MoveHorizontal
} from 'lucide-react';

export const PublicBookingView = () => {
  const { 
    empresas, 
    activeEmpresa,
    activeEmpresaId,
    todosFuncionarios, 
    todosServicos,
    addAgendamento, 
    publicBookingSlug, 
    publicEmployeeSlug, 
    setCurrentView,
    openWhatsappModal,
    userRole
  } = useApp();

  // STRICT COMPANY EVALUATION: Find company matching public slug, or current active company
  const empresa = (publicBookingSlug 
    ? empresas.find(e => e.slug === publicBookingSlug) || activeEmpresa 
    : activeEmpresa) || empresas[0];

  // STRICT REAL DATA FILTERING: Show ONLY professionals and services registered by the user for THIS company
  const staff = (todosFuncionarios || []).filter(f => f.empresaId === empresa.id);
  const displayServicos = (todosServicos || []).filter(s => s.empresaId === empresa.id);

  const preSelectedFunc = publicEmployeeSlug ? staff.find(f => f.linkPublicoSlug === publicEmployeeSlug) : null;

  const [selectedServico, setSelectedServico] = useState(null);
  const [selectedFunc, setSelectedFunc] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedHorario, setSelectedHorario] = useState('10:00');
  
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Auto-select first real service and professional registered for this company
  useEffect(() => {
    if (displayServicos && displayServicos.length > 0) {
      setSelectedServico(displayServicos[0]);
    } else {
      setSelectedServico(null);
    }
  }, [empresa.id, todosServicos]);

  useEffect(() => {
    if (preSelectedFunc) {
      setSelectedFunc(preSelectedFunc);
    } else if (staff && staff.length > 0) {
      setSelectedFunc(staff[0]);
    } else {
      setSelectedFunc(null);
    }
  }, [empresa.id, preSelectedFunc, todosFuncionarios]);

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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 text-slate-950 font-sans pb-16 selection:bg-sky-500 selection:text-white">
      {/* Top Header Navigation (Only Shows Admin Return Button if SuperAdmin) */}
      {userRole === 'superadmin' && (
        <div className="bg-white/90 backdrop-blur-md border-b border-sky-200 px-6 py-3 sticky top-0 z-40 flex items-center justify-between text-xs shadow-xs">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-xl transition flex items-center gap-2 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-white" /> Voltar ao Painel Admin
          </button>

          <span className="text-sky-950 font-mono font-bold hidden sm:inline">
            Página Pública de Agendamento • {empresa.nome}
          </span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
        {/* Main Company Header Banner - Beautiful Light Blue Theme */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-sky-600 via-sky-700 to-cyan-700 border-2 border-sky-400 text-white p-6 md:p-8 group">
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white flex-shrink-0">
              <img src={empresa.logo} alt={empresa.nome} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white text-sky-900 shadow-sm">
                  {empresa.segmento || 'Serviços'}
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-sky-900/40 text-sky-100 border border-sky-300/40 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" /> Agendamento Online Oficial
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">{empresa.nome}</h1>
              <p className="text-xs md:text-sm text-sky-100 font-medium max-w-2xl">{empresa.descricao || 'Agende seu horário online de forma rápida e segura.'}</p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-extrabold text-sky-100">
                {empresa.endereco && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-sky-200" /> {empresa.endereco} {empresa.cidade ? `- ${empresa.cidade}/${empresa.estado}` : ''}</span>}
                {(empresa.whatsapp || empresa.telefone) && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-emerald-300" /> {empresa.whatsapp || empresa.telefone}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* DEDICATED PROFESSIONAL BANNER (WHEN LINK DE PROFISSIONAL É ACESSADO) */}
        {preSelectedFunc && (
          <div className="p-6 rounded-3xl bg-white border-2 border-sky-400 text-slate-950 shadow-xl flex flex-col md:flex-row items-center gap-5 animate-scaleUp">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-sky-400 shadow-md flex-shrink-0">
              <img src={preSelectedFunc.foto} alt={preSelectedFunc.nome} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 text-center md:text-left space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase bg-amber-400 text-slate-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Agenda Direta do Profissional
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-950">{preSelectedFunc.nome}</h2>
              <p className="text-xs text-sky-800 font-bold">{preSelectedFunc.cargo} • {preSelectedFunc.descricao || 'Atendimento com excelência'}</p>
              
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-amber-600 pt-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 
                <span>{preSelectedFunc.notaMedia || 5.0} ({preSelectedFunc.avaliacoesCount || 48} avaliações)</span>
              </div>
            </div>
          </div>
        )}

        {/* BOOKING STEP-BY-STEP FORM (LIGHT BLUE THEMING) */}
        {!confirmedBooking ? (
          <form onSubmit={handleBook} className="bg-white rounded-3xl p-6 md:p-8 border-2 border-sky-200 shadow-xl space-y-8 text-slate-950">
            {/* Step 1: Select Service (STRICT REAL SERVICES ONLY) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <h3 className="text-xl font-black text-sky-950 flex items-center gap-2">
                  <Scissors className="w-6 h-6 text-sky-600" /> 1. Escolha o Serviço ({displayServicos.length})
                </h3>
                {displayServicos.length > 0 && (
                  <span className="text-[11px] font-extrabold text-sky-700 flex items-center gap-1 bg-sky-100 px-2.5 py-1 rounded-full border border-sky-200 sm:hidden">
                    <MoveHorizontal className="w-3.5 h-3.5 animate-pulse text-sky-600" /> Arraste para os lados ➔
                  </span>
                )}
              </div>

              {displayServicos.length > 0 ? (
                <div className="w-full overflow-x-auto touch-pan-x scrollbar-thin pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-full md:min-w-0">
                    {displayServicos.map(s => {
                      const isSelected = selectedServico?.id === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedServico(s)}
                          className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-4 ${
                            isSelected 
                              ? 'bg-sky-50 border-sky-500 shadow-md ring-2 ring-sky-400 scale-[1.01]' 
                              : 'bg-slate-50 border-slate-200 hover:border-sky-300'
                          }`}
                        >
                          <div className="space-y-1">
                            <h4 className="font-black text-base text-slate-950">{s.nome}</h4>
                            <p className="text-xs text-slate-600 font-medium line-clamp-1">{s.descricao || 'Atendimento de alta qualidade'}</p>
                            <span className="text-xs text-sky-700 font-bold block">⏱️ {s.duracaoMinutos || 30} Minutos</span>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="text-xl font-black text-emerald-600 block">R$ {Number(s.preco || 0).toFixed(2)}</span>
                            {isSelected && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-black text-sky-700 uppercase mt-1">
                                <CheckCircle2 className="w-4 h-4 text-sky-600" /> Selecionado
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-sky-50/50 border-2 border-dashed border-sky-200 text-center space-y-2">
                  <Scissors className="w-8 h-8 text-sky-400 mx-auto" />
                  <h4 className="text-base font-black text-sky-950">Nenhum Serviço Cadastrado</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                    Esta empresa ainda não cadastrou os seus serviços. Acesse o <b>Painel Admin ➔ Serviços</b> para adicionar seus valores!
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Select Professional */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <h3 className="text-xl font-black text-sky-950 flex items-center gap-2">
                  <User className="w-6 h-6 text-sky-600" /> 2. Escolha o Profissional ({staff.length})
                </h3>
                {staff.length > 0 && (
                  <span className="text-[11px] font-extrabold text-sky-700 flex items-center gap-1 bg-sky-100 px-2.5 py-1 rounded-full border border-sky-200 sm:hidden">
                    <MoveHorizontal className="w-3.5 h-3.5 animate-pulse text-sky-600" /> Arraste para os lados ➔
                  </span>
                )}
              </div>

              {staff.length > 0 ? (
                <div className="w-full overflow-x-auto touch-pan-x scrollbar-thin pb-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-w-full md:min-w-0">
                    {staff.map(f => {
                      const isSelected = selectedFunc?.id === f.id;
                      const isPre = preSelectedFunc?.id === f.id;

                      return (
                        <div
                          key={f.id}
                          onClick={() => setSelectedFunc(f)}
                          className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center gap-3.5 ${
                            isSelected 
                              ? 'bg-sky-50 border-sky-500 shadow-md ring-2 ring-sky-400 scale-[1.01]' 
                              : 'bg-slate-50 border-slate-200 hover:border-sky-300'
                          }`}
                        >
                          <img src={f.foto} alt={f.nome} className="w-14 h-14 rounded-2xl object-cover border border-slate-300" />
                          
                          <div className="space-y-0.5 min-w-0 flex-1">
                            {isPre && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-950 uppercase block w-fit">
                                Link do Profissional
                              </span>
                            )}
                            <h4 className="font-black text-sm text-slate-950 truncate">{f.nome}</h4>
                            <p className="text-xs text-sky-700 font-bold truncate">{f.cargo}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-sky-50/50 border-2 border-dashed border-sky-200 text-center space-y-2">
                  <User className="w-8 h-8 text-sky-400 mx-auto" />
                  <h4 className="text-base font-black text-sky-950">Nenhum Profissional Cadastrado</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                    Cadastre a sua equipe em <b>Painel Admin ➔ Equipe & Profissionais</b>.
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: Select Date & Time */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-sky-950 flex items-center gap-2 border-b border-sky-100 pb-3">
                <CalendarIcon className="w-6 h-6 text-sky-600" /> 3. Data & Horário
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Data do Atendimento</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 border-2 border-sky-200 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Horários Disponíveis</label>
                  <div className="w-full overflow-x-auto touch-pan-x scrollbar-thin pb-2">
                    <div className="grid grid-cols-5 gap-2 min-w-[320px]">
                      {availableHours.map(h => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setSelectedHorario(h)}
                          className={`py-2 rounded-xl text-xs font-black transition border ${
                            selectedHorario === h 
                              ? 'bg-sky-600 text-white border-sky-600 shadow-md scale-105' 
                              : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-sky-300'
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Client Identification */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-sky-950 flex items-center gap-2 border-b border-sky-100 pb-3">
                <Globe className="w-6 h-6 text-sky-600" /> 4. Seus Dados de Contato
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Digite seu nome"
                    value={clienteNome}
                    onChange={(e) => setClienteNome(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 border-2 border-sky-200 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Seu WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 99999-8888"
                    value={clienteTelefone}
                    onChange={(e) => setClienteTelefone(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 border-2 border-sky-200 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Observações Adicionais (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Prefiro atendimento silencioso, alergia..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border-2 border-sky-200 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={displayServicos.length === 0 || staff.length === 0}
              className="w-full py-4 px-6 bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base md:text-lg rounded-2xl shadow-xl transition transform hover:scale-[1.01] uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-6 h-6 text-white" /> Confirmar Agendamento Agora
            </button>
          </form>
        ) : (
          /* Confirmation Success Screen */
          <div className="bg-white rounded-3xl p-8 border-2 border-emerald-500 text-center space-y-6 animate-scaleUp shadow-2xl text-slate-950">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-black uppercase">
                Agendamento Confirmado!
              </span>
              <h2 className="text-3xl font-black text-slate-950">Obrigado, {confirmedBooking.clienteNome}!</h2>
              <p className="text-sm text-slate-600 font-medium max-w-md mx-auto">
                Seu agendamento foi registrado com sucesso na empresa <b className="text-sky-800">{empresa.nome}</b> com o profissional <b className="text-sky-800">{confirmedBooking.funcionarioNome}</b>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-2 text-xs font-bold text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Empresa:</span>
                <span className="text-slate-950 font-black">{empresa.nome}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Serviço:</span>
                <span className="text-slate-950 font-black">{confirmedBooking.servicoNome}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Profissional:</span>
                <span className="text-slate-950 font-black">{confirmedBooking.funcionarioNome}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Data & Horário:</span>
                <span className="text-emerald-700 font-black">{confirmedBooking.data} às {confirmedBooking.horario}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-black">
                <span>Valor Total:</span>
                <span className="text-sky-700">R$ {confirmedBooking.valor.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={() => setConfirmedBooking(null)}
                className="py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs transition shadow-md"
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
