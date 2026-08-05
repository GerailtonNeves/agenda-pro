import React from 'react';
import { useApp } from '../../context/AppContext';
import { HeaderCard } from '../common/HeaderCard';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  UserCheck, 
  Percent,
  Plus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const DashboardView = () => {
  const { agendamentos, funcionarios, servicos, clientes, financeiro, setCurrentView, openReceiptModal, openPaymentModal } = useApp();

  const totalAgendamentos = agendamentos.length;
  const agendamentosConcluidos = agendamentos.filter(a => a.status === 'concluido');
  const totalReceita = financeiro
    .filter(f => f.tipo === 'receita' && f.status === 'pago')
    .reduce((acc, f) => acc + f.valor, 0);

  const totalDespesas = financeiro
    .filter(f => f.tipo === 'despesa')
    .reduce((acc, f) => acc + f.valor, 0);

  const lucroLiquido = totalReceita - totalDespesas;

  const chartDataFaturamento = [
    { dia: 'Seg', receita: 450, despesa: 120 },
    { dia: 'Ter', receita: 620, despesa: 150 },
    { dia: 'Qua', receita: 580, despesa: 200 },
    { dia: 'Qui', receita: 890, despesa: 310 },
    { dia: 'Sex', receita: 1250, despesa: 420 },
    { dia: 'Sáb', receita: 1680, despesa: 550 },
    { dia: 'Dom', receita: 320, despesa: 50 },
  ];

  const statusCounts = [
    { name: 'Agendados', value: agendamentos.filter(a => a.status === 'agendado').length, color: '#0284c7' },
    { name: 'Confirmados', value: agendamentos.filter(a => a.status === 'confirmado').length, color: '#eab308' },
    { name: 'Concluídos', value: agendamentos.filter(a => a.status === 'concluido').length, color: '#10b981' },
    { name: 'Cancelados', value: agendamentos.filter(a => a.status === 'cancelado').length, color: '#ef4444' },
  ];

  const funcionariosEarnings = funcionarios.map(func => {
    const servicosRealizados = agendamentos.filter(a => a.funcionarioId === func.id && a.status === 'concluido');
    const totalGanhos = servicosRealizados.reduce((acc, a) => {
      const valComissao = a.comissaoValorCalculada || (a.valor * (func.comissaoPct / 100));
      return acc + valComissao;
    }, 0);

    return {
      ...func,
      qtdAtendimentos: servicosRealizados.length,
      totalGanhos
    };
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Premium Card */}
      <HeaderCard />

      {/* Main Stats Row - Larger Fonts & High Contrast */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Faturamento Total</span>
              <h3 className="text-3xl font-black text-slate-950 mt-1">
                R$ {totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 bg-cyan-50 text-cyan-700 rounded-2xl">
              <DollarSign className="w-7 h-7" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-extrabold">
            <ArrowUpRight className="w-5 h-5" />
            <span>+18.5% este mês</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Lucro Líquido</span>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">
                R$ {lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>
          <p className="text-xs text-slate-600 font-bold">Após deduções e comissões</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Total de Agendamentos</span>
              <h3 className="text-3xl font-black text-slate-950 mt-1">{totalAgendamentos}</h3>
            </div>
            <div className="p-3 bg-sky-50 text-sky-700 rounded-2xl">
              <Calendar className="w-7 h-7" />
            </div>
          </div>
          <span className="text-xs text-slate-700 font-extrabold">{agendamentosConcluidos.length} concluídos</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Clientes Ativos</span>
              <h3 className="text-3xl font-black text-slate-950 mt-1">{clientes.length}</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl">
              <Users className="w-7 h-7" />
            </div>
          </div>
          <span className="text-xs text-slate-700 font-extrabold">CRM Atualizado</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-black text-xl text-slate-950">Fluxo de Caixa Semanal (R$)</h3>
              <p className="text-sm text-slate-600 font-medium">Comparativo entre receitas de agendamentos e despesas de comissão</p>
            </div>
            <span className="px-3.5 py-1.5 bg-cyan-50 text-cyan-800 font-black text-xs rounded-full">Semana Atual</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataFaturamento}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dia" stroke="#64748b" fontSize={13} fontWeight="bold" tickLine={false} />
                <YAxis stroke="#64748b" fontSize={13} fontWeight="bold" tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="receita" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorReceita)" name="Receita (R$)" />
                <Area type="monotone" dataKey="despesa" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorDespesa)" name="Despesa/Comissão (R$)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-xl text-slate-950">Status dos Agendamentos</h3>
            <p className="text-sm text-slate-600 font-medium">Distribuição percentual da empresa</p>
          </div>

          <div className="h-52 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusCounts} dataKey="value" innerRadius={55} outerRadius={75} paddingAngle={4}>
                  {statusCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {statusCounts.map(st => (
              <div key={st.name} className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: st.color }} />
                <span className="text-slate-950 font-extrabold">{st.name}: <b>{st.value}</b></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Earnings & Upcoming Appointments with Larger Font Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-black text-lg text-slate-950 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-cyan-600" /> Desempenho dos Funcionários
              </h3>
              <p className="text-xs text-slate-500 font-bold">Comissões acumuladas no mês</p>
            </div>
            <button 
              onClick={() => setCurrentView('funcionarios')}
              className="text-xs font-black text-cyan-700 hover:text-cyan-800 uppercase tracking-wider"
            >
              Ver Todos
            </button>
          </div>

          <div className="space-y-3">
            {funcionariosEarnings.map(func => (
              <div key={func.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-300">
                    <img src={func.foto} alt={func.nome} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-950">{func.nome}</h4>
                    <span className="text-xs text-slate-600 font-extrabold">{func.cargo} • Comisión {func.comissaoPct}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm text-emerald-600 block">
                    R$ {func.totalGanhos.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-600 font-bold">{func.qtdAtendimentos} atedimentos</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments Table with text-sm/base font */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-black text-xl text-slate-950">Próximos Agendamentos</h3>
              <p className="text-sm text-slate-600 font-medium">Lista em tempo real da empresa</p>
            </div>
            <button
              onClick={() => setCurrentView('agenda')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Nova Agenda
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-black uppercase text-xs">
                  <th className="py-3 px-3">Cliente</th>
                  <th className="py-3 px-3">Serviço</th>
                  <th className="py-3 px-3">Profissional</th>
                  <th className="py-3 px-3">Data/Hora</th>
                  <th className="py-3 px-3">Valor</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-950 font-bold">
                {agendamentos.slice(0, 5).map(age => (
                  <tr key={age.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-3 font-extrabold text-slate-950">{age.clienteNome}</td>
                    <td className="py-3.5 px-3 text-slate-800 font-medium">{age.servicoNome}</td>
                    <td className="py-3.5 px-3 text-slate-800 font-semibold">{age.funcionarioNome}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">{age.data} às {age.horario}</td>
                    <td className="py-3.5 px-3 font-black text-slate-950 text-base">R$ {age.valor.toFixed(2)}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-3 py-1 rounded-full text-xs font-black uppercase" style={{ backgroundColor: `${age.corStatus}20`, color: age.corStatus }}>
                        {age.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => openReceiptModal(age)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
                      >
                        Recibo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
