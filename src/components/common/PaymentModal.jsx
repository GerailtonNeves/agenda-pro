import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, QrCode, DollarSign, X, Check, Copy, ShieldCheck } from 'lucide-react';

export const PaymentModal = () => {
  const { paymentModal, setPaymentModal, updateAgendamentoStatus, activeEmpresa } = useApp();
  const [method, setMethod] = useState('pix'); // 'pix', 'cartao', 'manual'
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!paymentModal.isOpen) return null;

  const valor = paymentModal.valor || paymentModal.agendamento?.valor || 0;
  const pixCode = `00020126580014BR.GOV.BCB.PIX0136${activeEmpresa.slug}-pix-key-9995204000053039865802BR5925${activeEmpresa.nome.substring(0, 15)}6009SAO PAULO62070503***6304E8A2`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (paymentModal.agendamento) {
        updateAgendamentoStatus(paymentModal.agendamento.id, 'confirmado');
      }
      alert('🎉 Pagamento confirmado com sucesso! Status do agendamento atualizado para Confirmado.');
      setPaymentModal({ isOpen: false });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-500 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Checkout de Pagamento</h3>
              <p className="text-xs text-cyan-100">Gateway Integrado PIX / Cartão</p>
            </div>
          </div>
          <button 
            onClick={() => setPaymentModal({ isOpen: false })}
            className="p-1 rounded-full hover:bg-white/20 text-white/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Methods Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50">
          <button
            onClick={() => setMethod('pix')}
            className={`py-3 text-xs font-bold flex flex-col items-center gap-1 border-b-2 transition ${
              method === 'pix' ? 'border-cyan-500 text-cyan-700 bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-500" /> PIX Instantâneo
          </button>
          <button
            onClick={() => setMethod('cartao')}
            className={`py-3 text-xs font-bold flex flex-col items-center gap-1 border-b-2 transition ${
              method === 'cartao' ? 'border-cyan-500 text-cyan-700 bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            <CreditCard className="w-4 h-4 text-sky-500" /> Cartão de Crédito
          </button>
          <button
            onClick={() => setMethod('manual')}
            className={`py-3 text-xs font-bold flex flex-col items-center gap-1 border-b-2 transition ${
              method === 'manual' ? 'border-cyan-500 text-cyan-700 bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-500" /> Dinheiro / Manual
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 block uppercase">Valor a Pagar</span>
            <span className="text-3xl font-black text-emerald-600">R$ {valor.toFixed(2)}</span>
            <p className="text-xs text-slate-500 mt-1">{paymentModal.agendamento?.servicoNome || 'Serviço Agendado'}</p>
          </div>

          {method === 'pix' && (
            <div className="space-y-4 text-center">
              <div className="w-40 h-40 mx-auto bg-white p-3 rounded-2xl border-2 border-emerald-400 shadow-md flex items-center justify-center">
                {/* Simulated QR Code SVG */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pixCode)}`} 
                  alt="QR Code PIX" 
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700 mb-1">Copia e Cola PIX</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixCode}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-mono text-slate-600 truncate"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition flex-shrink-0 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {method === 'cartao' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Número do Cartão</label>
                <input type="text" placeholder="4532 •••• •••• 8910" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Validade</label>
                  <input type="text" placeholder="MM/AA" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                  <input type="text" placeholder="123" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Impresso no Cartão</label>
                <input type="text" placeholder="Nome como no cartão" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
            </div>
          )}

          {method === 'manual' && (
            <div className="text-center py-4 space-y-2">
              <DollarSign className="w-12 h-12 text-amber-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Pagamento Presencial / Dinheiro</p>
              <p className="text-xs text-slate-500">Confirme o recebimento diretamente no caixa do estabelecimento.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={() => setPaymentModal({ isOpen: false })}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 shadow-md shadow-cyan-500/20 transition flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
          </button>
        </div>
      </div>
    </div>
  );
};
