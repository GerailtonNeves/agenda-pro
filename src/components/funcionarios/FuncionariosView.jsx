import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Calendar as CalendarIcon, 
  Clock, 
  Phone, 
  Mail, 
  Award, 
  Sparkles, 
  Share2, 
  Check, 
  Copy, 
  Percent, 
  TrendingUp, 
  DollarSign, 
  ExternalLink,
  X,
  CalendarCheck,
  Camera
} from 'lucide-react';

export const FuncionariosView = () => {
  const { 
    funcionarios, 
    saveFuncionario, 
    deleteFuncionario, 
    activeEmpresa, 
    agendamentos,
    openWhatsappModal,
    openPublicBookingPage,
    openImageUploader
  } = useApp();

  const [activeTab, setActiveTab] = useState('cards');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal Form State
  const [showModal, setShowModal] = useState(false);
  const [editingFunc, setEditingFunc] = useState(null);
  
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [comissaoPct, setComissaoPct] = useState('');
  const [foto, setFoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [especialidades, setEspecialidades] = useState('');
  const [corAgenda, setCorAgenda] = useState('#0284c7');
  const [linkPublicoSlug, setLinkPublicoSlug] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horarioInicio, setHorarioInicio] = useState('08:00');
  const [horarioFim, setHorarioFim] = useState('18:00');
  const [diasAtendimento, setDiasAtendimento] = useState(['seg', 'ter', 'qua', 'qui', 'sex', 'sab']);

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(null);
  const [copiedLink, setCopiedLink] = useState('');

  const openNewModal = () => {
    setEditingFunc(null);
    setNome('');
    setCargo('');
    setComissaoPct('');
    setFoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400');
    setTelefone('');
    setEmail('');
    setEspecialidades('Corte, Modelagem');
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
    setCargo(func.cargo);
    setComissaoPct(func.comissaoPct !== undefined ? func.comissaoPct : '');
    setFoto(func.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400');
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
      alert('Informe o nome do profissional');
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

  // CUSTOMIZED LINK 2 FORMAT: https://gn-agenda-pro.vercel.app/agendar/[nome-do-funcionario]
  const getFullPublicLink2 = (slug) => {
    return `${window.location.origin}/agendar/${slug}`;
  };

  const handleSendLink2Whatsapp = (func) => {
    const funcSlug = func.linkPublicoSlug || func.nome.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const link2 = getFullPublicLink2(funcSlug);
    const msg = `📅 *AGENDA DIRETA DO PROFISSIONAL: ${func.nome}*\n` +
      `----------------------------------------\n` +
      `Olá! Para agendar o seu horário diretamente na agenda do profissional *${func.nome}* (${func.cargo}) na empresa *${activeEmpresa.nome}*, clique no link abaixo:\n\n` +
      `👉 *CLIQUE AQUI PARA AGENDAR:* ${link2}\n\n` +
      `Escolha o serviço, data e horário de sua preferência!`;

    openWhatsappModal(func.whatsapp || func.telefone, func.nome, msg);
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

  const filteredFuncionarios = funcionarios.filter(f => {
    const term = searchTerm.toLowerCase();
    const nomeF = (f.nome || '').toLowerCase();
    const cargoF = (f.cargo || '').toLowerCase();
    return nomeF.includes(term) || cargoF.includes(term);
  });

  return (
    <div className="space-y-6 animate-fadeIn text-slate-950">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-cyan-100 text-cyan-950 flex items-center gap-1.5 w-fit mb-2 border border-cyan-300">
            <CalendarCheck className="w-4 h-4 text-cyan-700" /> LINK 2 • AGENDAS DOS FUNCIONÁRIOS CADASTRADOS
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 flex items-center gap-2">
            Cadastro de Equipe & Agendas ({funcionarios.length})
          </h2>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Cadastre quantos funcionários precisar. Cada profissional tem o seu <b>LINK 2 exclusivo</b> para enviar aos clientes agendarem direto com ele!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition ${
                activeTab === 'cards' ? 'bg-white text-cyan-700 shadow-md' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              👥 Equipe ({funcionarios.length})
            </button>
            <button
              onClick={() => setActiveTab('relatorio')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition ${
                activeTab === 'relatorio' ? 'bg-white text-cyan-700 shadow-md' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              📊 Comissões
            </button>
          </div>

          <button
            onClick={openNewModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-black text-xs md:text-sm shadow-md transition flex items-center gap-2 uppercase tracking-wider"
          >
            <Plus className="w-5 h-5 text-white" /> Cadastrar Novo Profissional
          </button>
        </div>
      </div>

      {/* Staff Cards View */}
      {activeTab === 'cards' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar profissional por nome ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              Crie quantos links de funcionários desejar!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFuncionarios.map(func => {
              const stats = calculateStaffStats(func.id, func.comissaoPct);
              const funcSlug = func.linkPublicoSlug || func.nome.toLowerCase().replace(/[^a-z0-9]/g, '-');
              const link2Url = getFullPublicLink2(funcSlug);

              return (
                <div key={func.id} className="bg-white rounded-3xl border-2 border-slate-200 hover:border-cyan-400 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between">
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img src={func.foto} alt={func.nome} className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-md" />
                        <span 
                          className="w-4 h-4 rounded-full absolute -top-1 -right-1 border-2 border-white shadow-xs" 
                          style={{ backgroundColor: func.corAgenda || '#0284c7' }}
                          title="Cor da Agenda"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-lg text-slate-950 truncate">{func.nome}</h3>
                        <p className="text-xs font-extrabold text-cyan-700">{func.cargo}</p>
                        
                        {func.comissaoPct !== undefined && func.comissaoPct > 0 && (
                          <span className="mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300 inline-block">
                            Comissão: {func.comissaoPct}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* LINK 2 SPECIFIC BOX FOR THIS EMPLOYEE */}
                    <div className="p-3 bg-cyan-50/80 rounded-2xl border border-cyan-300 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-900 flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5 text-cyan-700" /> LINK 2 • AGENDA DO PROFISSIONAL:
                      </span>
                      <div className="font-mono text-[11px] font-black text-cyan-950 truncate bg-white p-1.5 rounded-lg border border-cyan-200">
                        {link2Url}
                      </div>
                    </div>

                    {/* Specialties & Hours */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(func.especialidades) && func.especialidades.map((esp, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                            {esp}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-600 font-semibold pt-1">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-cyan-600" /> {func.horarioInicio || '08:00'} - {func.horarioFim || '18:00'}</span>
                      </div>
                    </div>

                    {/* Monthly Performance Stats */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
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

                  {/* Footer Action Buttons */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setShowShareModal(func)}
                      className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-extrabold transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Ver / Copiar LINK 2
                    </button>

                    <button
                      onClick={() => handleSendLink2Whatsapp(func)}
                      className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition border border-emerald-400"
                      title="Enviar LINK 2 no WhatsApp"
                    >
                      <Phone className="w-4 h-4 text-slate-950" />
                    </button>

                    <button
                      onClick={() => openEditModal(func)}
                      className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition"
                      title="Editar Profissional"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja remover o profissional "${func.nome}"?`)) deleteFuncionario(func.id);
                      }}
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                      title="Excluir Profissional"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
              {/* UPLOAD FOTO DO PROFISSIONAL */}
              <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <img 
                  src={foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'} 
                  alt="Foto do Profissional" 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500 shadow-sm flex-shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <label className="block text-xs font-black uppercase text-slate-700">Foto do Profissional</label>
                  <button
                    type="button"
                    onClick={() => openImageUploader('Fazer Upload de Foto do Profissional', foto, (newUrl) => setFoto(newUrl))}
                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Camera className="w-4 h-4 text-white" /> Fazer Upload / Alterar Foto
                  </button>
                </div>
              </div>

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
                <label className="block font-extrabold text-slate-950 mb-1">Slug do Link da Agenda (Nome Curto do Profissional)</label>
                <div className="flex items-center gap-1 bg-slate-100 px-3 py-2 rounded-xl border border-slate-300">
                  <span className="text-xs text-slate-500 font-mono">/agendar/</span>
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
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-500 text-white font-extrabold shadow-md hover:from-sky-700 hover:to-emerald-600"
                >
                  Salvar Profissional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Professional Link Modal for LINK 2 */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-center space-y-4 border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto font-black">
              <Share2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-0.5 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black uppercase">
                LINK 2 • AGENDA DO PROFISSIONAL
              </span>
              <h3 className="font-extrabold text-xl text-slate-950">
                Link de Agendamento: {showShareModal.nome}
              </h3>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Envie este LINK 2 para os clientes agendarem horários especificamente na agenda do profissional {showShareModal.nome}:
            </p>

            <div className="p-3 bg-slate-100 rounded-xl border border-slate-300 font-mono text-xs text-cyan-800 break-all font-bold">
              {getFullPublicLink2(showShareModal.linkPublicoSlug || showShareModal.nome.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  const slug = showShareModal.linkPublicoSlug || showShareModal.nome.toLowerCase().replace(/[^a-z0-9]/g, '-');
                  navigator.clipboard.writeText(getFullPublicLink2(slug));
                  setCopiedLink('copiado');
                  setTimeout(() => setCopiedLink(''), 3000);
                }}
                className="py-3 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1"
              >
                {copiedLink === 'copiado' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedLink === 'copiado' ? 'Link Copiado!' : 'Copiar LINK 2'}
              </button>

              <button
                onClick={() => {
                  handleSendLink2Whatsapp(showShareModal);
                  setShowShareModal(null);
                }}
                className="py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1 uppercase"
              >
                <Phone className="w-4 h-4 text-slate-950" /> Enviar WhatsApp
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
