import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Crown, 
  Building2, 
  Key, 
  Smartphone, 
  Laptop, 
  ShieldCheck, 
  RotateCcw, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Ban, 
  Sparkles,
  Calendar,
  Lock,
  Share2,
  Clock,
  Phone,
  UserCheck,
  ShieldAlert,
  User,
  Trash2,
  ExternalLink,
  MoveRight,
  Edit3,
  Search,
  Check,
  X,
  Unlock,
  Shield
} from 'lucide-react';
import { getLabelDuracao } from '../../services/licenseService';

export const SuperAdminView = () => {
  const { 
    empresas, 
    licencas, 
    hardwareId, 
    togglePermissaoRevendedor,
    gerarLicencaPersonalizada,
    extenderLicencaDias,
    deleteEmpresa,
    desvincularDispositivoLicenca, 
    revogarLicenca,
    openWhatsappModal,
    resetAllDataToDefault,
    restaurarLicencaMasterEmergencia,
    saveEmpresa
  } = useApp();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  // Edit Buyer Company Modal
  const [editingEmpresa, setEditingEmpresa] = useState(null);

  // 2-Click Unblock Tracker State: stores license ID waiting for 2nd click
  const [unblockPendingId, setUnblockPendingId] = useState(null);

  // Unified Form State for Registering Buyer Company & Issuing License
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [duracaoLicenca, setDuracaoLicenca] = useState('1_MES');
  const [isReseller, setIsReseller] = useState(false);

  const [copiedCode, setCopiedCode] = useState('');
  const [lastGeneratedKey, setLastGeneratedKey] = useState(null);

  // Single Action: Register Buyer Company & Generate License
  const handleCadastrarEmpresaEGerarLicenca = (e) => {
    e.preventDefault();
    if (!nomeEmpresa) return;

    const newEmpId = `emp-${Date.now()}`;
    const newEmpObj = {
      id: newEmpId,
      nome: nomeEmpresa.trim(),
      nomeProprietario: nomeResponsavel.trim() || 'Proprietário',
      responsavel: nomeResponsavel.trim() || 'Proprietário',
      whatsapp: whatsapp.trim() || '',
      telefone: whatsapp.trim() || '',
      slug: nomeEmpresa.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      isReseller: isReseller,
      status: 'ativo',
      segmento: 'Comercial'
    };

    saveEmpresa(newEmpObj);

    const lic = gerarLicencaPersonalizada(newEmpId, duracaoLicenca, whatsapp);
    setLastGeneratedKey(lic);

    setNomeEmpresa('');
    setNomeResponsavel('');
    setWhatsapp('');
    setIsReseller(false);
  };

  const handleSaveEditEmpresa = (e) => {
    e.preventDefault();
    if (!editingEmpresa) return;
    saveEmpresa(editingEmpresa);
    setEditingEmpresa(null);
  };

  // 1-Click Block / 2-Click Unblock Logic
  const handleBlockUnblockToggle = (licId, isRevoked) => {
    if (!isRevoked) {
      // 1-CLICK BLOCK: Instantly block license
      revogarLicenca(licId);
      setUnblockPendingId(null);
    } else {
      // 2-CLICK UNBLOCK: Requires second click confirmation
      if (unblockPendingId === licId) {
        // Second Click -> Unblock license
        revogarLicenca(licId);
        setUnblockPendingId(null);
      } else {
        // First Click -> Prompt for 2nd click confirmation
        setUnblockPendingId(licId);
        setTimeout(() => {
          setUnblockPendingId(prev => prev === licId ? null : prev);
        }, 4000); // 4s timeout to complete 2nd click
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  const handleShareWhatsapp = (lic) => {
    const empObj = empresas.find(e => e.id === lic.empresaId);
    const labelDur = getLabelDuracao(lic.duracao || '1_MES');
    const dateAtivacao = lic.criadoEm ? new Date(lic.criadoEm).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR');
    const dateExpiracao = new Date(lic.dataExpiracaoIso || lic.dataExpiracao).toLocaleString('pt-BR');
    
    const whatsappMsg = `🔑 *LICENÇA DO SISTEMA GERADA COM SUCESSO!*\n` +
      `----------------------------------------\n` +
      `🏢 *Empresa:* ${empObj ? empObj.nome : (lic.empresaNome || 'Empresa Cliente')}\n` +
      `👤 *Responsável:* ${empObj?.nomeProprietario || empObj?.responsavel || lic.nomeProprietario || 'Cliente'}\n` +
      `📌 *Plano:* ${labelDur}\n` +
      `📅 *Data de Ativação:* ${dateAtivacao}\n` +
      `⏳ *Data de Expiração:* ${dateExpiracao}\n` +
      `👑 *Acesso Master:* ${empObj?.isReseller ? 'SIM (Revendedor)' : 'NÃO (Cliente Comum)'}\n` +
      `🔑 *Chave de Ativação:* *${lic.codigoAtivacao}*\n` +
      `----------------------------------------\n` +
      `Abra o sistema no seu computador ou celular e digite sua Chave de Ativação no campo de licenças para liberar o uso imediato!`;

    openWhatsappModal(lic.whatsapp || empObj?.whatsapp || empObj?.telefone, empObj ? empObj.nome : 'Cliente', whatsappMsg);
  };

  // Filtered Buyer Companies
  const filteredEmpresas = empresas.filter(emp => {
    const term = searchTerm.toLowerCase();
    const nomeComp = (emp.nome || '').toLowerCase();
    const nomeResp = (emp.nomeProprietario || emp.responsavel || '').toLowerCase();
    const tel = (emp.whatsapp || emp.telefone || '').toLowerCase();
    return nomeComp.includes(term) || nomeResp.includes(term) || tel.includes(term);
  });

  return (
    <div className="space-y-6 animate-fadeIn text-slate-950 pb-12">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-6 rounded-3xl border border-sky-400/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1.5 w-fit mb-2">
            <Crown className="w-4 h-4 text-slate-950" /> Painel Master SuperAdmin SaaS
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
            Cadastro de Compradores & Trava de Bloqueio 1-Clique / 2-Cliques
          </h2>
          <p className="text-sm text-slate-300 font-medium mt-1">
            Bloqueie qualquer cliente com 1 clique. Para desbloquear, clique 2 vezes para maior segurança!
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={restaurarLicencaMasterEmergencia}
            className="px-4 py-3 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-black text-xs border border-sky-500/40 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-sky-300" /> Renovar Licença Master (10 Anos)
          </button>

          <button
            onClick={resetAllDataToDefault}
            className="px-4 py-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-black text-xs border border-rose-500/40 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Reset Demo
          </button>
        </div>
      </div>

      {/* UNIFIED SINGLE FORM CARD: CADASTRO COMPLETO DE CLIENTE COMPRADOR */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-sky-500/40 shadow-xl space-y-4 text-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-950 flex items-center gap-2">
              <Building2 className="w-7 h-7 text-sky-600" /> Cadastro Completo de Cliente Comprador
            </h3>
            <p className="text-xs text-slate-600 font-bold mt-1">
              Cadastre nome da empresa, responsável pessoal e telefone para controle completo de clientes no sistema.
            </p>
          </div>
          <span className="px-3 py-1 bg-sky-100 text-sky-900 rounded-full text-xs font-black uppercase">
            Novo Cadastro
          </span>
        </div>

        <form onSubmit={handleCadastrarEmpresaEGerarLicenca} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* NOME DA EMPRESA */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-900 mb-1 flex items-center gap-1">
                <Building2 className="w-4 h-4 text-sky-600" /> NOME DA EMPRESA *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Barbearia do Fulano, Salão Luxo..."
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)}
                className="w-full p-3.5 rounded-2xl border-2 border-sky-300 text-slate-950 font-black text-sm bg-sky-50/40 outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400"
              />
            </div>

            {/* RESPONSÁVEL PESSOAL */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-900 mb-1 flex items-center gap-1">
                <User className="w-4 h-4 text-indigo-600" /> RESPONSÁVEL PESSOAL *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Gilson, Hugo, Fulano..."
                value={nomeResponsavel}
                onChange={(e) => setNomeResponsavel(e.target.value)}
                className="w-full p-3.5 rounded-2xl border-2 border-slate-300 text-slate-950 font-black text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400"
              />
            </div>

            {/* WHATSAPP */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-900 mb-1 flex items-center gap-1">
                <Phone className="w-4 h-4 text-emerald-600" /> TELEFONE WHATSAPP *
              </label>
              <input
                type="text"
                required
                placeholder="(11) 98589-7774"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full p-3.5 rounded-2xl border-2 border-slate-300 text-slate-950 font-black text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400"
              />
            </div>

            {/* DURAÇÃO DA LICENÇA */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-900 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-amber-600" /> DURAÇÃO DA LICENÇA *
              </label>
              <select
                value={duracaoLicenca}
                onChange={(e) => setDuracaoLicenca(e.target.value)}
                className="w-full p-3.5 rounded-2xl border-2 border-slate-300 text-slate-950 font-black text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="TESTE_5M">⏱️ Teste Grátis de 5 Minutos</option>
                <option value="TESTE_24H">⏳ Teste de 24 Horas</option>
                <option value="1_MES">🗓️ Plano 1 Mês (30 Dias)</option>
                <option value="6_MESES">📅 Plano 6 Meses (180 Dias)</option>
                <option value="1_ANO">👑 Plano 1 Ano (365 Dias)</option>
              </select>
            </div>
          </div>

          {/* MASTER REVENDEDOR TOGGLE */}
          <div className="flex items-center gap-3 bg-amber-50 p-3.5 rounded-2xl border border-amber-300">
            <input
              type="checkbox"
              id="toggleMasterUnified"
              checked={isReseller}
              onChange={(e) => setIsReseller(e.target.checked)}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
            <label htmlFor="toggleMasterUnified" className="text-xs md:text-sm font-black text-slate-950 cursor-pointer flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-600" />
              <span>Autorizar esta empresa como Master / Revendedor (Permite gerar licenças para terceiros)</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white font-black text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Plus className="w-6 h-6 text-white" /> Cadastrar Empresa & Emitir Licença no WhatsApp
          </button>
        </form>

        {/* Generated Key Banner Result */}
        {lastGeneratedKey && (
          <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3 animate-scaleUp">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                🎉 Licença Emitida: {getLabelDuracao(lastGeneratedKey.duracao)}
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">
                Expira: {new Date(lastGeneratedKey.dataExpiracaoIso || lastGeneratedKey.dataExpiracao).toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-3.5 rounded-xl border border-amber-300 gap-3">
              <span className="font-mono font-black text-xl md:text-2xl text-slate-950">{lastGeneratedKey.codigoAtivacao}</span>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => copyToClipboard(lastGeneratedKey.codigoAtivacao)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1"
                >
                  {copiedCode === lastGeneratedKey.codigoAtivacao ? <CheckCircle2 className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                  {copiedCode === lastGeneratedKey.codigoAtivacao ? 'Copiado!' : 'Copiar'}
                </button>

                <button
                  onClick={() => handleShareWhatsapp(lastGeneratedKey)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
                >
                  <Share2 className="w-4 h-4" /> Enviar WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MASTER UNIFIED TABLE: CADASTRO GERAL DE EMPRESAS, STATUS MASTER & VALIDADES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="font-black text-xl text-slate-950 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-sky-600" /> Cadastro Geral de Empresas, Status Master & Validades ({empresas.length})
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              1 clique para Bloquear • 2 cliques para Desbloquear a licença do cliente.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar empresa, responsável ou WhatsApp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* FULL MOBILE HORIZONTAL SCROLL WRAPPER */}
        <div className="w-full overflow-x-auto min-w-full touch-pan-x scrollbar-thin pb-4">
          <table className="w-full text-left text-sm border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-black uppercase text-xs bg-slate-50">
                <th className="py-3.5 px-4 rounded-l-xl">Empresa & Responsável Pessoal</th>
                <th className="py-3.5 px-4">WhatsApp</th>
                <th className="py-3.5 px-4">Status Master</th>
                <th className="py-3.5 px-4">Chave Emitida</th>
                <th className="py-3.5 px-4">Data de Ativação</th>
                <th className="py-3.5 px-4">Data de Expiração</th>
                <th className="py-3.5 px-4">Trava de Bloqueio (1x / 2x)</th>
                <th className="py-3.5 px-4 text-right rounded-r-xl">Ações Master</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-950 font-bold">
              {filteredEmpresas.map(emp => {
                const licObj = licencas.find(l => l.empresaId === emp.id) || {
                  id: `lic-dummy-${emp.id}`,
                  codigoAtivacao: 'AGY-24H-AUT1-0001',
                  duracao: 'TESTE_24H',
                  status: 'ATIVO',
                  criadoEm: new Date().toISOString(),
                  dataExpiracaoIso: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                };

                const isRevoked = licObj.status === 'REVOGADO';
                const isUnblockPending = unblockPendingId === licObj.id;

                const dateAtiv = licObj.criadoEm ? new Date(licObj.criadoEm).toLocaleString('pt-BR') : 'Hoje';
                const dateExp = new Date(licObj.dataExpiracaoIso || licObj.dataExpiracao).toLocaleString('pt-BR');

                return (
                  <tr key={emp.id} className="hover:bg-slate-50 transition">
                    {/* Empresa & Responsavel Pessoal */}
                    <td className="py-4 px-4">
                      <div className="font-black text-slate-950 text-base">{emp.nome}</div>
                      <div className="text-xs text-slate-500 font-bold flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-sky-600" /> {emp.nomeProprietario || emp.responsavel || 'Proprietário'}
                      </div>
                    </td>

                    {/* WhatsApp */}
                    <td className="py-4 px-4 font-mono text-xs text-slate-800 whitespace-nowrap">
                      {emp.whatsapp || emp.telefone ? (
                        <button
                          onClick={() => handleShareWhatsapp(licObj)}
                          className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-xl font-bold border border-emerald-300 flex items-center gap-1 transition"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-700" /> {emp.whatsapp || emp.telefone}
                        </button>
                      ) : (
                        <span className="text-slate-400 font-sans italic">Não informado</span>
                      )}
                    </td>

                    {/* Toggle Master Status Button */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePermissaoRevendedor(emp.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition border shadow-xs flex items-center gap-1.5 ${
                          emp.isReseller
                            ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 border-amber-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                        title="Clique para alternar permissão Master / Revendedor"
                      >
                        <Crown className={`w-4 h-4 ${emp.isReseller ? 'text-slate-950' : 'text-slate-400'}`} />
                        <span>{emp.isReseller ? '👑 Master Revendedor' : '🏢 Cliente Comum'}</span>
                      </button>
                    </td>

                    {/* Chave de Ativacao */}
                    <td className="py-4 px-4 font-mono text-xs font-black text-slate-900 whitespace-nowrap">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">
                        {licObj.codigoAtivacao}
                      </span>
                    </td>

                    {/* Data de Ativação */}
                    <td className="py-4 px-4 font-mono text-xs font-bold text-slate-700 whitespace-nowrap">
                      {dateAtiv}
                    </td>

                    {/* Data de Expiração com Botao de Estender */}
                    <td className="py-4 px-4 font-mono text-xs font-black text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-amber-100 text-amber-950 px-2.5 py-1 rounded-lg border border-amber-300">
                          ⏳ {dateExp}
                        </span>

                        <button
                          onClick={() => extenderLicencaDias(licObj.id, 30)}
                          className="px-2 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 text-[10px] font-black border border-sky-300 transition"
                          title="Adicionar +30 Dias de Licença"
                        >
                          +30D
                        </button>
                      </div>
                    </td>

                    {/* Trava de Bloqueio: 1-Clique Bloquear / 2-Cliques Desbloquear */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleBlockUnblockToggle(licObj.id, isRevoked)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition border shadow-sm flex items-center gap-1.5 ${
                          !isRevoked
                            ? 'bg-emerald-500 hover:bg-rose-600 text-white border-emerald-400 hover:border-rose-500'
                            : isUnblockPending
                            ? 'bg-amber-500 hover:bg-emerald-600 text-slate-950 hover:text-white border-amber-400 animate-pulse'
                            : 'bg-rose-600 hover:bg-amber-500 text-white border-rose-500'
                        }`}
                        title={!isRevoked ? "Clique 1 vez para BLOQUEAR este cliente" : "Clique 2 vezes para DESBLOQUEAR este cliente"}
                      >
                        {!isRevoked ? (
                          <>
                            <Shield className="w-4 h-4 text-white" />
                            <span>🟢 ATIVO (Clique 1x P/ Bloquear)</span>
                          </>
                        ) : isUnblockPending ? (
                          <>
                            <Unlock className="w-4 h-4 text-slate-950" />
                            <span>⚠️ Clique +1x para Confirmar Desbloqueio</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 text-white" />
                            <span>🚨 BLOQUEADO (Clique 2x P/ Desbloquear)</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Ações de Gerenciamento Complete */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Buyer Info */}
                        <button
                          onClick={() => setEditingEmpresa(emp)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition"
                          title="Editar Dados do Comprador"
                        >
                          <Edit3 className="w-4 h-4 text-slate-800" />
                        </button>

                        {/* Reenviar WhatsApp */}
                        <button
                          onClick={() => handleShareWhatsapp(licObj)}
                          className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 transition"
                          title="Reenviar pelo WhatsApp"
                        >
                          <Share2 className="w-4 h-4 text-emerald-700" />
                        </button>

                        {/* Excluir Registro */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja excluir o cadastro da empresa "${emp.nome}"?`)) {
                              deleteEmpresa(emp.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
                          title="Excluir Registro da Empresa"
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
      </div>

      {/* EDIT BUYER COMPANY MODAL */}
      {editingEmpresa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-scaleUp p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-black text-lg text-slate-950 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-600" /> Editar Dados do Comprador
              </h3>
              <button onClick={() => setEditingEmpresa(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveEditEmpresa} className="space-y-3">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">Nome da Empresa</label>
                <input
                  type="text"
                  required
                  value={editingEmpresa.nome || ''}
                  onChange={(e) => setEditingEmpresa({ ...editingEmpresa, nome: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">Responsável Pessoal</label>
                <input
                  type="text"
                  value={editingEmpresa.nomeProprietario || editingEmpresa.responsavel || ''}
                  onChange={(e) => setEditingEmpresa({ ...editingEmpresa, nomeProprietario: e.target.value, responsavel: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">WhatsApp de Contato</label>
                <input
                  type="text"
                  value={editingEmpresa.whatsapp || editingEmpresa.telefone || ''}
                  onChange={(e) => setEditingEmpresa({ ...editingEmpresa, whatsapp: e.target.value, telefone: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modalMasterCheck"
                  checked={!!editingEmpresa.isReseller}
                  onChange={(e) => setEditingEmpresa({ ...editingEmpresa, isReseller: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <label htmlFor="modalMasterCheck" className="text-xs font-black text-slate-900 cursor-pointer">
                  Autorizar como Master / Revendedor
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEmpresa(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-md"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
