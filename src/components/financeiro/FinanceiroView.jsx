import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Trash2, 
  TrendingUp, 
  Edit3, 
  Repeat, 
  Check, 
  Calendar,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';

export const FinanceiroView = () => {
  const { 
    financeiro, 
    saveFinanceiroItem, 
    toggleBaixaFinanceiroItem, 
    gerarRecorrenteProximoMes, 
    deleteFinanceiroItem, 
    funcionarios 
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterTipo, setFilterTipo] = useState('despesa'); // 'despesa' (Contas a Pagar), 'receita' (Contas a Receber), 'todos'
  const [filterStatusOnly, setFilterStatusOnly] = useState('todos'); // 'todos', 'pendente', 'pago'

  // Form State
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('despesa');
  const [categoria, setCategoria] = useState('Insumos');
  const [valor, setValor] = useState(100);
  const [dataVencimento, setDataVencimento] = useState(new Date().toISOString().split('T')[0]);
  const [formaPagamento, setFormaPagamento] = useState('PIX');
  const [status, setStatus] = useState('pendente');
  const [isRecorrente, setIsRecorrente] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const dateIn3Days = new Date();
  dateIn3Days.setDate(dateIn3Days.getDate() + 3);
  const dateIn3DaysStr = dateIn3Days.toISOString().split('T')[0];

  const openCreateModal = () => {
    setEditingItem(null);
    setDescricao('');
    setTipo(filterTipo === 'receita' ? 'receita' : 'despesa');
    setCategoria('Insumos');
    setValor(100);
    setDataVencimento(todayStr);
    setFormaPagamento('PIX');
    setStatus('pendente');
    setIsRecorrente(false);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setDescricao(item.descricao || '');
    setTipo(item.tipo || 'despesa');
    setCategoria(item.categoria || 'Geral');
    setValor(item.valor || 0);
    setDataVencimento(item.dataVencimento || todayStr);
    setFormaPagamento(item.formaPagamento || 'PIX');
    setStatus(item.status || 'pendente');
    setIsRecorrente(!!item.isRecorrente);
    setShowModal(true);
  };

  const totalReceitas = financeiro
    .filter(f => f.tipo === 'receita' && f.status === 'pago')
    .reduce((acc, f) => acc + f.valor, 0);

  const totalDespesas = financeiro
    .filter(f => f.tipo === 'despesa' && f.status === 'pago')
    .reduce((acc, f) => acc + f.valor, 0);

  const despesasPendentes = financeiro
    .filter(f => f.tipo === 'despesa' && f.status === 'pendente')
    .reduce((acc, f) => acc + f.valor, 0);

  const saldoCaixa = totalReceitas - totalDespesas;

  // Find overdue or upcoming bills (Vencidas ou a Vencer nos próximos 3 dias)
  const contasVencidas = financeiro.filter(f => f.tipo === 'despesa' && f.status === 'pendente' && f.dataVencimento < todayStr);
  const contasVencendoEmBreve = financeiro.filter(f => f.tipo === 'despesa' && f.status === 'pendente' && f.dataVencimento >= todayStr && f.dataVencimento <= dateIn3DaysStr);

  // Filter items by type (Contas a Pagar vs Contas a Receber vs Todos)
  const itemsFiltered = financeiro.filter(f => {
    const matchType = filterTipo === 'todos' || f.tipo === filterTipo;
    const matchStatus = filterStatusOnly === 'todos' || f.status === filterStatusOnly;
    return matchType && matchStatus;
  });

  // CHRONOLOGICAL SORTING: Earliest due date FIRST (vencer primeiro fica no topo!)
  const sortedItems = [...itemsFiltered].sort((a, b) => {
    if (a.dataVencimento === b.dataVencimento) {
      return a.status === 'pendente' ? -1 : 1; // Prioritize pending bills if dates match
    }
    return a.dataVencimento.localeCompare(b.dataVencimento);
  });

  const handleSave = (e) => {
    e.preventDefault();
    saveFinanceiroItem({
      id: editingItem?.id,
      descricao,
      tipo,
      categoria,
      valor: Number(valor) || 0,
      dataVencimento,
      dataPagamento: status === 'pago' ? (editingItem?.dataPagamento || todayStr) : null,
      status,
      formaPagamento,
      isRecorrente
    });
    setShowModal(false);
  };

  const handleDelete = (id, desc) => {
    if (window.confirm(`Tem certeza que deseja excluir o lançamento "${desc}"?`)) {
      deleteFinanceiroItem(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 flex items-center gap-2.5">
            <DollarSign className="w-8 h-8 text-emerald-600" /> Financeiro & Gestão de Caixas
          </h2>
          <p className="text-sm text-slate-600 font-extrabold mt-1">
            Contas a Pagar e Contas a Receber ordenadas por ordem de vencimento (vence primeiro no topo)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white font-black text-sm shadow-md shadow-cyan-500/20 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Novo Lançamento Financeiro
        </button>
      </div>

      {/* High-Priority Expiration Alert Banner */}
      {(contasVencidas.length > 0 || contasVencendoEmBreve.length > 0) && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-600 via-amber-600 to-amber-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-rose-400">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">
                ⚠️ Alerta Financeiro do Sistema: Contas Perto do Vencimento!
              </h3>
              <p className="text-sm font-bold text-amber-100 mt-0.5">
                Você possui <b className="underline underline-offset-2">{contasVencidas.length} conta(s) VENCIDA(S)</b> e <b className="underline underline-offset-2">{contasVencendoEmBreve.length} conta(s) vencendo nos próximos 3 dias</b>.
              </p>
            </div>
          </div>

          <button
            onClick={() => { setFilterTipo('despesa'); setFilterStatusOnly('pendente'); }}
            className="px-5 py-2.5 bg-white text-slate-950 rounded-2xl font-black text-xs shadow-md hover:bg-slate-100 transition whitespace-nowrap"
          >
            🔴 Ver Contas a Pagar Vencidas
          </button>
        </div>
      )}

      {/* Top Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Receitas Pagas</span>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-600">
            R$ {totalReceitas.toFixed(2)}
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Despesas Pagas</span>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <ArrowDownRight className="w-6 h-6" />
            </div>
          </div>
          <span className="text-3xl font-black text-rose-600">
            R$ {totalDespesas.toFixed(2)}
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black text-amber-600 uppercase tracking-wider">Despesas Pendentes</span>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <span className="text-3xl font-black text-amber-600">
            R$ {despesasPendentes.toFixed(2)}
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Saldo Real em Caixa</span>
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-300">
            R$ {saldoCaixa.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Chronologically Sorted Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="font-black text-xl text-slate-950 flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-sky-600" />
              {filterTipo === 'despesa' ? '🔴 Contas a Pagar (Ordenadas por Data de Vencimento)' : filterTipo === 'receita' ? '🟢 Contas a Receber (Ordenadas por Data de Vencimento)' : '📋 Visão Financeira Unificada'}
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-0.5">As contas que vencem primeiro ficam sempre posicionadas no topo da tabela</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Type Tabs */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setFilterTipo('despesa')}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition flex items-center gap-1.5 ${
                  filterTipo === 'despesa' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                🔴 Contas a Pagar
              </button>
              <button
                onClick={() => setFilterTipo('receita')}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition flex items-center gap-1.5 ${
                  filterTipo === 'receita' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                🟢 Contas a Receber
              </button>
              <button
                onClick={() => setFilterTipo('todos')}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                  filterTipo === 'todos' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                📋 Todos
              </button>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatusOnly}
              onChange={(e) => setFilterStatusOnly(e.target.value)}
              className="px-3.5 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-black text-slate-950 outline-none cursor-pointer"
            >
              <option value="todos">Todos os Status</option>
              <option value="pendente">⚡ Apenas Pendentes</option>
              <option value="pago">✅ Apenas Pagas</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-black uppercase text-xs">
                <th className="py-3.5 px-4">Descrição & Recorrência</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Data Vencimento ↑</th>
                <th className="py-3.5 px-4">Alerta de Vencimento</th>
                <th className="py-3.5 px-4">Valor (R$)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ações & Dar Baixa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-950 font-bold">
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 text-sm font-semibold">
                    Nenhum lançamento encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                sortedItems.map(item => {
                  const isPastDue = item.status === 'pendente' && item.dataVencimento < todayStr;
                  const isDueSoon = item.status === 'pendente' && item.dataVencimento >= todayStr && item.dataVencimento <= dateIn3DaysStr;

                  return (
                    <tr key={item.id} className={`transition ${isPastDue ? 'bg-rose-50/70 hover:bg-rose-100/80' : isDueSoon ? 'bg-amber-50/70 hover:bg-amber-100/80' : 'hover:bg-slate-50'}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-950 text-base">{item.descricao}</h4>
                          {item.isRecorrente && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-100 text-sky-900 flex items-center gap-1 border border-sky-300">
                              <Repeat className="w-3.5 h-3.5" /> Mensal
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-800 font-bold">{item.categoria}</td>
                      
                      <td className="py-4 px-4 font-mono font-black text-slate-950 text-base">
                        {item.dataVencimento}
                      </td>

                      {/* Expiration Warning Status Badge */}
                      <td className="py-4 px-4">
                        {isPastDue ? (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-xs flex items-center gap-1 w-max animate-pulse">
                            🚨 VENCIDA ({item.dataVencimento})
                          </span>
                        ) : isDueSoon ? (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow-xs flex items-center gap-1 w-max">
                            ⏰ VENCE EM BREVE
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold">Prazo Normal</span>
                        )}
                      </td>
                      
                      <td className={`py-4 px-4 font-black text-base ${item.tipo === 'receita' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.tipo === 'receita' ? '+' : '-'} R$ {item.valor.toFixed(2)}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase inline-flex items-center gap-1 ${
                          item.status === 'pago' ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-amber-100 text-amber-950 border border-amber-300'
                        }`}>
                          {item.status === 'pago' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                          {item.status === 'pago' ? 'Pago / Concluído' : 'Pendente'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Dar Baixa Button */}
                          <button
                            onClick={() => toggleBaixaFinanceiroItem(item.id)}
                            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition inline-flex items-center gap-1 shadow-xs ${
                              item.status === 'pago' 
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300' 
                                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                            }`}
                            title={item.status === 'pago' ? 'Reabrir Lançamento' : 'Dar Baixa (Marcar como Pago)'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {item.status === 'pago' ? 'Reabrir' : 'Dar Baixa'}
                          </button>

                          {/* Duplicate for next month if recurring */}
                          {item.isRecorrente && (
                            <button
                              onClick={() => gerarRecorrenteProximoMes(item)}
                              className="px-2.5 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-950 font-black text-xs transition flex items-center gap-1"
                              title="Duplicar para o Próximo Mês"
                            >
                              <Repeat className="w-4 h-4" /> +1 Mês
                            </button>
                          )}

                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 transition border border-slate-300"
                            title="Editar Lançamento"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(item.id, item.descricao)}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition border border-rose-200"
                            title="Excluir Lançamento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form for Creating / Editing Financial Entry */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scaleUp">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-600 to-emerald-500 text-white flex justify-between items-center">
              <h3 className="font-black text-lg">
                {editingItem ? 'Editar Lançamento Financeiro' : 'Novo Lançamento Financeiro'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-sm font-semibold text-slate-950">
              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Descrição do Lançamento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aluguel da Sala / Conta de Luz / Comissão"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-base outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Tipo *</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="despesa">🔴 Despesa (A Pagar)</option>
                    <option value="receita">🟢 Receita (A Receber)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Categoria *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Aluguel, Insumos, Salários"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-black text-base outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Data de Vencimento *</label>
                  <input
                    type="date"
                    required
                    value={dataVencimento}
                    onChange={(e) => setDataVencimento(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-black text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Forma de Pagamento</label>
                  <select
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="PIX">PIX</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Boleto Bancário">Boleto Bancário</option>
                    <option value="Dinheiro">Dinheiro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Status Inicial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="pendente">Pendente (Aguardando)</option>
                    <option value="pago">Pago / Concluído</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="recorrente"
                  checked={isRecorrente}
                  onChange={(e) => setIsRecorrente(e.target.checked)}
                  className="w-5 h-5 text-sky-600 rounded cursor-pointer"
                />
                <label htmlFor="recorrente" className="font-extrabold text-slate-950 cursor-pointer">
                  Despesa/Receita Recorrente Mensal
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-white font-extrabold text-sm bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 shadow-md"
                >
                  {editingItem ? 'Salvar Alterações' : 'Criar Lançamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
