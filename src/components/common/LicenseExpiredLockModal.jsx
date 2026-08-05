import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Phone, MessageSquare, AlertTriangle, Key, ShieldAlert, Sparkles, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';

export const LicenseExpiredLockModal = () => {
  const { 
    licenseValidation, 
    activeLicenca, 
    hardwareId, 
    ativarLicencaCodigo, 
    openWhatsappModal,
    restaurarLicencaMasterEmergencia,
    activeEmpresa
  } = useApp();

  const [inputKey, setInputKey] = useState('');
  const [redeemResult, setRedeemResult] = useState(null);

  if (licenseValidation.valido) return null;

  const handleRedeem = (e) => {
    e.preventDefault();
    if (!inputKey) return;
    
    // Emergency master key check (incondicional)
    const cleanKey = inputKey.trim().toUpperCase();
    if (cleanKey === 'MASTER-RECOVERY-2026' || cleanKey === 'MASTER' || cleanKey === 'RECOV' || cleanKey === 'GERAILTON' || cleanKey === '2026') {
      restaurarLicencaMasterEmergencia();
      setRedeemResult({ sucesso: true, mensagem: '🎉 Licença Master Restaurada com Sucesso!' });
      setTimeout(() => window.location.reload(), 500);
      return;
    }

    const res = ativarLicencaCodigo(inputKey);
    setRedeemResult(res);
  };

  const handleContactSales = () => {
    const msg = `Olá! Gostaria de adquirir/renovar a licença do meu sistema AgendaPro.\n\n👤 *Empresa:* ${activeLicenca.empresaNome || 'Minha Empresa'}\n📱 *Hardware ID:* ${hardwareId}\n📞 *Contato:* (11) 9 8589-7774`;
    openWhatsappModal('5511985897774', 'Suporte & Vendas de Licença', msg);
  };

  const handleEmergencyRestore = () => {
    const pass = window.prompt('🔐 Digite a Senha Master de Administrador do Sistema:');
    if (pass === 'MASTER-RECOVERY-2026' || pass === '2026' || pass === 'MASTER' || pass === 'GERAILTON' || pass === '1234') {
      restaurarLicencaMasterEmergencia();
      alert('🎉 Acesso Master Restaurado com Sucesso! A licença do seu sistema foi reativada por 10 Anos.');
      window.location.reload();
    } else if (pass) {
      alert('⚠️ Senha Master Incorreta. Acesso negado.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-fadeIn text-slate-950 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border-2 border-rose-500 animate-scaleUp my-auto">
        {/* Header Alert */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-600 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white text-rose-900 uppercase tracking-wider">
                Acesso Bloqueado pelo Sistema
              </span>
              <h3 className="font-black text-xl text-white">Sua Licença Expirou ou foi Inativada</h3>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-8 space-y-5">
          {/* Main Notice Banner */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
            <p className="text-sm font-black text-rose-950 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{licenseValidation.motivo || 'Para continuar utilizando o sistema no seu computador ou celular, você precisa adquirir ou renovar sua licença.'}</span>
            </p>
            <p className="text-xs text-rose-800 font-bold pl-7">
              Hardware ID deste aparelho: <b className="font-mono text-slate-950 bg-white px-2 py-0.5 rounded border border-rose-300 inline-block mt-0.5">{hardwareId}</b>
            </p>
          </div>

          {/* Contact Support & Sales WhatsApp Box */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3.5 shadow-xl">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase text-sky-400 tracking-wider block">Contato Oficial de Ativação & Vendas</span>
              <h4 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <Phone className="w-6 h-6 text-emerald-400" /> (11) 9 8589-7774
              </h4>
              <p className="text-xs text-slate-300 font-semibold">
                Fale agora no WhatsApp para renovar seu plano de 1 Mês, 6 Meses ou 1 Ano!
              </p>
            </div>

            <button
              onClick={handleContactSales}
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs md:text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <MessageSquare className="w-5 h-5 text-white" /> Adquirir Nova Licença via WhatsApp
            </button>
          </div>

          {/* Redeem Key Form - Fully Responsive Mobile Container */}
          <form onSubmit={handleRedeem} className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3">
            <label className="block text-xs font-black uppercase text-amber-950 flex items-center gap-1.5 leading-snug">
              <Key className="w-4 h-4 text-amber-700 flex-shrink-0" /> Digite sua Chave de Ativação Enviada no WhatsApp:
            </label>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full items-stretch">
              <input
                type="text"
                required
                placeholder="Ex: AGY-1M-48TM-TI37"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full min-w-0 px-3.5 py-3 rounded-xl bg-white border-2 border-amber-400 text-slate-950 font-mono font-black text-sm md:text-base outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md shrink-0 flex items-center justify-center"
              >
                Ativar
              </button>
            </div>

            {redeemResult && (
              <div className={`p-3 rounded-xl border text-xs font-black flex items-center gap-2 ${
                redeemResult.sucesso 
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-300' 
                  : 'bg-rose-100 text-rose-950 border-rose-300'
              }`}>
                {redeemResult.sucesso ? <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 text-rose-700 flex-shrink-0" />}
                <span>{redeemResult.mensagem}</span>
              </div>
            )}
          </form>

          {/* Master Emergency Recovery Button Protected with Secret Password */}
          <div className="pt-2 border-t border-slate-200 text-center">
            <button
              onClick={handleEmergencyRestore}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-black text-xs md:text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-sky-200" /> 🔓 Restaurar Minha Licença Master (Dono do Sistema)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
