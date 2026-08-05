import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, X, Copy, Check } from 'lucide-react';

export const WhatsAppModal = () => {
  const { whatsappModal, setWhatsappModal } = useApp();
  const [mensagem, setMensagem] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (whatsappModal.isOpen) {
      setMensagem(whatsappModal.mensagemDefault || '');
    }
  }, [whatsappModal]);

  if (!whatsappModal.isOpen) return null;

  const handleSendWhatsapp = () => {
    let cleanPhone = (whatsappModal.telefone || '').replace(/\D/g, '');
    if (cleanPhone.length === 10 || cleanPhone.length === 11) {
      cleanPhone = '55' + cleanPhone; // Add Brazil DDI 55
    }
    const encoded = encodeURIComponent(mensagem);
    const url = cleanPhone 
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
      
    window.open(url, '_blank');
    setWhatsappModal({ ...whatsappModal, isOpen: false });
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(mensagem);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Enviar WhatsApp</h3>
              <p className="text-xs text-emerald-100">{whatsappModal.nomeCliente} ({whatsappModal.telefone || 'Sem número'})</p>
            </div>
          </div>
          <button 
            onClick={() => setWhatsappModal({ ...whatsappModal, isOpen: false })}
            className="p-1 rounded-full hover:bg-white/20 transition text-white/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mensagem Personalizável do Recibo / Agendamento</label>
            <textarea
              rows={6}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed transition font-sans"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Disparo instantâneo via WhatsApp Web</span>
            <button
              onClick={handleCopyMessage}
              className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado!' : 'Copiar Texto'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={() => setWhatsappModal({ ...whatsappModal, isOpen: false })}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSendWhatsapp}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Abrir no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
