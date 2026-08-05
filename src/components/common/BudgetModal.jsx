import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileSpreadsheet, X, Plus, Trash2, Calendar, Printer, Share2, CheckCircle2 } from 'lucide-react';

export const BudgetModal = () => {
  const { budgetModal, setBudgetModal, servicos, produtos, activeEmpresa, addAgendamento, openWhatsappModal } = useApp();

  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [itensServicos, setItensServicos] = useState([]);
  const [itensProdutos, setItensProdutos] = useState([]);

  if (!budgetModal.isOpen) return null;

  const handleAddServico = (servicoId) => {
    const serv = servicos.find(s => s.id === servicoId);
    if (serv) {
      setItensServicos([...itensServicos, serv]);
    }
  };

  const handleAddProduto = (produtoId) => {
    const prod = produtos.find(p => p.id === produtoId);
    if (prod) {
      setItensProdutos([...itensProdutos, prod]);
    }
  };

  const totalServicos = itensServicos.reduce((acc, s) => acc + s.preco, 0);
  const totalProdutos = itensProdutos.reduce((acc, p) => acc + p.precoVenda, 0);
  const totalGeral = totalServicos + totalProdutos;

  const handleConvertAppointment = () => {
    if (!clienteNome) {
      alert('Por favor informe o nome do cliente');
      return;
    }
    if (itensServicos.length === 0) {
      alert('Selecione pelo menos um serviço para converter em agendamento.');
      return;
    }

    const servicoPrincipal = itensServicos[0];
    const today = new Date().toISOString().split('T')[0];

    addAgendamento({
      clienteNome,
      clienteTelefone,
      servicoId: servicoPrincipal.id,
      servicoNome: servicoPrincipal.nome,
      funcionarioId: 'func-1', // Default staff
      funcionarioNome: 'Carlos "Viking" Silva',
      data: today,
      horario: '15:00',
      valor: totalGeral,
      observacoes: `Orçamento convertido. Inclui ${itensProdutos.length} produtos.`
    });

    alert('🎉 Orçamento convertido com sucesso em novo agendamento!');
    setBudgetModal({ isOpen: false });
  };

  const handleSendWhatsapp = () => {
    const msg = `Olá ${clienteNome || 'Cliente'}! Segue o Orçamento da ${activeEmpresa.nome}.\nTotal Serviços: R$ ${totalServicos.toFixed(2)}\nTotal Produtos: R$ ${totalProdutos.toFixed(2)}\nTotal Geral: R$ ${totalGeral.toFixed(2)}`;
    openWhatsappModal(clienteTelefone, clienteNome, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-scaleUp max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-600 to-emerald-500 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Gerador de Orçamento Profissional</h3>
              <p className="text-xs text-sky-100">Adicione serviços e produtos para calcular a proposta</p>
            </div>
          </div>
          <button 
            onClick={() => setBudgetModal({ isOpen: false })}
            className="p-1 rounded-full hover:bg-white/20 text-white/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Customer Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Cliente</label>
              <input
                type="text"
                placeholder="Ex: João da Silva"
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Telefone</label>
              <input
                type="text"
                placeholder="(11) 99999-8888"
                value={clienteTelefone}
                onChange={(e) => setClienteTelefone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          {/* Add Services */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                1. Serviços da Proposta
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) handleAddServico(e.target.value);
                  e.target.value = '';
                }}
                className="px-3 py-1.5 rounded-xl border border-cyan-200 text-xs font-semibold text-cyan-700 bg-cyan-50 outline-none"
              >
                <option value="">+ Selecionar Serviço...</option>
                {servicos.map(s => (
                  <option key={s.id} value={s.id}>{s.nome} - R$ {s.preco.toFixed(2)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {itensServicos.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl">Nenhum serviço adicionado.</p>
              ) : (
                itensServicos.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-bold text-slate-800">{s.nome}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900">R$ {s.preco.toFixed(2)}</span>
                      <button onClick={() => setItensServicos(itensServicos.filter((_, i) => i !== idx))} className="text-rose-500 hover:text-rose-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Products */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                2. Produtos Recomendados
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) handleAddProduto(e.target.value);
                  e.target.value = '';
                }}
                className="px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-700 bg-emerald-50 outline-none"
              >
                <option value="">+ Selecionar Produto...</option>
                {produtos.map(p => (
                  <option key={p.id} value={p.id}>{p.nome} - R$ {p.precoVenda.toFixed(2)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {itensProdutos.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl">Nenhum produto adicionado.</p>
              ) : (
                itensProdutos.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-bold text-slate-800">{p.nome}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900">R$ {p.precoVenda.toFixed(2)}</span>
                      <button onClick={() => setItensProdutos(itensProdutos.filter((_, i) => i !== idx))} className="text-rose-500 hover:text-rose-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Budget Total Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400">VALOR TOTAL ESTIMADO</p>
              <p className="text-2xl font-black text-emerald-400">R$ {totalGeral.toFixed(2)}</p>
            </div>
            <button
              onClick={handleConvertAppointment}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2 hover:opacity-95"
            >
              <Calendar className="w-4 h-4" /> Converter em Agendamento
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <button
            onClick={handleSendWhatsapp}
            className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Enviar WhatsApp
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setBudgetModal({ isOpen: false })}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
            >
              Fechar
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Imprimir Orçamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
