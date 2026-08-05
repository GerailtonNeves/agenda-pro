import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

export const RelatoriosView = () => {
  const { agendamentos, clientes, funcionarios, financeiro } = useApp();

  const handleExportCSV = (reportName) => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Data,Nome,Valor\n1,2026-08-04,Relatorio Exemplo,150.00";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportName}_saas_agendamentos.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-600" /> Relatórios Executivos & Exportação
          </h2>
          <p className="text-xs text-slate-400">Exporte relatórios completos em PDF, Excel e CSV</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="p-3 bg-cyan-50 text-cyan-700 w-fit rounded-2xl">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Relatório de Agendamentos</h3>
          <p className="text-xs text-slate-500">Histórico completo de atendimentos, datas, horários e profissionais.</p>
          <button
            onClick={() => handleExportCSV('agendamentos')}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Exportar CSV / Excel
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 w-fit rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Relatório de Comissões</h3>
          <p className="text-xs text-slate-500">Extrato detalhado de ganhos de cada funcionário no mês.</p>
          <button
            onClick={() => handleExportCSV('comissoes_funcionarios')}
            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Exportar CSV / Excel
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="p-3 bg-sky-50 text-sky-700 w-fit rounded-2xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Relatório Financeiro & DRE</h3>
          <p className="text-xs text-slate-500">Balanço de receitas, despesas e lucro líquido do período.</p>
          <button
            onClick={() => handleExportCSV('financeiro_dre')}
            className="w-full py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Exportar CSV / Excel
          </button>
        </div>
      </div>
    </div>
  );
};
