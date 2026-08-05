import React from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, Printer, Share2, Eye, CheckCircle2 } from 'lucide-react';

export const RecibosView = () => {
  const { agendamentos, openReceiptModal, openWhatsappModal, activeEmpresa } = useApp();

  const recibosList = agendamentos.filter(a => a.status === 'concluido' || a.status === 'agendado' || a.status === 'confirmado');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 flex items-center gap-2.5">
            <Receipt className="w-8 h-8 text-emerald-600" /> Emissão de Recibos Profissionais PDF
          </h2>
          <p className="text-sm text-slate-600 font-extrabold mt-1">
            Gere, edite, reimprima e compartilhe recibos digitais instantâneos via WhatsApp para seus clientes
          </p>
        </div>
      </div>

      {/* Receipts Table with Larger Fonts */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-x-auto">
        <h3 className="font-black text-xl text-slate-950 border-b border-slate-100 pb-4 mb-4">
          Histórico de Recibos de Atendimento ({recibosList.length})
        </h3>

        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-black uppercase text-xs">
              <th className="py-3.5 px-4">Nº Recibo</th>
              <th className="py-3.5 px-4">Cliente</th>
              <th className="py-3.5 px-4">Serviço Prestado</th>
              <th className="py-3.5 px-4">Profissional</th>
              <th className="py-3.5 px-4">Data / Hora</th>
              <th className="py-3.5 px-4">Valor Pago (R$)</th>
              <th className="py-3.5 px-4 text-right">Ações de Recibo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-950 font-bold">
            {recibosList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-500 text-sm font-semibold">
                  Nenhum recibo emitido no momento.
                </td>
              </tr>
            ) : (
              recibosList.map(age => (
                <tr key={age.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-4 font-mono font-black text-slate-950 text-base">
                    #{age.id.toUpperCase()}
                  </td>
                  <td className="py-4 px-4 font-black text-slate-950 text-base">
                    {age.clienteNome}
                    <span className="block text-xs text-slate-500 font-bold">{age.clienteTelefone}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-800 font-bold text-sm">{age.servicoNome}</td>
                  <td className="py-4 px-4 text-slate-800 font-bold text-sm">{age.funcionarioNome}</td>
                  <td className="py-4 px-4 font-mono font-black text-slate-900 text-sm">{age.data} às {age.horario}</td>
                  <td className="py-4 px-4 font-black text-emerald-600 text-lg">
                    R$ {age.valor.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openReceiptModal(age)}
                        className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs transition inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Printer className="w-4 h-4" /> Ver / Imprimir PDF
                      </button>

                      <button
                        onClick={() => {
                          const msg = `🧾 *RECIBO DE ATENDIMENTO - ${activeEmpresa.nome}*\n` +
                            `----------------------------------------\n` +
                            `👤 *Cliente:* ${age.clienteNome}\n` +
                            `✂️ *Serviço:* ${age.servicoNome}\n` +
                            `💈 *Profissional:* ${age.funcionarioNome}\n` +
                            `📅 *Data/Hora:* ${age.data} às ${age.horario}\n` +
                            `💳 *Valor Pago:* R$ ${age.valor.toFixed(2)}\n` +
                            `----------------------------------------\n` +
                            `Obrigado pela preferência! 😊`;
                          openWhatsappModal(age.clienteWhatsapp || age.clienteTelefone, age.clienteNome, msg);
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-black text-xs transition inline-flex items-center gap-1 border border-emerald-300"
                        title="Enviar via WhatsApp"
                      >
                        <Share2 className="w-4 h-4 text-emerald-700" /> WhatsApp
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
