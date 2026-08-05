import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Building2, 
  Key, 
  Laptop, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Smartphone,
  Save,
  Sparkles,
  Palette,
  Check
} from 'lucide-react';

export const ConfiguracoesView = () => {
  const { 
    activeEmpresa, 
    saveEmpresa, 
    activeLicenca, 
    hardwareId, 
    licenseValidation, 
    ativarLicencaCodigo,
    systemTheme,
    setSystemTheme
  } = useApp();

  const [nome, setNome] = useState(activeEmpresa.nome || '');
  const [cnpj, setCnpj] = useState(activeEmpresa.cnp || '');
  const [telefone, setTelefone] = useState(activeEmpresa.telefone || '');
  const [whatsapp, setWhatsapp] = useState(activeEmpresa.whatsapp || '');
  const [endereco, setEndereco] = useState(activeEmpresa.endereco || '');
  const [cidade, setCidade] = useState(activeEmpresa.cidade || '');
  const [estado, setEstado] = useState(activeEmpresa.estado || '');
  const [descricao, setDescricao] = useState(activeEmpresa.descricao || '');

  const [codigoChaveInput, setCodigoChaveInput] = useState('');
  const [msgResultado, setMsgResultado] = useState(null);

  const handleSaveCompany = (e) => {
    e.preventDefault();
    saveEmpresa({
      ...activeEmpresa,
      nome,
      cnp: cnpj,
      telefone,
      whatsapp,
      endereco,
      cidade,
      estado,
      descricao
    });
    alert('Dados da empresa salvos com sucesso!');
  };

  const handleRedeemKey = (e) => {
    e.preventDefault();
    if (!codigoChaveInput) return;
    const res = ativarLicencaCodigo(codigoChaveInput);
    setMsgResultado(res);
  };

  const themeOptions = [
    { key: 'cyan', title: '🩵 Azul Sky & Cyan', desc: 'Tema Moderno, Tecnológico e Iluminado', colorClass: 'bg-cyan-500', bgPreview: 'bg-sky-100 border-sky-300 text-sky-950' },
    { key: 'purple', title: '💜 Roxo Neon & Violeta', desc: 'Tema Premium, Sofisticado e Elegante', colorClass: 'bg-purple-600', bgPreview: 'bg-purple-100 border-purple-300 text-purple-950' },
    { key: 'emerald', title: '🟢 Verde Esmeralda & Mint', desc: 'Tema Clean voltado a Saúde e Estética', colorClass: 'bg-emerald-500', bgPreview: 'bg-emerald-100 border-emerald-300 text-emerald-950' },
    { key: 'amber', title: '🧡 Laranja & Âmbar Ouro', desc: 'Tema Quente, Energético e Vibrante', colorClass: 'bg-amber-500', bgPreview: 'bg-amber-100 border-amber-300 text-amber-950' },
    { key: 'rose', title: '🩷 Rosa Magenta & Rose', desc: 'Tema Beleza, Salão de Beleza e Esmalteria', colorClass: 'bg-rose-500', bgPreview: 'bg-rose-100 border-rose-300 text-rose-950' },
    { key: 'dark', title: '🖤 Dark Mode Sleek Black', desc: 'Modo Escuro com Contraste Noturno Luxuoso', colorClass: 'bg-slate-900', bgPreview: 'bg-slate-900 border-slate-800 text-white' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 flex items-center gap-2.5">
            <Settings className="w-8 h-8 text-sky-600" /> Configurações, Tema & Licença de Uso
          </h2>
          <p className="text-sm text-slate-600 font-extrabold mt-1">
            Altere as cores do sistema, gerencie os dados da empresa e ative chaves de licença
          </p>
        </div>
      </div>

      {/* SYSTEM COLOR PALETTE SELECTOR CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="p-3 bg-gradient-to-tr from-sky-500 via-purple-500 to-rose-500 text-white rounded-2xl shadow-sm">
            <Palette className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-950">Personalização da Cor do Sistema</h3>
            <p className="text-xs text-slate-500 font-extrabold">Selecione uma das paletas de cores para personalizar o visual de todo o seu painel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {themeOptions.map(t => {
            const isSelected = systemTheme === t.key;

            return (
              <button
                key={t.key}
                onClick={() => setSystemTheme(t.key)}
                className={`p-4 rounded-2xl border-2 transition-all text-left flex items-start justify-between ${t.bgPreview} ${
                  isSelected ? 'ring-4 ring-sky-400 shadow-lg scale-[1.02]' : 'hover:opacity-90'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full ${t.colorClass} border border-white shadow-xs`} />
                    <h4 className="font-black text-sm">{t.title}</h4>
                  </div>
                  <p className="text-xs opacity-80 font-bold">{t.desc}</p>
                </div>

                {isSelected && (
                  <div className="p-1 rounded-full bg-slate-950 text-white">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* High Contrast Software Licensing Box (Light & Clear Style) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-100 text-sky-700 rounded-2xl border border-sky-300">
              <Key className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Status da Licença Atual</span>
              <h3 className="text-2xl font-black text-slate-950">
                Plano {activeLicenca.plano} ({activeLicenca.status})
              </h3>
            </div>
          </div>

          <span className={`px-4 py-2 rounded-2xl text-xs font-black border flex items-center gap-1.5 ${
            licenseValidation.valido
              ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
              : 'bg-rose-100 text-rose-950 border-rose-300'
          }`}>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            {licenseValidation.valido ? 'Licença Ativa & Dispositivo Autorizado' : 'Restrição ou Licença Expirada'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs font-black uppercase text-slate-500 block">Chave Ativa Atual</span>
            <span className="text-base font-mono font-black text-slate-950 block">{activeLicenca.codigoAtivacao || 'N/A'}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs font-black uppercase text-slate-500 block">Data de Expiração</span>
            <span className="text-base font-mono font-black text-slate-950 block">{activeLicenca.dataExpiracao || '2030-12-31'}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs font-black uppercase text-slate-500 block">ID do Aparelho Vinculado</span>
            <span className="text-xs font-mono font-bold text-slate-700 block truncate">{hardwareId}</span>
          </div>
        </div>

        {/* Form to Redeem Activation Key */}
        <form onSubmit={handleRedeemKey} className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3">
          <label className="block font-black text-slate-950 text-base flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-700" /> Resgatar Nova Chave de Ativação
          </label>
          <p className="text-xs font-extrabold text-slate-800">
            Digite a chave enviada no seu WhatsApp para renovar sua licença mensal ou anual:
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="Ex: AGY-1ANO-X9K2-M4P1"
              value={codigoChaveInput}
              onChange={(e) => setCodigoChaveInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-950 font-mono font-black text-base border-2 border-amber-400 outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition whitespace-nowrap"
            >
              Ativar Chave
            </button>
          </div>

          {msgResultado && (
            <div className={`p-4 rounded-xl text-xs font-black border ${
              msgResultado.sucesso ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-rose-100 text-rose-950 border-rose-300'
            }`}>
              {msgResultado.mensagem}
            </div>
          )}
        </form>
      </div>

      {/* Main Company Profile Form */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h3 className="text-xl font-black text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-sky-600" /> Cadastro Geral da Empresa
        </h3>

        <form onSubmit={handleSaveCompany} className="space-y-4 text-sm font-semibold text-slate-950">
          <div>
            <label className="block font-extrabold text-slate-950 mb-1">Nome Comercial da Empresa *</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-base outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-extrabold text-slate-950 mb-1">CNPJ / CPF</label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-extrabold text-slate-950 mb-1">Telefone Fixo</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-extrabold text-slate-950 mb-1">WhatsApp de Atendimento</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block font-extrabold text-slate-950 mb-1">Endereço Completo</label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Cidade</label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-xs outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Estado</label>
                <input
                  type="text"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-xs outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-white font-extrabold text-sm bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 shadow-md flex items-center gap-2"
            >
              <Save className="w-5 h-5" /> Salvar Dados da Empresa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
