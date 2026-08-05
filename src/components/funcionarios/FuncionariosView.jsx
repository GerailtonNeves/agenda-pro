import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  Plus, 
  Camera, 
  ExternalLink, 
  Copy, 
  Check, 
  Percent, 
  DollarSign, 
  Calendar, 
  Star, 
  Edit3, 
  Trash2, 
  X, 
  Clock,
  TrendingUp,
  Award,
  Share2,
  QrCode,
  MessageSquare
} from 'lucide-react';

export const FuncionariosView = () => {
  const { 
    funcionarios, 
    agendamentos, 
    saveFuncionario, 
    deleteFuncionario, 
    openImageUploader, 
    activeEmpresa, 
    openPublicBookingPage,
    openWhatsappModal 
  } = useApp();

  const [activeTab, setActiveTab] = useState('cards');
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(null);
  const [editingFunc, setEditingFunc] = useState(null);

  // Form State
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [comissaoPct, setComissaoPct] = useState('');
  const [foto, setFoto] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [especialidades, setEspecialidades] = useState('');
  const [corAgenda, setCorAgenda] = useState('#0284c7');
  const [linkPublicoSlug, setLinkPublicoSlug] = useState('');
  const [descricao, setDescricao] = useState('');
  
  // Work Schedule & Hours
  const [horarioInicio, setHorarioInicio] = useState('08:00');
  const [horarioFim, setHorarioFim] = useState('18:00');
  const [diasAtendimento, setDiasAtendimento] = useState(['seg', 'ter', 'qua', 'qui', 'sex', 'sab']);

  const weekDaysList = [
    { key: 'seg', label: 'Segunda' },
    { key: 'ter', label: 'Terça' },
    { key: 'qua', label: 'Quarta' },
    { key: 'qui', label: 'Quinta' },
    { key: 'sex', label: 'Sexta' },
    { key: 'sab', label: 'Sábado' },
    { key: 'dom', label: 'Domingo' }
  ];

  const toggleDay = (key) => {
    if (diasAtendimento.includes(key)) {
      setDiasAtendimento(diasAtendimento.filter(d => d !== key));
    } else {
      setDiasAtendimento([...diasAtendimento, key]);
    }
  };

  const openCreateModal = () => {
    setEditingFunc(null);
    setNome('');
    setCargo('Profissional');
    setComissaoPct('');
    setFoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400');
    setTelefone('');
    setEmail('');
    setEspecialidades('');
    setCorAgenda('#0284c7');
    setLinkPublicoSlug('');
    setDescricao('');
    setHorarioInicio('08:00');
    setHorarioFim('18:00');
    setDiasAtendimento(['seg', 'ter', 'qua', 'qui', 'sex', 'sab']);
    setShowModal(true);
  };

  const openEditModal = (func) => {
    setEditingFunc(func);
    setNome(func.nome);
    setCargo(func.cargo || 'Profissional');
    setComissaoPct(func.comissaoPct !== undefined ? func.comissaoPct : '');
    setFoto(func.foto);
    setTelefone(func.telefone || '');
    setEmail(func.email || '');
    setEspecialidades(Array.isArray(func.especialidades) ? func.especialidades.join(', ') : func.especialidades || '');
    setCorAgenda(func.corAgenda || '#0284c7');
    setLinkPublicoSlug(func.linkPublicoSlug || '');
    setDescricao(func.descricao || '');
    setHorarioInicio(func.horarioInicio || '08:00');
    setHorarioFim(func.horarioFim || '18:00');
    setDiasAtendimento(Array.isArray(func.diasAtendimento) ? func.diasAtendimento : ['seg', 'ter', 'qua', 'qui', 'sex', 'sab']);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!nome) {
      alert('Informe o nome do funcionário');
      return;
    }

    const especArray = especialidades ? especialidades.split(',').map(s => s.trim()) : ['Atendimento'];
    const generatedSlug = linkPublicoSlug || nome.toLowerCase().replace(/[^a-z0-9]/g, '-');

    saveFuncionario({
      id: editingFunc?.id,
      nome,
      cargo: cargo || 'Profissional',
      comissaoPct: comissaoPct === '' ? 0 : Number(comissaoPct),
      foto,
      telefone,
      email,
      especialidades: especArray,
      corAgenda,
      linkPublicoSlug: generatedSlug,
      descricao,
      horarioInicio,
      horarioFim,
      diasAtendimento
    });

    setShowModal(false);
  };

  const getFullPublicLink = (slug) => {
    return `${window.location.origin}/agendar/${activeEmpresa.slug}/profissional/${slug}`;
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const calculateStaffStats = (funcId, pct) => {
    const funcAgendamentos = agendamentos.filter(a => a.funcionarioId === funcId);
    const concluidos = funcAgendamentos.filter(a => a.status === 'concluido');

    const concluidosMes = concluidos.filter(a => {
      const d = new Date(a.data);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const ganhosMes = concluidosMes.reduce((acc, a) => {
      const comissao = a.comissaoValorCalculada || (a.valor * ((pct || 0) / 100));
      return acc + comissao;
    }, 0);

    const faturamentoBrutoMes = concluidosMes.reduce((acc, a) => acc + a.valor, 0);

    return {
      totalAtendimentos: concluidos.length,
      atendimentosMes: concluidosMes.length,
      ganhosMes,
      faturamentoBrutoMes
    };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-cyan-600" /> Cadastro de Equipe & Profissionais
          </h2>
          <p className="text-sm text-slate-600 font-medium">Cadastre barbeiros, cabeleireiros, esteticistas, porcentagens opcionais e links individuais</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition ${
                activeTab === 'cards' ? 'bg-white text-cyan-700 shadow-md' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              👥 Cards da Equipe
            </button>
            <button
              onClick={() => setActiveTab('relatorio')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition ${
                activeTab === 'relatorio' ? 'bg-white text-cyan-700 shadow-md' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              📊 Relatório de Comissões
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white font-extrabold text-sm shadow-md shadow-cyan-500/20 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Cadastrar Profissional
          </button>
        </div>
      </div>

      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funcionarios.map(func => {
            const stats = calculateStaffStats(func.id, func.comissaoPct);

            return (
              <div key={func.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
                <div className="p-6">
                  {/* Photo & Header info */}
                  <div className="flex items-start gap-4">
                    <div className="relative group/avatar">
                      <img src={func.foto} alt={func.nome} className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-md" />
                      <button
                        onClick={() => openImageUploader('Foto do Profissional', func.foto, (newUrl) => saveFuncionario({ ...func, foto: newUrl }))}
                        className="absolute inset-0 bg-slate-900/70 rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition flex items-center justify-center text-white"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-100 text-cyan-900 border border-cyan-300">
                          {func.cargo || 'Profissional'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{func.notaMedia || 5.0}</span>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-lg text-slate-950 mt-1 truncate">{func.nome}</h3>
                      <p className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <Percent className="w-3.5 h-3.5" /> Comissão: {func.comissaoPct ? `${func.comissaoPct}%` : 'Opcional (Não cadastrada)'}
                      </p>
                    </div>
                  </div>

                  {/* Specialties & Hours */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(func.especialidades) && func.especialidades.map((esp, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                          {esp}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 font-semibold pt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-cyan-600" /> {func.horarioInicio || '08:00'} - {func.horarioFim || '18:00'}</span>
                      <span>Link: <b className="font-mono text-cyan-700">/{func.linkPublicoSlug}</b></span>
                    </div>
                  </div>

                  {/* Monthly Performance Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                    <div>
                      <span className="text-[11px] font-black uppercase text-slate-500 block">Atendimentos Mês</span>
                      <span className="text-base font-black text-slate-950">{stats.atendimentosMes}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase text-emerald-700 block">Comissão Mês</span>
                      <span className="text-base font-black text-emerald-600">R$ {stats.ganhosMes.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setShowShareModal(func)}
                    className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-extrabold transition flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Link de Agendamento
                  </button>

                  <button
                    onClick={() => openEditModal(func)}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition"
                    title="Editar Profissional"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Deseja remover o profissional "${func.nome}"?`)) deleteFuncionario(func.id);
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                    title="Excluir Profissional"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Relatório de Comissões View */}
      {activeTab === 'relatorio' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="font-extrabold text-xl text-slate-950">Relatório Consolidado de Comissões</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase text-xs">
                  <th className="py-3 px-4">Profissional</th>
                  <th className="py-3 px-4">Porcentagem</th>
                  <th className="py-3 px-4">Faturamento Bruto (Mês)</th>
                  <th className="py-3 px-4">Comissão a Pagar (Mês)</th>
                  <th className="py-3 px-4">Total Atendimentos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-950 font-bold">
                {funcionarios.map(func => {
                  const stats = calculateStaffStats(func.id, func.comissaoPct);
                  return (
                    <tr key={func.id}>
                      <td className="py-4 px-4 font-black text-slate-950 flex items-center gap-2">
                        <img src={func.foto} className="w-8 h-8 rounded-full object-cover" />
                        {func.nome}
                      </td>
                      <td className="py-4 px-4">{func.comissaoPct ? `${func.comissaoPct}%` : 'Opcional'}</td>
                      <td className="py-4 px-4 font-mono font-extrabold text-slate-950">R$ {stats.faturamentoBrutoMes.toFixed(2)}</td>
                      <td className="py-4 px-4 font-mono font-black text-emerald-600 text-base">R$ {stats.ganhosMes.toFixed(2)}</td>
                      <td className="py-4 px-4">{stats.atendimentosMes} serviços</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form for Creating / Editing Staff */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scaleUp">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-600 to-emerald-500 text-white flex justify-between items-center">
              <h3 className="font-black text-lg">
                {editingFunc ? 'Editar Profissional' : 'Cadastrar Novo Profissional'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-sm font-semibold text-slate-950">
              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Nome Completo do Profissional *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 text-base font-bold outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Cargo / Função *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Barbeiro Master"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 text-base font-bold outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-black text-emerald-700 mb-1 flex items-center gap-1">
                    <Percent className="w-4 h-4 text-emerald-600" /> Comissão (%) (Opcional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Opcional (Ex: 50)"
                    value={comissaoPct}
                    onChange={(e) => setComissaoPct(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-400 text-slate-950 font-black text-base outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Link Público Personalizado (Slug)</label>
                <div className="flex items-center gap-1 bg-slate-100 px-3 py-2 rounded-xl border border-slate-300">
                  <span className="text-xs text-slate-500 font-mono">/agendar/.../profissional/</span>
                  <input
                    type="text"
                    placeholder="carlos-silva"
                    value={linkPublicoSlug}
                    onChange={(e) => setLinkPublicoSlug(e.target.value)}
                    className="w-full bg-transparent text-sm font-mono font-black text-cyan-700 outline-none"
                  />
                </div>
              </div>

              {/* Work Schedule Hours & Days Box */}
              <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-300 space-y-3">
                <label className="block font-black text-cyan-950 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-700" /> Jornada de Trabalho & Horários da Agenda
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-950 mb-1 text-xs">Horário de Início</label>
                    <input
                      type="time"
                      value={horarioInicio}
                      onChange={(e) => setHorarioInicio(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-cyan-300 font-black text-slate-950 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-950 mb-1 text-xs">Horário de Fim</label>
                    <input
                      type="time"
                      value={horarioFim}
                      onChange={(e) => setHorarioFim(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-cyan-300 font-black text-slate-950 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-950 mb-1 text-xs">Dias da Semana Atendidos:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {weekDaysList.map(w => {
                      const isSelected = diasAtendimento.includes(w.key);
                      return (
                        <button
                          type="button"
                          key={w.key}
                          onClick={() => toggleDay(w.key)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition ${
                            isSelected ? 'bg-cyan-700 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                          }`}
                        >
                          {w.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 text-sm font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="carlos@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 text-sm font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Especialidades (Separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="Corte Degradê, Barba, Pigmentação"
                  value={especialidades}
                  onChange={(e) => setEspecialidades(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 text-sm font-bold outline-none"
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
                  {editingFunc ? 'Salvar Alterações' : 'Cadastrar Profissional'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Professional Link Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-center space-y-4 border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto font-black">
              <Share2 className="w-8 h-8" />
            </div>

            <h3 className="font-extrabold text-xl text-slate-950">
              Link de Agendamento Exclusivo: {showShareModal.nome}
            </h3>

            <p className="text-xs text-slate-600 font-medium">
              Envie este link direto para os clientes agendarem horários especificamente com {showShareModal.nome}:
            </p>

            <div className="p-3 bg-slate-100 rounded-xl border border-slate-300 font-mono text-xs text-cyan-800 break-all font-bold">
              {getFullPublicLink(showShareModal.linkPublicoSlug || showShareModal.nome.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getFullPublicLink(showShareModal.linkPublicoSlug || showShareModal.nome.toLowerCase().replace(/[^a-z0-9]/g, '-')));
                  alert('Link copiado!');
                }}
                className="py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-md"
              >
                Copiar Link
              </button>

              <button
                onClick={() => {
                  openPublicBookingPage(activeEmpresa.slug, showShareModal.linkPublicoSlug || showShareModal.nome.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  setShowShareModal(null);
                }}
                className="py-2.5 rounded-xl bg-cyan-600 text-white font-extrabold text-xs shadow-md"
              >
                Testar Link
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(null)}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
