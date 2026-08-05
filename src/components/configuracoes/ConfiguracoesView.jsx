import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupabaseView } from '../supabase/SupabaseView';
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
  Check,
  Database
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
    setSystemTheme,
    isResellerAuthorized
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
    <div className="space-y-8 animate-fadeIn text-slate-950 pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 flex items-center gap-2.5">
            <Settings className="w-8 h-8 text-sky-600" /> Configurações & Licença de Uso
          </h2>
          <p className="text-sm text-slate-600 font-extrabold mt-1">
            Gerencie os dados da empresa, personalize as cores do painel e ative sua licença de uso
          </p>
        </div>
      </div>

      {/* SECTION 1: EMBEDDED SUPABASE DATABASE CONFIGURATOR & SQL GENERATOR (EXCLUSIVITY TO MASTER ADMIN) */}
      {isResellerAuthorized && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-black text-slate-950">Sincronização em Nuvem & Script SQL (Restrito Master)</h3>
          </div>
          <SupabaseView />
        </div>
      )}

      {/* SECTION 2: COMPANY REGISTRATION PROFILE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="p-3 bg-sky-100 text-sky-700 rounded-2xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-950">Dados da Empresa</h3>
            <p className="text-xs text-slate-500 font-extrabold">Informações exibidas na página pública de agendamento</p>
          </div>
        </div>

        <form onSubmit={handleSaveCompany} className="space-y-4 text-xs font-bold">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-1">Nome Fantasia da Empresa *</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-black text-sm text-slate-950 outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">CNPJ / CPF</label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0001-00"
                className="w-full p-3 rounded-xl border border-slate-300 font-black text-sm text-slate-950 outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-1">Telefone Fixo</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 3333-4444"
                className="w-full p-3 rounded-xl border border-slate-300 font-black text-sm text-slate-950 outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">WhatsApp Oficial da Empresa *</label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 98589-7774"
                className="w-full p-3 rounded-xl border border-slate-300 font-black text-sm text-slate-950 outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-700 mb-1">Endereço Completo</label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, Número, Bairro"
                className="w-full p-3 rounded-xl border border-slate-300 font-black text-sm text-slate-950 outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Cidade / Estado</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Cidade"
                  className="flex-1 p-3 rounded-xl border border-slate-300 font-black text-sm text-slate-950 outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                />
                <input
                  type="text"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  placeholder="UF"
                  maxLength={2}
                  className="w-16 p-3 rounded-xl border border-slate-300 font-black text-sm text-slate-950 outline-none uppercase text-center focus:ring-2 focus:ring-sky-500 bg-slate-50"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Descrição & Apresentação da Empresa</label>
            <textarea
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva os diferenciais da sua empresa..."
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-sm text-slate-950 outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="py-3 px-6 bg-sky-600 hover:bg-sky-700 text-white font-black text-sm rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Salvar Dados da Empresa
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: SYSTEM COLOR PALETTE SELECTOR CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="p-3 bg-gradient-to-tr from-sky-500 via-purple-500 to-rose-500 text-white rounded-2xl shadow-sm">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-950">Personalização da Cor do Sistema</h3>
            <p className="text-xs text-slate-500 font-extrabold">Selecione uma das paletas de cores para personalizar o visual de todo o seu painel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {themeOptions.map((theme) => {
            const isSelected = systemTheme === theme.key;
            return (
              <div
                key={theme.key}
                onClick={() => setSystemTheme(theme.key)}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2.5 ${
                  isSelected 
                    ? 'border-sky-500 bg-sky-50/80 shadow-md ring-2 ring-sky-400 scale-[1.01]' 
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 font-black text-sm text-slate-950">
                    <span className={`w-4 h-4 rounded-full ${theme.colorClass} border border-black/10`} />
                    {theme.title}
                  </div>
                  {isSelected && (
                    <span className="p-1 bg-sky-600 text-white rounded-full">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-500">{theme.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: LICENSE ACTIVATION & HARDWARE ID CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-950">Chave de Licença de Uso</h3>
            <p className="text-xs text-slate-500 font-extrabold">Digite o código recebido via WhatsApp para ativar a sua licença</p>
          </div>
        </div>

        <form onSubmit={handleRedeemKey} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="Ex: AGY-1ANO-XXXX-XXXX"
              value={codigoChaveInput}
              onChange={(e) => setCodigoChaveInput(e.target.value.toUpperCase())}
              className="flex-1 p-3.5 rounded-xl border-2 border-slate-300 text-slate-950 font-mono font-black text-base outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 uppercase"
            />
            <button
              type="submit"
              className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md uppercase"
            >
              <CheckCircle2 className="w-5 h-5" /> Ativar Chave
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
    </div>
  );
};
