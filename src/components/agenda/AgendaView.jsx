import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Check, 
  X, 
  CheckCircle2, 
  UserCheck, 
  DollarSign, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Printer,
  Share2,
  CalendarDays,
  Edit3,
  Trash2,
  Globe,
  Sparkles
} from 'lucide-react';

export const AgendaView = () => {
  const { 
    agendamentos, 
    funcionarios, 
    servicos, 
    clientes, 
    addAgendamento, 
    saveAgendamento,
    updateAgendamentoStatus, 
    deleteAgendamento, 
    openReceiptModal, 
    openWhatsappModal 
  } = useApp();

  const [mode, setMode] = useState('diaria'); // 'diaria', 'semanal', 'mensal', 'lista', 'timeline'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStaff, setFilterStaff] = useState('todos');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAge, setEditingAge] = useState(null);

  // Form State
  const [formClienteNome, setFormClienteNome] = useState('');
  const [formClienteTelefone, setFormClienteTelefone] = useState('');
  const [formFuncionarioId, setFormFuncionarioId] = useState('');
  const [formServicoId, setFormServicoId] = useState('');
  const [formData, setFormData] = useState(selectedDate);
  const [formHorario, setFormHorario] = useState('10:00');
  const [formValor, setFormValor] = useState(50);
  const [formObs, setFormObs] = useState('');

  const filteredAgendamentos = agendamentos.filter(age => {
    const matchDate = (mode === 'diaria' || mode === 'timeline') ? age.data === selectedDate : true;
    const matchStaff = filterStaff === 'todos' ? true : age.funcionarioId === filterStaff;
    return matchDate && matchStaff;
  });

  const openCreate = () => {
    setEditingAge(null);
    setFormClienteNome('');
    setFormClienteTelefone('');
    setFormFuncionarioId(funcionarios[0]?.id || '');
    setFormServicoId(servicos[0]?.id || '');
    setFormData(selectedDate);
    setFormHorario('10:00');
    setFormValor(servicos[0]?.preco || 50);
    setFormObs('');
    setShowAddModal(true);
  };

  const openEdit = (age) => {
    setEditingAge(age);
    setFormClienteNome(age.clienteNome || '');
    setFormClienteTelefone(age.clienteTelefone || age.clienteWhatsapp || '');
    setFormFuncionarioId(age.funcionarioId || funcionarios[0]?.id || '');
    setFormServicoId(age.servicoId || servicos[0]?.id || '');
    setFormData(age.data || selectedDate);
    setFormHorario(age.horario || '10:00');
    setFormValor(age.valor || 50);
    setFormObs(age.observacoes || '');
    setShowAddModal(true);
  };

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    if (!formClienteNome || !formFuncionarioId || !formServicoId) {
      alert('Preencha os campos obrigatórios (*)');
      return;
    }

    if (editingAge) {
      saveAgendamento({
        id: editingAge.id,
        clienteNome: formClienteNome,
        clienteTelefone: formClienteTelefone,
        funcionarioId: formFuncionarioId,
        servicoId: formServicoId,
        data: formData,
        horario: formHorario,
        valor: Number(formValor),
        observacoes: formObs
      });
    } else {
      addAgendamento({
        clienteNome: formClienteNome,
        clienteTelefone: formClienteTelefone,
        funcionarioId: formFuncionarioId,
        servicoId: formServicoId,
        data: formData,
        horario: formHorario,
        valor: Number(formValor),
        observacoes: formObs,
        origem: 'PAINEL_ADMIN'
      });
    }

    setShowAddModal(false);
  };

  const handleDelete = (id, nome) => {
    if (window.confirm(`Tem certeza que deseja cancelar e remover o agendamento de "${nome}"?`)) {
      deleteAgendamento(id);
    }
  };

  const statusColors = {
    agendado: { bg: '#e0f2fe', text: '#0369a1', border: '#0284c7', label: 'Agendado' },
    confirmado: { bg: '#fef9c3', text: '#854d0e', border: '#eab308', label: 'Confirmado' },
    concluido: { bg: '#dcfce7', text: '#166534', border: '#10b981', label: 'Concluído' },
    cancelado: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444', label: 'Cancelado' },
    faltou: { bg: '#f3f4f6', text: '#374151', border: '#6b7280', label: 'Faltou' }
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00'
  ];

  // Helper for Weekly Calendar
  const getWeekDates = (baseDateStr) => {
    const current = new Date(baseDateStr + 'T00:00:00');
    const dayOfWeek = current.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(current);
    monday.setDate(current.getDate() - distanceToMonday);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      days.push({
        iso,
        dayNum: d.getDate(),
        dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
        dayFormatted: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      });
    }
    return days;
  };

  const weekDaysList = getWeekDates(selectedDate);

  // Helper for Monthly Calendar
  const getMonthDaysList = (baseDateStr) => {
    const current = new Date(baseDateStr + 'T00:00:00');
    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const paddingDays = (firstDayOfMonth.getDay() + 6) % 7;
    const totalDays = lastDayOfMonth.getDate();

    const list = [];
    for (let i = 0; i < paddingDays; i++) {
      list.push({ isPadding: true });
    }

    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      const iso = d.toISOString().split('T')[0];
      list.push({
        isPadding: false,
        iso,
        dayNum: i,
        dateObj: d
      });
    }

    return list;
  };

  const monthDaysList = getMonthDaysList(selectedDate);

  return (
    <div className="space-y-6 animate-fadeIn text-slate-950">
      {/* Header Bar */}
      <div className="bg-white text-slate-950 p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 flex items-center gap-2.5">
            <CalendarIcon className="w-8 h-8 text-sky-600" /> Agenda Interativa Multi-Profissional
          </h2>
          <p className="text-sm text-slate-600 font-bold mt-1">Controle completo dos agendamentos presenciais e dos realizados pelo Link Público</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex-wrap">
            {[
              { id: 'diaria', label: '📅 Diária' },
              { id: 'semanal', label: '🗓️ Semanal' },
              { id: 'mensal', label: '📆 Mensal' },
              { id: 'lista', label: '📋 Lista' },
              { id: 'timeline', label: '⏰ Horários' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black capitalize transition ${
                  mode === m.id ? 'bg-white text-sky-800 shadow-md scale-[1.02]' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            onClick={openCreate}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white font-black text-sm shadow-md shadow-sky-500/20 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Novo Agendamento
          </button>
        </div>
      </div>

      {/* Clean Light Date & Filter Toolbar */}
      <div className="bg-white text-slate-950 p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-950 border-2 border-sky-400 font-mono font-black text-sm outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
          />
          <span className="text-sm text-slate-700 font-extrabold hidden sm:inline">
            {mode === 'semanal' ? 'Semana de referência' : mode === 'mensal' ? 'Mês de referência' : 'Exibindo agendamentos para esta data'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-sky-600" />
          <span className="text-sm font-black text-slate-950">Profissional:</span>
          <select
            value={filterStaff}
            onChange={(e) => setFilterStaff(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-950 border border-slate-300 text-sm font-black outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="todos" className="bg-white text-slate-950 font-bold">Todos os Funcionários</option>
            {funcionarios.map(f => (
              <option key={f.id} value={f.id} className="bg-white text-slate-950 font-bold">{f.nome} ({f.cargo})</option>
            ))}
          </select>
        </div>
      </div>

      {/* MODE 1: WEEKLY CALENDAR VIEW (SEMANAL) */}
      {mode === 'semanal' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[900px]">
            {weekDaysList.map(wDay => {
              const dayAges = agendamentos.filter(a => {
                const matchDate = a.data === wDay.iso;
                const matchStaff = filterStaff === 'todos' ? true : a.funcionarioId === filterStaff;
                return matchDate && matchStaff;
              });

              const isToday = wDay.iso === new Date().toISOString().split('T')[0];

              return (
                <div 
                  key={wDay.iso} 
                  className={`rounded-2xl border p-4 space-y-3 flex flex-col ${
                    isToday ? 'bg-sky-50/70 border-sky-300 shadow-sm' : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="text-center pb-2 border-b border-slate-200">
                    <span className="text-xs font-black uppercase text-slate-500 block">{wDay.dayName}</span>
                    <span className={`text-base font-black ${isToday ? 'text-sky-700' : 'text-slate-950'}`}>{wDay.dayFormatted}</span>
                    <span className="text-[11px] font-mono font-bold text-slate-500 block mt-0.5">{dayAges.length} agendamento(s)</span>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px] pr-1">
                    {dayAges.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400 font-semibold italic">
                        Sem horários
                      </div>
                    ) : (
                      dayAges.map(age => {
                        const style = statusColors[age.status] || statusColors.agendado;

                        return (
                          <div
                            key={age.id}
                            style={{ backgroundColor: style.bg, borderColor: style.border }}
                            className="p-3 rounded-xl border-l-4 text-left shadow-xs hover:shadow-md transition space-y-1.5"
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-mono font-black text-xs text-slate-950">{age.horario}</span>
                              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-white text-slate-950 border border-slate-200">
                                R$ {age.valor.toFixed(2)}
                              </span>
                            </div>

                            <h5 className="font-black text-xs text-slate-950 truncate">{age.clienteNome}</h5>
                            <p className="text-[11px] font-extrabold text-slate-800 truncate">{age.servicoNome}</p>
                            <p className="text-[10px] font-semibold text-slate-600 truncate">✂️ {age.funcionarioNome}</p>

                            {/* Public Link Origin Badge */}
                            {age.origem === 'LINK_PUBLICO' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-cyan-100 text-cyan-950 border border-cyan-300 flex items-center gap-1 w-fit">
                                <Globe className="w-3 h-3 text-cyan-700" /> Link Público
                              </span>
                            )}

                            <div className="pt-1.5 flex flex-wrap gap-1 items-center justify-between border-t border-black/10">
                              <button
                                onClick={() => updateAgendamentoStatus(age.id, 'concluido')}
                                className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black shadow-xs hover:bg-emerald-700"
                                title="Dar Baixa Instantânea"
                              >
                                Baixa
                              </button>

                              <button
                                onClick={() => openEdit(age)}
                                className="p-1 rounded bg-white text-slate-900 text-[10px] border border-slate-300 hover:bg-slate-100"
                                title="Editar"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>

                              <button
                                onClick={() => handleDelete(age.id, age.clienteNome)}
                                className="p-1 rounded bg-rose-100 text-rose-800 text-[10px] hover:bg-rose-200"
                                title="Excluir"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: MONTHLY CALENDAR VIEW (MENSAL) */}
      {mode === 'mensal' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 min-w-[700px] mb-2 font-black text-xs text-slate-500 uppercase text-center">
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
            <div>Dom</div>
          </div>

          <div className="grid grid-cols-7 gap-2 min-w-[700px]">
            {monthDaysList.map((mDay, idx) => {
              if (mDay.isPadding) {
                return <div key={`pad-${idx}`} className="h-28 bg-slate-50/40 rounded-2xl border border-dashed border-slate-200" />;
              }

              const dayAges = agendamentos.filter(a => {
                const matchDate = a.data === mDay.iso;
                const matchStaff = filterStaff === 'todos' ? true : a.funcionarioId === filterStaff;
                return matchDate && matchStaff;
              });

              const isSelected = mDay.iso === selectedDate;
              const faturamentoDia = dayAges.reduce((acc, c) => acc + (c.valor || 0), 0);

              return (
                <div
                  key={mDay.iso}
                  onClick={() => setSelectedDate(mDay.iso)}
                  className={`h-28 p-2.5 rounded-2xl border transition flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? 'border-sky-400 bg-sky-50/80 shadow-md ring-2 ring-sky-300'
                      : dayAges.length > 0
                      ? 'border-slate-300 bg-white hover:border-sky-300 hover:shadow-sm'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-black ${isSelected ? 'text-sky-700' : 'text-slate-950'}`}>
                      {mDay.dayNum}
                    </span>

                    {dayAges.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-xs">
                        {dayAges.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayAges.slice(0, 2).map(age => (
                      <div key={age.id} className="text-[10px] font-extrabold truncate px-1.5 py-0.5 rounded bg-slate-100 text-slate-950 border border-slate-200 flex items-center justify-between">
                        <span className="truncate">{age.horario} - {age.clienteNome}</span>
                        {age.origem === 'LINK_PUBLICO' && <span title="Via Link Público">🌐</span>}
                      </div>
                    ))}

                    {dayAges.length > 2 && (
                      <span className="text-[10px] font-black text-sky-700 block text-right">
                        +{dayAges.length - 2} mais...
                      </span>
                    )}
                  </div>

                  {faturamentoDia > 0 && (
                    <span className="text-[10px] font-mono font-black text-emerald-600 block text-right">
                      R$ {faturamentoDia.toFixed(2)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 3: TIMELINE & DAILY VIEW */}
      {(mode === 'timeline' || mode === 'diaria') && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
          <div className="min-w-[750px] space-y-4">
            {timeSlots.map(time => {
              const agesAtTime = filteredAgendamentos.filter(a => a.horario.startsWith(time.substring(0, 2)));

              return (
                <div key={time} className="flex items-start gap-5 pb-5 border-b border-slate-100 last:border-0">
                  <div className="w-20 pt-2 font-mono text-base font-black text-slate-950">
                    {time}
                  </div>

                  <div className="flex-1 min-h-[60px] bg-slate-50/70 rounded-2xl border border-dashed border-slate-300 p-3 flex flex-wrap gap-4">
                    {agesAtTime.length === 0 ? (
                      <span className="text-xs text-slate-400 italic self-center pl-2 font-semibold">Horário livre</span>
                    ) : (
                      agesAtTime.map(age => {
                        const style = statusColors[age.status] || statusColors.agendado;

                        return (
                          <div
                            key={age.id}
                            style={{ backgroundColor: style.bg, borderColor: style.border }}
                            className="p-4 rounded-2xl border-l-4 shadow-md hover:shadow-lg transition max-w-md w-full space-y-2.5"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-black text-base text-slate-950">{age.clienteNome}</h4>
                                  {age.origem === 'LINK_PUBLICO' && (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-cyan-100 text-cyan-950 border border-cyan-300 flex items-center gap-1">
                                      <Globe className="w-3 h-3 text-cyan-700" /> Link Público
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm font-extrabold text-slate-800">{age.servicoNome}</p>
                              </div>
                              <span className="text-sm font-mono font-black px-3 py-1 rounded-full bg-white text-slate-950 shadow-xs border border-slate-200">
                                R$ {age.valor.toFixed(2)}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-xs font-bold text-slate-700 pt-1 border-t border-black/10">
                              <span>Profissional: <b className="text-slate-950">{age.funcionarioNome}</b></span>
                              <span className="font-mono">{age.duracaoMinutos} min</span>
                            </div>

                            {/* Status & Actions Buttons Row */}
                            <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                              <button
                                onClick={() => updateAgendamentoStatus(age.id, 'concluido')}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs"
                                title="Dar Baixa Instantânea (Concluir Atendimento)"
                              >
                                ✅ Dar Baixa
                              </button>

                              {['agendado', 'confirmado', 'cancelado', 'faltou'].map(s => (
                                <button
                                  key={s}
                                  onClick={() => updateAgendamentoStatus(age.id, s)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-black capitalize transition ${
                                    age.status === s ? 'bg-slate-950 text-white shadow-xs' : 'bg-white/90 text-slate-800 hover:bg-white border border-slate-200'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}

                              <div className="flex items-center gap-1 ml-auto">
                                <button
                                  onClick={() => openEdit(age)}
                                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-900"
                                  title="Editar Agendamento"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDelete(age.id, age.clienteNome)}
                                  className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300"
                                  title="Excluir Agendamento"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => openReceiptModal(age)}
                                  className="px-3 py-1 rounded-lg bg-slate-950 text-white text-xs font-black shadow-xs hover:bg-slate-800"
                                  title="Emitir Recibo"
                                >
                                  Recibo
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 4: LIST VIEW (LISTA COMPLETA) */}
      {mode === 'lista' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-black uppercase text-xs">
                <th className="py-3 px-4">Origem</th>
                <th className="py-3 px-4">Data & Horário</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Serviço</th>
                <th className="py-3 px-4">Profissional</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-950 font-bold">
              {filteredAgendamentos.map(age => {
                const style = statusColors[age.status] || statusColors.agendado;
                return (
                  <tr key={age.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-4 whitespace-nowrap">
                      {age.origem === 'LINK_PUBLICO' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-100 text-cyan-950 border border-cyan-300 flex items-center gap-1 w-fit">
                          <Globe className="w-3 h-3 text-cyan-700" /> Link Público
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">
                          Interno
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono whitespace-nowrap">
                      <span className="font-black text-slate-950">{age.data}</span> às <span className="text-sky-700 font-black">{age.horario}</span>
                    </td>
                    <td className="py-4 px-4 font-black text-slate-950">{age.clienteNome}</td>
                    <td className="py-4 px-4 text-slate-800">{age.servicoNome}</td>
                    <td className="py-4 px-4 text-slate-800">{age.funcionarioNome}</td>
                    <td className="py-4 px-4 font-mono font-black text-emerald-600">R$ {age.valor.toFixed(2)}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-black" style={{ backgroundColor: style.bg, color: style.text }}>
                        {style.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updateAgendamentoStatus(age.id, 'concluido')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-xs"
                          title="Dar Baixa"
                        >
                          Baixa
                        </button>
                        <button
                          onClick={() => openEdit(age)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(age.id, age.clienteNome)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL FORM FOR CREATING & EDITING APPOINTMENTS */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scaleUp">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-600 to-emerald-500 text-white flex justify-between items-center">
              <h3 className="font-black text-lg">
                {editingAge ? 'Editar Agendamento' : 'Novo Agendamento Presencial'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="p-6 space-y-4 text-sm font-semibold text-slate-950">
              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Nome Completo do Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={formClienteNome}
                  onChange={(e) => setFormClienteNome(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Telefone / WhatsApp do Cliente</label>
                <input
                  type="text"
                  placeholder="(11) 99999-8888"
                  value={formClienteTelefone}
                  onChange={(e) => setFormClienteTelefone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Profissional *</label>
                  <select
                    required
                    value={formFuncionarioId}
                    onChange={(e) => setFormFuncionarioId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {funcionarios.map(f => (
                      <option key={f.id} value={f.id}>{f.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Serviço *</label>
                  <select
                    required
                    value={formServicoId}
                    onChange={(e) => {
                      setFormServicoId(e.target.value);
                      const sObj = servicos.find(s => s.id === e.target.value);
                      if (sObj) setFormValor(sObj.preco);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {servicos.map(s => (
                      <option key={s.id} value={s.id}>{s.nome} (R$ {s.preco})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={formData}
                    onChange={(e) => setFormData(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono font-bold outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Horário *</label>
                  <input
                    type="time"
                    required
                    value={formHorario}
                    onChange={(e) => setFormHorario(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono font-bold outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-emerald-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formValor}
                    onChange={(e) => setFormValor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-emerald-400 font-mono font-black text-emerald-800 bg-emerald-50 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Observações (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Cliente novo, prefere navalha..."
                  value={formObs}
                  onChange={(e) => setFormObs(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-500 text-white font-extrabold shadow-md hover:from-sky-700 hover:to-emerald-600"
                >
                  Salvar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
