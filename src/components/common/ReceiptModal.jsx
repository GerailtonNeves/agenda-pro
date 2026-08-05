import React from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, X, Download, Share2, CheckCircle2, Building2 } from 'lucide-react';

export const ReceiptModal = () => {
  const { receiptModal, setReceiptModal, activeEmpresa, openWhatsappModal } = useApp();

  if (!receiptModal.isOpen || !receiptModal.agendamento) return null;

  const age = receiptModal.agendamento;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsapp = () => {
    const rawPhone = age.clienteWhatsapp || age.clienteTelefone || '';
    let cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone.length === 10 || cleanPhone.length === 11) {
      cleanPhone = '55' + cleanPhone;
    }

    const receiptMsg = `🧾 *RECIBO DE ATENDIMENTO - ${activeEmpresa.nome}*\n` +
      `----------------------------------------\n` +
      `👤 *Cliente:* ${age.clienteNome}\n` +
      `✂️ *Serviço:* ${age.servicoNome}\n` +
      `💈 *Profissional:* ${age.funcionarioNome}\n` +
      `📅 *Data/Hora:* ${age.data} às ${age.horario}\n` +
      `💳 *Valor Pago:* R$ ${age.valor.toFixed(2)}\n` +
      `----------------------------------------\n` +
      `Obrigado pela preferência! 😊`;

    const encoded = encodeURIComponent(receiptMsg);
    const targetUrl = cleanPhone 
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    try {
      window.open(targetUrl, '_blank');
    } catch (e) {
      console.warn('Popup blocked, falling back to modal', e);
    }

    openWhatsappModal(cleanPhone || age.clienteTelefone, age.clienteNome, receiptMsg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 animate-scaleUp max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <h3 className="font-extrabold text-base">Recibo Profissional Emitido</h3>
          </div>
          <button 
            onClick={() => setReceiptModal({ ...receiptModal, isOpen: false })}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper with Enriched Font Scale */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-950 bg-white" id="printable-receipt">
          {/* Company Header Info */}
          <div className="flex items-center justify-between pb-6 border-b-2 border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-50 flex-shrink-0">
                <img src={activeEmpresa.logo} alt={activeEmpresa.nome} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-black text-2xl text-slate-950">{activeEmpresa.nome}</h2>
                <p className="text-sm font-extrabold text-slate-600">{activeEmpresa.segmento} • CNPJ: {activeEmpresa.cnp}</p>
                <p className="text-xs font-semibold text-slate-600">{activeEmpresa.endereco} - {activeEmpresa.cidade}/{activeEmpresa.estado}</p>
                <p className="text-xs font-semibold text-slate-600">Tel: {activeEmpresa.telefone} | Whats: {activeEmpresa.whatsapp}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-950 text-xs font-black rounded-full uppercase tracking-wider block mb-1">
                RECIBO PAGO
              </span>
              <p className="text-xs text-slate-600 font-mono font-black">Nº {age.id.toUpperCase()}</p>
            </div>
          </div>

          {/* Customer & Appointment Details Table */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <p className="text-xs uppercase font-black text-slate-500">Recebemos de:</p>
                <p className="font-black text-base text-slate-950">{age.clienteNome}</p>
                <p className="text-sm text-slate-700 font-bold">{age.clienteTelefone}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-black text-slate-500">Data & Horário:</p>
                <p className="font-black text-base text-slate-950">{age.data} às {age.horario}</p>
                <p className="text-sm text-slate-700 font-bold">Profissional: {age.funcionarioNome}</p>
              </div>
            </div>

            <div>
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-500 font-black uppercase text-xs">
                    <th className="py-2.5">Descrição do Serviço</th>
                    <th className="py-2.5">Duração</th>
                    <th className="py-2.5 text-right">Valor Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-4 font-black text-base text-slate-950">{age.servicoNome}</td>
                    <td className="py-4 text-slate-800 font-extrabold">{age.duracaoMinutos} min</td>
                    <td className="py-4 text-right font-black text-slate-950 text-lg">
                      R$ {age.valor.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Paid Footer */}
            <div className="flex justify-between items-center pt-5 border-t-2 border-slate-950">
              <div>
                <p className="text-sm text-slate-800 font-black">Forma de Pagamento: <b>PIX / Cartão</b></p>
                <p className="text-xs text-slate-500 font-semibold">Emitido digitalmente via Sistema SaaS</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-500 block uppercase tracking-wider">VALOR TOTAL PAGO</span>
                <span className="text-3xl font-black text-emerald-600">
                  R$ {age.valor.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Signatures line */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-700 font-bold">
              <div className="border-t border-slate-400 pt-2">
                {activeEmpresa.nome}
              </div>
              <div className="border-t border-slate-400 pt-2">
                {age.clienteNome}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center print:hidden">
          <button
            onClick={handleSendWhatsapp}
            className="px-5 py-3 rounded-2xl text-xs font-black text-white bg-emerald-500 hover:bg-emerald-600 shadow-md transition flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Enviar Recibo pelo WhatsApp
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setReceiptModal({ ...receiptModal, isOpen: false })}
              className="px-4 py-3 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              Fechar
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-3 rounded-2xl text-xs font-black text-white bg-slate-950 hover:bg-slate-800 shadow-md transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Imprimir / Salvar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
