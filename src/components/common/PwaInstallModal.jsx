import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Monitor, CheckCircle2, X, Sparkles, Share2, PlusSquare } from 'lucide-react';

export const PwaInstallModal = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if already running in PWA standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsStandalone(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setIsIos(true);
    }

    // Capture PWA install prompt event on Chrome, Edge, Android
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallModal(false);
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  if (isStandalone) return null; // Hide if already installed and running inside app

  return (
    <>
      {/* Floating Installation Banner in Header or Bottom Right */}
      <div className="fixed bottom-4 right-4 z-40 animate-bounce-subtle">
        <button
          onClick={handleTriggerInstall}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white font-black text-xs shadow-2xl border-2 border-white/40 flex items-center gap-2 group transition"
        >
          <div className="w-7 h-7 rounded-xl bg-white text-sky-700 flex items-center justify-center font-black group-hover:scale-110 transition">
            <Smartphone className="w-4 h-4 text-sky-600" />
          </div>
          <span>📲 Instalar Aplicativo no Celular / PC</span>
        </button>
      </div>

      {/* Instructional Modal for Manual Installation */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-scaleUp text-slate-950">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-500 text-white flex justify-between items-center">
              <h3 className="font-black text-lg flex items-center gap-2">
                <Smartphone className="w-6 h-6" /> Instalar App na Tela Inicial
              </h3>
              <button onClick={() => setShowInstallModal(false)} className="p-1 rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm font-semibold">
              <div className="flex items-center gap-4 bg-sky-50 p-4 rounded-2xl border border-sky-200">
                <img src="/favicon.svg" alt="App Icon" className="w-14 h-14 rounded-2xl shadow-md border border-sky-300" />
                <div>
                  <h4 className="font-black text-base text-slate-950">AgendaPro SaaS</h4>
                  <p className="text-xs text-sky-900 font-bold">Aplicativo de Agendamentos & Gestão</p>
                </div>
              </div>

              {isIos ? (
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <h5 className="font-black text-slate-950 text-sm flex items-center gap-1.5">
                    📱 No iPhone / iPad (Safari):
                  </h5>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-800 font-bold">
                    <li className="flex items-center gap-2">
                      Toque no ícone de <b className="text-sky-700 flex items-center gap-1"><Share2 className="w-4 h-4 inline" /> Compartilhar</b> na barra inferior do Safari.
                    </li>
                    <li className="flex items-center gap-2">
                      Role para baixo e selecione <b className="text-sky-700 flex items-center gap-1"><PlusSquare className="w-4 h-4 inline" /> Adicionar à Tela de Início</b>.
                    </li>
                    <li>Clique em <b>Adicionar</b> no canto superior. Pronto!</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <h5 className="font-black text-slate-950 text-sm flex items-center gap-1.5">
                    📱 No Android (Chrome) ou Computador:
                  </h5>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-800 font-bold">
                    <li>Toque nos <b>3 pontinhos (⋮)</b> do menu do seu navegador Chrome.</li>
                    <li>Clique na opção <b>"Instalar Aplicativo"</b> ou <b>"Adicionar à Tela Inicial"</b>.</li>
                    <li>Confirme a instalação. O ícone surgirá na sua área de trabalho/tela de início!</li>
                  </ol>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-black text-xs shadow-md"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
