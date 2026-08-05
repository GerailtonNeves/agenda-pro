import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Download, 
  Smartphone, 
  Laptop, 
  CheckCircle2, 
  Key, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Share2,
  Lock,
  Calendar,
  Check
} from 'lucide-react';

export const AppInstallView = () => {
  const { 
    empresas, 
    activeEmpresa,
    activeEmpresaId,
    publicBookingSlug,
    ativarLicencaCodigo,
    hardwareId,
    setCurrentView
  } = useApp();

  const empresa = empresas.find(e => e.slug === publicBookingSlug || e.id === activeEmpresaId) || activeEmpresa || empresas[0];

  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // License Activation State
  const [codigoChave, setCodigoChave] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setInstallPrompt(null);
    } else {
      alert('📲 Para instalar no iPhone: Toque no botão Compartilhar do Safari e selecione "Adicionar à Tela de Início".\n\nNo Android / PC: Clique nos 3 pontinhos do navegador e selecione "Instalar Aplicativo".');
    }
  };

  const handleAtivar = (e) => {
    e.preventDefault();
    if (!codigoChave) return;
    const res = ativarLicencaCodigo(codigoChave);
    setFeedback(res);
    if (res.sucesso) {
      setTimeout(() => {
        setCurrentView('dashboard');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 text-slate-950 font-sans p-4 md:p-8 flex items-center justify-center selection:bg-sky-500 selection:text-white">
      <div className="max-w-xl w-full bg-white rounded-3xl border-2 border-sky-300 p-6 md:p-8 space-y-6 shadow-2xl animate-scaleUp">
        {/* Header Badge */}
        <div className="text-center space-y-3">
          <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-sky-600 text-white inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300" /> LINK 1 • INSTALAÇÃO DO APLICATIVO
          </span>

          {/* Logo & Company Name */}
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-sky-400 shadow-xl bg-white mx-auto mt-2">
            <img src={empresa.logo} alt={empresa.nome} className="w-full h-full object-cover" />
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-slate-950">{empresa.nome}</h1>
          <p className="text-xs md:text-sm text-slate-600 font-medium max-w-md mx-auto">
            Bem-vindo ao aplicativo oficial! Instale o sistema no seu celular ou computador para acessar seu painel.
          </p>
        </div>

        {/* 1-CLICK INSTALL PROMPT BUTTON */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 border-2 border-sky-400 space-y-4 text-center text-white shadow-lg">
          <div className="flex justify-center gap-4 text-sky-100">
            <Smartphone className="w-8 h-8" />
            <Laptop className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-black text-white">Instalar Aplicativo no Aparelho</h3>
          
          <button
            onClick={handleInstallClick}
            className="w-full py-4 px-6 bg-white hover:bg-sky-50 text-sky-950 font-black text-base md:text-lg rounded-2xl shadow-xl transition flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Download className="w-6 h-6 text-sky-600" /> {isInstalled ? '✅ Aplicativo Já Instalado!' : '📲 Baixar & Instalar App Agora'}
          </button>
        </div>

        {/* LICENSE KEY ACTIVATION BOX */}
        <form onSubmit={handleAtivar} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase text-sky-900 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-500" /> DIGITE SUA CHAVE DE ATIVAÇÃO DE COMPRA *
            </label>
            <p className="text-[11px] text-slate-600 font-bold">
              Insira a chave recebida via WhatsApp (ex: AGY-1ANO-...) para ativar o seu acesso no sistema:
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              required
              placeholder="Ex: AGY-1ANO-XXXX-XXXX"
              value={codigoChave}
              onChange={(e) => setCodigoChave(e.target.value.toUpperCase())}
              className="flex-1 p-3.5 rounded-xl border border-sky-300 bg-white text-slate-950 font-mono font-black text-base outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 uppercase"
            />
            <button
              type="submit"
              className="py-3.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl transition flex items-center justify-center gap-1 shadow-md uppercase"
            >
              <CheckCircle2 className="w-5 h-5 text-white" /> Ativar
            </button>
          </div>

          {feedback && (
            <div className={`p-3 rounded-xl text-xs font-black border ${
              feedback.sucesso ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-rose-100 text-rose-950 border-rose-300'
            }`}>
              {feedback.mensagem}
            </div>
          )}
        </form>

        {/* INSTALLATION INSTRUCTION GUIDES */}
        <div className="space-y-3 pt-2 text-xs font-semibold text-slate-700">
          <h4 className="font-black text-slate-950 text-sm border-b border-slate-200 pb-2">Como instalar no seu aparelho:</h4>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="px-2 py-0.5 bg-sky-100 text-sky-900 font-bold rounded text-[10px]">iOS / iPhone</span>
              <p className="text-[11px] text-slate-700">Abra no Safari, toque no botão <b>Compartilhar 📤</b> e escolha <b>"Adicionar à Tela de Início"</b>.</p>
            </div>

            <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold rounded text-[10px]">Android / Chrome</span>
              <p className="text-[11px] text-slate-700">Toque nos <b>3 pontinhos (⋮)</b> do navegador e selecione <b>"Instalar aplicativo"</b>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
