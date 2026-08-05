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
  Shield,
  Download
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

  // Helper to build LINK 1 (App Installation Link for Buyer Clients)
  const getAppInstallLink1 = (empSlug) => {
    return `${window.location.origin}/instalar/${empSlug}`;
  };

  // Single Action: Register Buyer Company & Generate License
  const handleCadastrarEmpresaEGerarLicenca = (e) => {
    e.preventDefault();
    if (!nomeEmpresa) return;

    const newEmpId = `emp-${Date.now()}`;
    const generatedSlug = nomeEmpresa.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newEmpObj = {
      id: newEmpId,
      nome: nomeEmpresa.trim(),
      nomeProprietario: nomeResponsavel.trim() || 'Proprietário',
      responsavel: nomeResponsavel.trim() || 'Proprietário',
      whatsapp: whatsapp.trim() || '',
      telefone: whatsapp.trim() || '',
      slug: generatedSlug,
      isReseller: isReseller,
      status: 'ativo',
      segmento: 'Comercial'
    };

    saveEmpresa(newEmpObj);

    const lic = gerarLicencaPersonalizada(newEmpId, duracaoLicenca, whatsapp);
    setLastGeneratedKey({ ...lic, empresaSlug: generatedSlug });

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
      revogarLicenca(licId);
      setUnblockPendingId(null);
    } else {
      if (unblockPendingId === licId) {
        revogarLicenca(licId);
        setUnblockPendingId(null);
      } else {
        setUnblockPendingId(licId);
        setTimeout(() => {
          setUnblockPendingId(prev => prev === licId ? null : prev);
        }, 4000);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  // Dispatch LINK 1 (App Installation) via WhatsApp to buyer
  const handleSendLink1InstallWhatsapp = (emp, lic) => {
    const link1 = getAppInstallLink1(emp.slug || 'app');
    const labelDur = getLabelDuracao(lic?.duracao || '1_MES');
    const dateExp = new Date(lic?.dataExpiracaoIso || lic?.dataExpiracao || Date.now()).toLocaleString('pt-BR');

    const msgInstall = `📱 *LINK 1: INSTALAÇÃO DO APLICATIVO DO SEU SISTEMA*\n` +
      `----------------------------------------\n` +
      `🏢 *Empresa:* ${emp.nome}\n` +
      `👤 *Proprietário:* ${emp.nomeProprietario || emp.responsavel || 'Cliente'}\n` +
      `📌 *Plano:* ${labelDur}\n` +
      `⏳ *Válido até:* ${dateExp}\n` +
      `🔑 *Sua Chave de Licença:* *${lic?.codigoAtivacao || 'AGY-MASTER'}*\n` +
      `----------------------------------------\n` +
      `📲 *CLIQUE NO LINK ABAIXO PARA INSTALAR O APP NO SEU CELULAR/PC:*\n` +
      `${link1}\n\n` +
      `Ao abrir o link, clique em "Instalar Aplicativo" e digite sua Chave de Ativação!`;

    openWhatsappModal(emp.whatsapp || emp.telefone, emp.nome, msgInstall);
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
            Gerenciador do LINK 1 (Instalação do App) & Validades
          </h2>
          <p className="text-sm text-slate-300 font-medium mt-1">
            Gere o <b>LINK 1</b> para enviar aos clientes que comprarem o seu sistema instalarem o aplicativo no celular ou computador!
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

      {/* UNIFIED SINGLE FORM CARD: CADASTRO COMPLETO DE CLIENTE COMPRADOR & GERADOR DO LINK 1 */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-sky-500/40 shadow-xl space-y-4 text-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-950 flex items-center gap-2">
              <Download className="w-7 h-7 text-sky-600" /> Cadastrar Comprador & Gerar LINK 1 (Instalação do App)
            </h3>
            <p className="text-xs text-slate-600 font-bold mt-1">
              Cadastre nome da empresa, responsável pessoal e telefone para gerar a chave e o LINK 1 de instalação do app.
            </p>
          </div>
          <span className="px-3 py-1 bg-sky-100 text-sky-900 rounded-full text-xs font-black uppercase">
            LINK 1 • COMPRADORES
          </span>
        </div>

        <form onSubmit={handleCadastrarEmpresaEGerarLicenca} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* NOME DA EMPRESA */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-900 mb-1 flex items-center gap-1">
                <Building2 className="w-4 h-4 text-sky-600" /> NOME DA EMPRESA COMPRADORA *
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
            <Download className="w-6 h-6 text-white" /> Cadastrar & Gerar LINK 1 (Instalação do App)
          </button>
        </form>

        {/* Generated Key & LINK 1 Banner Result */}
        {lastGeneratedKey && (
          <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3 animate-scaleUp">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> LINK 1 GERADO COM SUCESSO! ({getLabelDuracao(lastGeneratedKey.duracao)})
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">
                Expira: {new Date(lastGeneratedKey.dataExpiracaoIso || lastGeneratedKey.dataExpiracao).toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-300 space-y-2">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-amber-100 pb-2">
                <span className="text-xs font-bold text-slate-600">Chave de Ativação:</span>
                <span className="font-mono font-black text-xl text-slate-950">{lastGeneratedKey.codigoAtivacao}</span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-sky-800">📱 LINK 1 (Envie ao Comprador para Instalar o App):</span>
                <div className="p-2 bg-sky-50 rounded-lg border border-sky-300 font-mono text-xs text-sky-950 font-black break-all">
                  {getAppInstallLink1(lastGeneratedKey.empresaSlug || 'app')}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={() => copyToClipboard(getAppInstallLink1(lastGeneratedKey.empresaSlug || 'app'))}
                className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
              >
                {copiedCode === getAppInstallLink1(lastGeneratedKey.empresaSlug || 'app') ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                {copiedCode === getAppInstallLink1(lastGeneratedKey.empresaSlug || 'app') ? 'LINK 1 Copiado!' : 'Copiar LINK 1 (Instalação)'}
              </button>

              <button
                onClick={() => {
                  const empObj = empresas.find(e => e.id === lastGeneratedKey.empresaId) || { nome: 'Cliente', whatsapp: whatsapp };
                  handleSendLink1InstallWhatsapp(empObj, lastGeneratedKey);
                }}
                className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1 shadow-sm uppercase"
              >
                <Share2 className="w-4 h-4 text-slate-950" /> Enviar LINK 1 no WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MASTER UNIFIED TABLE: GERENCIADOR DO LINK 1 DOS COMPRADORES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="font-black text-xl text-slate-950 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-sky-600" /> Gerenciador de Compradores & LINK 1 de Instalação ({empresas.length})
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              Clique em <b>Copiar LINK 1</b> para enviar o instalador do aplicativo para a empresa compradora.
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
          <table className="w-full text-left text-sm border-collapse min-w-[1050px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-black uppercase text-xs bg-slate-50">
                <th className="py-3.5 px-4 rounded-l-xl">Empresa & Comprador</th>
                <th className="py-3.5 px-4">LINK 1 (Instalação App)</th>
                <th className="py-3.5 px-4">Status Master</th>
                <th className="py-3.5 px-4">Chave Emitida</th>
                <th className="py-3.5 px-4">Validade</th>
                <th className="py-3.5 px-4">Trava (1x / 2x)</th>
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
                const link1Url = getAppInstallLink1(emp.slug || 'app');
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

                    {/* LINK 1 INSTALAÇÃO BUTTON */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyToClipboard(link1Url)}
                          className="px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-950 rounded-xl font-extrabold text-xs border border-sky-300 flex items-center gap-1 transition shadow-xs"
                          title="Copiar LINK 1 de Instalação do App"
                        >
                          <Download className="w-3.5 h-3.5 text-sky-700" /> Copiar LINK 1
                        </button>

                        <button
                          onClick={() => handleSendLink1InstallWhatsapp(emp, licObj)}
                          className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-xl font-bold border border-emerald-300 transition"
                          title="Enviar LINK 1 no WhatsApp do Comprador"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        </button>
                      </div>
                    </td>

                    {/* Toggle Master Status Button */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePermissaoRevendedor(emp.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition border shadow-xs flex items-center gap-1.5 ${
                          emp.isReseller
                            ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 border-amber-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        <Crown className={`w-3.5 h-3.5 ${emp.isReseller ? 'text-slate-950' : 'text-slate-400'}`} />
                        <span>{emp.isReseller ? '👑 Master' : '🏢 Cliente'}</span>
                      </button>
                    </td>

                    {/* Chave de Ativacao */}
                    <td className="py-4 px-4 font-mono text-xs font-black text-slate-900 whitespace-nowrap">
                      <span className="bg-slate-100 px-2 py-1 rounded-lg border border-slate-300">
                        {licObj.codigoAtivacao}
                      </span>
                    </td>

                    {/* Data de Expiração com Botao de Estender */}
                    <td className="py-4 px-4 font-mono text-xs font-black text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-amber-100 text-amber-950 px-2 py-1 rounded-lg border border-amber-300">
                          ⏳ {dateExp}
                        </span>

                        <button
                          onClick={() => extenderLicencaDias(licObj.id, 30)}
                          className="px-2 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 text-[10px] font-black border border-sky-300 transition"
                          title="Adicionar +30 Dias"
                        >
                          +30D
                        </button>
                      </div>
                    </td>

                    {/* Trava de Bloqueio: 1-Clique Bloquear / 2-Cliques Desbloquear */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleBlockUnblockToggle(licObj.id, isRevoked)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition border shadow-xs flex items-center gap-1.5 ${
                          !isRevoked
                            ? 'bg-emerald-500 hover:bg-rose-600 text-white border-emerald-400'
                            : isUnblockPending
                            ? 'bg-amber-500 hover:bg-emerald-600 text-slate-950 hover:text-white border-amber-400 animate-pulse'
                            : 'bg-rose-600 hover:bg-amber-500 text-white border-rose-500'
                        }`}
                      >
                        {!isRevoked ? (
                          <>
                            <Shield className="w-3.5 h-3.5 text-white" />
                            <span>🟢 ATIVO</span>
                          </>
                        ) : isUnblockPending ? (
                          <>
                            <Unlock className="w-3.5 h-3.5 text-slate-950" />
                            <span>⚠️ Confirmar</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-white" />
                            <span>🚨 BLOQUEADO</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Ações de Gerenciamento Complete */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingEmpresa(emp)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition"
                          title="Editar Dados do Comprador"
                        >
                          <Edit3 className="w-4 h-4 text-slate-800" />
                        </button>

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
