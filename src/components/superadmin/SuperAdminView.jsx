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
  ShieldAlert
} from 'lucide-react';
import { getLabelDuracao } from '../../services/licenseService';

export const SuperAdminView = () => {
  const { 
    empresas, 
    licencas, 
    hardwareId, 
    isResellerAuthorized,
    togglePermissaoRevendedor,
    gerarLicencaPersonalizada,
    desvincularDispositivoLicenca, 
    revogarLicenca,
    openWhatsappModal,
    resetAllDataToDefault,
    restaurarLicencaMasterEmergencia
  } = useApp();

  const [selectedEmpresaId, setSelectedEmpresaId] = useState(empresas[0]?.id || '');
  const [selectedDuracao, setSelectedDuracao] = useState('1_MES');
  const [clienteTelefone, setClienteTelefone] = useState('');
  
  const [copiedCode, setCopiedCode] = useState('');
  const [lastGeneratedKey, setLastGeneratedKey] = useState(null);

  const handleGenerateKey = () => {
    if (!selectedEmpresaId) return;
    const lic = gerarLicencaPersonalizada(selectedEmpresaId, selectedDuracao, clienteTelefone);
    setLastGeneratedKey(lic);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  const handleShareWhatsapp = (lic) => {
    const empObj = empresas.find(e => e.id === lic.empresaId);
    const labelDur = getLabelDuracao(lic.duracao || '1_MES');
    const dateFormatted = new Date(lic.dataExpiracaoIso || lic.dataExpiracao).toLocaleString('pt-BR');
    
    const whatsappMsg = `🔑 *LICENÇA DO SISTEMA GERADA COM SUCESSO!*\n` +
      `----------------------------------------\n` +
      `👤 *Cliente:* ${empObj ? empObj.nome : 'Cliente'}\n` +
      `📌 *Tipo de Licença:* ${labelDur}\n` +
      `🔑 *Chave de Ativação:* *${lic.codigoAtivacao}*\n` +
      `📅 *Válido até:* ${dateFormatted}\n` +
      `----------------------------------------\n` +
      `Abra o sistema no seu computador ou celular e digite sua Chave de Ativação nas Configurações para liberar o acesso instantâneo!`;

    openWhatsappModal(clienteTelefone || empObj?.whatsapp || empObj?.telefone, empObj ? empObj.nome : 'Cliente', whatsappMsg);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-6 rounded-3xl border border-sky-400/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1.5 w-fit mb-2">
            <Crown className="w-4 h-4 text-slate-950" /> Painel Master SuperAdmin SaaS & Revenda
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
            Gerador Comercial de Licenças & Autorização de Revendedores
          </h2>
          <p className="text-sm text-slate-300 font-medium mt-1">
            Gere licenças por duração (5 min, 24h, 1 mês, 6 meses, 1 ano) e autorize clientes a revenderem seu sistema
          </p>
        </div>

        <div className="flex gap-2">
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

      {/* Hardware Fingerprint Info Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-100 text-sky-700 rounded-2xl border border-sky-300">
            <Laptop className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Hardware Fingerprint do Dispositivo Master</span>
            <p className="text-lg font-black font-mono text-slate-950">{hardwareId}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-black text-slate-500 block uppercase">Telefone Suporte Comercial</span>
          <span className="text-sm font-black text-emerald-600">(11) 9 8589-7774</span>
        </div>
      </div>

      {/* Generator & Reseller Authorization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generate Multi-Duration Activation Key Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-slate-950">
          <h3 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Key className="w-6 h-6 text-sky-600" /> Emitir Nova Licença de Acesso
          </h3>
          <p className="text-sm font-semibold text-slate-600">
            Escolha o plano e gere a chave para envio instantâneo no WhatsApp do seu cliente.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">Empresa / Cliente *</label>
              <select
                value={selectedEmpresaId}
                onChange={(e) => setSelectedEmpresaId(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-300 text-slate-950 font-bold text-base bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500"
              >
                {empresas.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nome} ({emp.segmento}) {emp.isReseller ? '👑 Revendedor Autorizado' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">Duração da Licença *</label>
              <select
                value={selectedDuracao}
                onChange={(e) => setSelectedDuracao(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-300 text-slate-950 font-bold text-base bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="TESTE_5M">⏱️ Teste Grátis de 5 Minutos</option>
                <option value="TESTE_24H">⏳ Teste de 24 Horas</option>
                <option value="1_MES">🗓️ Plano 1 Mês (30 Dias)</option>
                <option value="6_MESES">📅 Plano 6 Meses (180 Dias)</option>
                <option value="1_ANO">👑 Plano 1 Ano (365 Dias)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">WhatsApp do Cliente (Opcional)</label>
              <input
                type="text"
                placeholder="(11) 98589-7774"
                value={clienteTelefone}
                onChange={(e) => setClienteTelefone(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-300 text-slate-950 font-bold text-base bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              onClick={handleGenerateKey}
              className="w-full py-4 px-6 bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white font-black text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Plus className="w-5 h-5" /> Gerar Licença & Enviar no WhatsApp
            </button>
          </div>

          {/* Generated Code Display Banner */}
          {lastGeneratedKey && (
            <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3 animate-scaleUp">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                  {getLabelDuracao(lastGeneratedKey.duracao)}
                </span>
                <span className="text-xs font-mono font-bold text-slate-600">
                  Expira: {new Date(lastGeneratedKey.dataExpiracaoIso || lastGeneratedKey.dataExpiracao).toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-amber-300">
                <span className="font-mono font-black text-2xl text-slate-950">{lastGeneratedKey.codigoAtivacao}</span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(lastGeneratedKey.codigoAtivacao)}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1"
                  >
                    {copiedCode === lastGeneratedKey.codigoAtivacao ? <CheckCircle2 className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                    {copiedCode === lastGeneratedKey.codigoAtivacao ? 'Copiado!' : 'Copiar'}
                  </button>

                  <button
                    onClick={() => handleShareWhatsapp(lastGeneratedKey)}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl transition flex items-center gap-1 shadow-sm"
                  >
                    <Share2 className="w-4 h-4" /> WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reseller Authorization & White-Label Control Panel */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" /> Autorização de Revendedores (White-Label)
          </h3>
          <p className="text-xs text-slate-300 font-semibold leading-relaxed">
            Seus clientes finais <b className="text-rose-300">NÃO têm acesso</b> ao gerador de licenças. Autorize apenas parceiros comerciais que compraram o sistema para revender!
          </p>

          <div className="space-y-3 pt-2">
            {empresas.map(emp => (
              <div key={emp.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-sm text-white flex items-center gap-2">
                    {emp.nome}
                    {emp.isReseller ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
                        Revendedor Autorizado
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-400 uppercase">
                        Cliente Final
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">{emp.segmento} • ID: {emp.id}</span>
                </div>

                <button
                  onClick={() => togglePermissaoRevendedor(emp.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition border ${
                    emp.isReseller
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                      : 'bg-amber-400 hover:bg-amber-500 text-slate-950 border-amber-300'
                  }`}
                >
                  {emp.isReseller ? '🚫 Revogar Permissão de Revenda' : '👑 Autorizar como Revendedor'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Licenses Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
        <h3 className="font-black text-xl text-slate-950 border-b border-slate-200 pb-4 mb-4 flex items-center justify-between">
          <span>Licenças Geradas e Emitidas ({licencas.length})</span>
        </h3>

        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-black uppercase text-xs">
              <th className="py-3.5 px-4">Empresa / Cliente</th>
              <th className="py-3.5 px-4">Duração</th>
              <th className="py-3.5 px-4">Chave de Ativação</th>
              <th className="py-3.5 px-4">Aparelho Vinculado</th>
              <th className="py-3.5 px-4">Data / Hora Expiração</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-950 font-bold">
            {licencas.map(lic => {
              const isRevoked = lic.status === 'REVOGADO';

              return (
                <tr key={lic.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-4 font-black text-slate-950 text-base">
                    {lic.empresaNome || 'Empresa Cliente'}
                  </td>

                  <td className="py-4 px-4 font-black text-xs text-sky-900">
                    {getLabelDuracao(lic.duracao || '1_MES')}
                  </td>

                  <td className="py-4 px-4 font-mono text-sm font-black text-slate-900">
                    {lic.codigoAtivacao || <span className="text-slate-400 font-sans text-xs italic">Via Login</span>}
                  </td>

                  <td className="py-4 px-4 font-mono text-xs font-bold text-slate-800">
                    {lic.dispositivoVinculadoId ? (
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-950 border border-slate-300 rounded-lg">
                        📱 {lic.dispositivoVinculadoId}
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-sans text-xs">Aguardando vínculo</span>
                    )}
                  </td>

                  <td className="py-4 px-4 font-mono font-black text-xs text-slate-900">
                    {new Date(lic.dataExpiracaoIso || lic.dataExpiracao).toLocaleString('pt-BR')}
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                      isRevoked
                        ? 'bg-rose-100 text-rose-900 border-rose-300'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}>
                      {lic.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleShareWhatsapp(lic)}
                        className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 transition"
                        title="Reenviar pelo WhatsApp"
                      >
                        <Share2 className="w-4 h-4 text-emerald-700" />
                      </button>

                      {lic.dispositivoVinculadoId && (
                        <button
                          onClick={() => desvincularDispositivoLicenca(lic.id)}
                          className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs transition border border-amber-300"
                          title="Desvincular Hardware ID do cliente"
                        >
                          🔓 Desvincular
                        </button>
                      )}

                      <button
                        onClick={() => revogarLicenca(lic.id)}
                        className={`px-3.5 py-2 rounded-xl font-black text-xs transition border ${
                          isRevoked
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-950 border-rose-300 hover:bg-rose-200'
                        }`}
                      >
                        {isRevoked ? 'Reativar' : '🚫 Revogar'}
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
  );
};
