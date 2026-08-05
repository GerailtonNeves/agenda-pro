import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileSpreadsheet, Plus, Printer, Share2 } from 'lucide-react';

export const OrcamentosView = () => {
  const { openBudgetModal } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-cyan-600" /> Propostas Comerciais & Orçamentos
          </h2>
          <p className="text-xs text-slate-400">Combine serviços + produtos e converta propostas em agendamentos em 1 clique</p>
        </div>

        <button
          onClick={() => openBudgetModal()}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white font-extrabold text-xs shadow-md shadow-cyan-500/20 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Criar Novo Orçamento
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center space-y-4">
        <FileSpreadsheet className="w-16 h-16 text-cyan-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Gerador de Orçamentos Dinâmico Ativo</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Clique no botão acima para abrir a central de cálculo de orçamentos. Você poderá selecionar serviços, produtos do estoque e converter a proposta em agendamento confirmado!
        </p>
        <button
          onClick={() => openBudgetModal()}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-md"
        >
          Abrir Construtor de Orçamento
        </button>
      </div>
    </div>
  );
};
