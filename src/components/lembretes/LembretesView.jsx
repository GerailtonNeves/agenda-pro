import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  X, 
  Tag,
  Filter
} from 'lucide-react';

export const LembretesView = () => {
  const { lembretes, saveLembrete, toggleLembreteConcluido, deleteLembrete } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('todos'); // 'todos', 'hoje', 'futuros', 'vencidos', 'concluido'

  // Form State
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [horario, setHorario] = useState('09:00');
  const [categoria, setCategoria] = useState('Atendimento');
  const [prioridade, setPrioridade] = useState('normal');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredLembretes = lembretes.filter(l => {
    if (filterStatus === 'hoje') return l.data === todayStr && l.status !== 'concluido';
    if (filterStatus === 'futuros') return l.data > todayStr && l.status !== 'concluido';
    if (filterStatus === 'vencidos') return l.data < todayStr && l.status !== 'concluido';
    if (filterStatus === 'concluido') return l.status === 'concluido';
    return true;
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!titulo) return;

    saveLembrete({
      titulo,
      descricao,
      data,
      horario,
      categoria,
      prioridade,
      status: data === todayStr ? 'hoje' : data > todayStr ? 'futuro' : 'vencido'
    });

    setShowModal(false);
    setTitulo('');
    setDescricao('');
  };

  const handleDelete = (id, tit) => {
    if (window.confirm(`Tem certeza que deseja excluir o lembrete "${tit}"?`)) {
      deleteLembrete(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 flex items-center gap-2.5">
            <CheckSquare className="w-8 h-8 text-cyan-600" /> Central de Lembretes & Tarefas
          </h2>
          <p className="text-sm text-slate-600 font-extrabold mt-1">
            Lembretes para Hoje, Futuros, Vencidos e Concluídos com auto-remoção e avisos no painel
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white font-black text-sm shadow-md shadow-cyan-500/20 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Criar Novo Lembrete
        </button>
      </div>

      {/* Filter Tabs with Larger Fonts */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 font-black text-slate-950 text-sm">
          <Filter className="w-5 h-5 text-cyan-600" /> Filtrar Lembretes por Status:
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex-wrap">
          {[
            { key: 'todos', label: '📋 Todos' },
            { key: 'hoje', label: '📅 Hoje' },
            { key: 'futuros', label: '🚀 Futuros' },
            { key: 'vencidos', label: '🚨 Vencidos' },
            { key: 'concluido', label: '✅ Concluídos' }
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setFilterStatus(st.key)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                filterStatus === st.key ? 'bg-white text-cyan-900 shadow-md scale-[1.02]' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reminders Grid Cards with Enriched Typography */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLembretes.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl text-center border border-slate-100 text-slate-500 font-extrabold text-sm">
            Nenhum lembrete encontrado para a categoria selecionada.
          </div>
        ) : (
          filteredLembretes.map((lemb) => {
            const isDone = lemb.status === 'concluido';
            const isOverdue = !isDone && lemb.data < todayStr;
            const isToday = !isDone && lemb.data === todayStr;

            return (
              <div
                key={lemb.id}
                className={`bg-white rounded-3xl border p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                  isDone
                    ? 'border-slate-200 opacity-60 bg-slate-50'
                    : isOverdue
                    ? 'border-rose-300 bg-rose-50/30'
                    : isToday
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900 text-white">
                      {lemb.categoria || 'Geral'}
                    </span>

                    {isDone ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
                        ✓ Concluído
                      </span>
                    ) : isOverdue ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-xs animate-pulse">
                        🚨 Vencido!
                      </span>
                    ) : isToday ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950">
                        ⏰ Para Hoje!
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-100 text-cyan-950">
                        Futuro
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className={`font-black text-lg text-slate-950 leading-tight ${isDone ? 'line-through text-slate-500' : ''}`}>
                      {lemb.titulo}
                    </h3>
                    {lemb.descricao && (
                      <p className="text-sm font-semibold text-slate-700 mt-1 line-clamp-2">
                        {lemb.descricao}
                      </p>
                    )}
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-100/90 border border-slate-200 flex items-center justify-between text-xs font-mono font-black text-slate-900">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-cyan-600" /> {lemb.data}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-cyan-600" /> {lemb.horario}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleLembreteConcluido(lemb.id)}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 shadow-xs ${
                      isDone
                        ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isDone ? 'Reabrir Lembrete' : 'Concluir Lembrete'}
                  </button>

                  <button
                    onClick={() => handleDelete(lemb.id, lemb.titulo)}
                    className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                    title="Excluir Lembrete"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scaleUp">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-600 to-emerald-500 text-white flex justify-between items-center">
              <h3 className="font-black text-lg">Criar Novo Lembrete / Tarefa</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-sm font-semibold text-slate-950">
              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Título do Lembrete *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ligar para fornecedor de cosméticos"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-base outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Categoria</label>
                <input
                  type="text"
                  placeholder="Ex: Compras, Clientes, Manutenção"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Horário *</label>
                  <input
                    type="time"
                    required
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Descrição / Detalhes</label>
                <textarea
                  rows={3}
                  placeholder="Detalhes adicionais da tarefa..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-300 text-slate-950 font-semibold text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-white font-extrabold text-sm bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 shadow-md"
                >
                  Salvar Lembrete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
