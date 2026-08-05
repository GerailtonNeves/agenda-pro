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
  Trash2
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

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formClienteNome || !formFuncionarioId || !formServicoId) {
      alert('Preencha todos os campos obrigatórios!');
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
        valor: Number(formValor) || 50,
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
        valor: Number(formValor) || 50,
        observacoes: formObs
      });
    }

    setShowAddModal(false);
  };

  const handleDelete = (id, clientName) => {
    if (window.confirm(`Tem certeza que deseja excluir o agendamento de "${clientName}"?`)) {
      deleteAgendamento(id);
    }
  };

  const statusColors = {
    agendado: { bg: '#e0f2fe', text: '#0369a1', border: '#0284c7' },
    confirmado: { bg: '#fef9c3', text: '#a16207', border: '#eab308' },
    concluido: { bg: '#d1fae5', text: '#047857', border: '#10b981' },
    cancelado: { bg: '#fee2e2', text: '#b91c1c', border: '#ef4444' },
    faltou: { bg: '#f3f4f6', text: '#374151', border: '#6b7280' }
  };

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  const getWeekDays = (baseDateStr) => {
    const curr = new Date(baseDateStr + 'T12:00:00');
    const dayOfWeek = curr.getDay();
    const distanceToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
    
    const monday = new Date(curr);
    monday.setDate(curr.getDate() + distanceToMonday);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' });
      const dayFormatted = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      weekDays.push({ iso, dayName, dayFormatted });
    }
    return weekDays;
  };

  const getMonthDays = (baseDateStr) => {
    const [yearStr, monthStr] = baseDateStr.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const totalDays = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const monthDays = [];
    const paddingCount = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    for (let i = 0; i < paddingCount; i++) {
      monthDays.push({ isPadding: true, dayNum: '' });
    }

    for (let d = 1; d <= totalDays; d++) {
      const dStr = String(d).padStart(2, '0');
      const mStr = String(month + 1).padStart(2, '0');
      const iso = `${year}-${mStr}-${dStr}`;
      monthDays.push({ isPadding: false, dayNum: d, iso });
    }

    return monthDays;
  };

  const weekDaysList = getWeekDays(selectedDate);
  const monthDaysList = getMonthDays(selectedDate);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Controls Header */}
      <div className="bg-white text-slate-950 p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 flex items-center gap-2.5">
            <CalendarIcon className="w-8 h-8 text-sky-600" /> Agenda Interativa Multi-Profissional
          </h2>
          <p className="text-sm text-slate-600 font-bold mt-1">Controle completo com alteração de status e baixa automática</p>
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
          <h3 className="text-xl font-black text-slate-950 mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
            <span>Visão Semanal de Compromissos (7 Dias)</span>
            <span className="text-xs font-mono font-bold text-sky-700">Semana: {weekDaysList[0]?.dayFormatted} até {weekDaysList[6]?.dayFormatted}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-w-[900px]">
            {weekDaysList.map(wDay => {
              const dayAges = filteredAgendamentos.filter(a => a.data === wDay.iso);
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

                              <button
                                onClick={() => openReceiptModal(age)}
                                className="px-2 py-0.5 rounded bg-slate-950 text-white text-[10px] font-black hover:bg-slate-800 ml-auto"
                              >
                                Recibo
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 text-slate-950">
          <h3 className="text-xl font-black text-slate-950 pb-2 border-b border-slate-200 flex items-center justify-between">
            <span>Visão Mensal de Agendamentos</span>
            <span className="text-sm font-mono font-black text-sky-700 uppercase">
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
          </h3>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-black uppercase text-slate-500 pb-2 border-b border-slate-200">
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
            <div>Dom</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthDaysList.map((mDay, idx) => {
              if (mDay.isPadding) {
                return <div key={`pad-${idx}`} className="h-28 bg-slate-50/40 rounded-2xl border border-dashed border-slate-200" />;
              }

              const dayAges = filteredAgendamentos.filter(a => a.data === mDay.iso);
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
                      <div key={age.id} className="text-[10px] font-extrabold truncate px-1.5 py-0.5 rounded bg-slate-100 text-slate-950 border border-slate-200">
                        {age.horario} - {age.clienteNome}
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
                                <h4 className="font-black text-base text-slate-950">{age.clienteNome}</h4>
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

      {/* MODE 4: LIST VIEW */}
      {mode === 'lista' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-black uppercase text-xs">
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Serviço</th>
                <th className="py-3.5 px-4">Profissional</th>
                <th className="py-3.5 px-4">Data/Horário</th>
                <th className="py-3.5 px-4">Valor</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-950 font-bold">
              {filteredAgendamentos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 text-sm font-semibold">
                    Nenhum agendamento encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredAgendamentos.map(age => (
                  <tr key={age.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-4 font-black text-slate-950 text-base">
                      {age.clienteNome}
                      <span className="block text-xs text-slate-500 font-semibold">{age.clienteTelefone}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-800 font-bold text-sm">{age.servicoNome}</td>
                    <td className="py-4 px-4 text-slate-800 font-bold text-sm">{age.funcionarioNome}</td>
                    <td className="py-4 px-4 font-mono font-black text-slate-950 text-sm">{age.data} às {age.horario}</td>
                    <td className="py-4 px-4 font-black text-slate-950 text-base">R$ {age.valor.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <select
                        value={age.status}
                        onChange={(e) => updateAgendamentoStatus(age.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl text-xs font-black outline-none border border-slate-300"
                        style={{ backgroundColor: statusColors[age.status]?.bg, color: statusColors[age.status]?.text }}
                      >
                        <option value="agendado">Agendado</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="concluido">Concluído (Baixa)</option>
                        <option value="cancelado">Cancelado</option>
                        <option value="faltou">Faltou</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => updateAgendamentoStatus(age.id, 'concluido')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs"
                        title="Dar Baixa (Concluir)"
                      >
                        Baixa
                      </button>
                      <button
                        onClick={() => openEdit(age)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-black text-xs text-slate-900 border border-slate-300"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => openReceiptModal(age)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs"
                      >
                        Recibo
                      </button>
                      <button
                        onClick={() => handleDelete(age.id, age.clienteNome)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-100 text-rose-800 hover:bg-rose-200 font-black text-xs"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Appointment Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scaleUp text-slate-950">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-600 to-emerald-500 text-white flex justify-between items-center">
              <h3 className="font-black text-lg">
                {editingAge ? 'Editar Agendamento' : 'Novo Agendamento Manual'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 text-sm font-semibold text-slate-950">
              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gabriel Souza"
                  value={formClienteNome}
                  onChange={(e) => setFormClienteNome(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-base outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-950 mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  placeholder="(11) 98888-7777"
                  value={formClienteTelefone}
                  onChange={(e) => setFormClienteTelefone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-base outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Profissional *</label>
                  <select
                    required
                    value={formFuncionarioId}
                    onChange={(e) => setFormFuncionarioId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Selecione...</option>
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
                      const sId = e.target.value;
                      setFormServicoId(sId);
                      const sObj = servicos.find(s => s.id === sId);
                      if (sObj) setFormValor(sObj.preco);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Selecione...</option>
                    {servicos.map(s => (
                      <option key={s.id} value={s.id}>{s.nome} (R$ {s.preco.toFixed(2)})</option>
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
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Horário *</label>
                  <input
                    type="time"
                    required
                    value={formHorario}
                    onChange={(e) => setFormHorario(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formValor}
                    onChange={(e) => setFormValor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-black text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Observações Internas</label>
                <textarea
                  rows={2}
                  value={formObs}
                  onChange={(e) => setFormObs(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-300 font-semibold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-white font-extrabold text-sm bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 shadow-md"
                >
                  {editingAge ? 'Salvar Alterações' : 'Salvar Agendamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
