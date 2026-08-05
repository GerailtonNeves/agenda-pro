import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Plus, MessageSquare, Phone, Calendar, DollarSign, Edit3, Trash2, X } from 'lucide-react';

export const ClientesView = () => {
  const { clientes, saveCliente, deleteCliente, openWhatsappModal } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingCli, setEditingCli] = useState(null);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const openCreateModal = () => {
    setEditingCli(null);
    setNome('');
    setTelefone('');
    setWhatsapp('');
    setEmail('');
    setCpf('');
    setObservacoes('');
    setShowModal(true);
  };

  const openEditModal = (cli) => {
    setEditingCli(cli);
    setNome(cli.nome || '');
    setTelefone(cli.telefone || '');
    setWhatsapp(cli.whatsapp || cli.telefone || '');
    setEmail(cli.email || '');
    setCpf(cli.cpf || '');
    setObservacoes(cli.observacoes || '');
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveCliente({
      id: editingCli?.id,
      nome,
      telefone,
      whatsapp: whatsapp || telefone,
      email,
      cpf,
      observacoes
    });
    setShowModal(false);
  };

  const handleDelete = (id, nomeCliente) => {
    if (window.confirm(`Tem certeza que deseja excluir o cadastro do cliente "${nomeCliente}"?`)) {
      deleteCliente(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 flex items-center gap-2.5">
            <Users className="w-8 h-8 text-cyan-600" /> Cadastros & CRM de Clientes
          </h2>
          <p className="text-sm text-slate-600 font-extrabold mt-1">
            Histórico completo de atendimentos, total gasto, edição de cadastros e observações personalizadas
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white font-black text-sm shadow-md shadow-cyan-500/20 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Cadastrar Cliente
        </button>
      </div>

      {/* Customer List Table with Edit and Delete Options */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-black uppercase text-xs">
              <th className="py-3.5 px-4">Cliente</th>
              <th className="py-3.5 px-4">Contato & WhatsApp</th>
              <th className="py-3.5 px-4">Histórico Atendimentos</th>
              <th className="py-3.5 px-4">Total Gasto (R$)</th>
              <th className="py-3.5 px-4">Último Atendimento</th>
              <th className="py-3.5 px-4 text-right">Ações & Edição</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-950 font-bold">
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500 text-sm font-semibold">
                  Nenhum cliente cadastrado. Clique em "+ Cadastrar Cliente" para adicionar.
                </td>
              </tr>
            ) : (
              clientes.map(cli => (
                <tr key={cli.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-900 font-black flex items-center justify-center text-base overflow-hidden border border-cyan-200 shadow-xs flex-shrink-0">
                        {cli.foto ? (
                          <img src={cli.foto} alt={cli.nome} className="w-full h-full object-cover" />
                        ) : (
                          cli.nome.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-base text-slate-950">{cli.nome}</h4>
                        <span className="text-xs text-slate-500 font-mono font-extrabold">CPF: {cli.cpf || 'Não informado'}</span>
                        {cli.observacoes && (
                          <p className="text-xs text-cyan-800 font-bold line-clamp-1 italic">Obs: {cli.observacoes}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-800">
                    <span className="font-extrabold text-sm block">{cli.telefone || 'Sem telefone'}</span>
                    <span className="text-xs text-slate-500 font-semibold">{cli.email || 'Sem e-mail'}</span>
                  </td>
                  <td className="py-4 px-4 font-black text-slate-950 text-base">
                    {cli.atendimentosCount || 0} visitas
                  </td>
                  <td className="py-4 px-4 font-black text-emerald-600 text-base">
                    R$ {(cli.valorTotalGasto || 0).toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-slate-800 font-bold">
                    {cli.ultimoAtendimento || 'Nenhum recente'}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openWhatsappModal(cli.whatsapp || cli.telefone, cli.nome, `Olá ${cli.nome}! Como podemos ajudar você hoje?`)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-950 hover:bg-emerald-200 font-black text-xs transition inline-flex items-center gap-1 shadow-xs"
                        title="Enviar mensagem no WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" /> WhatsApp
                      </button>

                      <button
                        onClick={() => openEditModal(cli)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-950 font-black text-xs transition inline-flex items-center gap-1 border border-slate-300 shadow-xs"
                        title="Editar cadastro do cliente"
                      >
                        <Edit3 className="w-4 h-4" /> Editar
                      </button>

                      <button
                        onClick={() => handleDelete(cli.id, cli.nome)}
                        className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-black text-xs transition inline-flex items-center border border-rose-200"
                        title="Excluir cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form for Creating / Editing Customer */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scaleUp">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-600 to-emerald-500 text-white flex justify-between items-center">
              <h3 className="font-black text-lg">{editingCli ? 'Editar Cadastro do Cliente' : 'Cadastrar Novo Cliente'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-sm font-semibold text-slate-950">
              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Nome Completo do Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Amanda Lima"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-base outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Telefone / Celular</label>
                  <input
                    type="text"
                    placeholder="(11) 98888-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-base outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    placeholder="5511988880000"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-base outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="cliente@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Observações do Cliente</label>
                <textarea
                  rows={3}
                  placeholder="Preferências, corte favorito, café sem açúcar..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-300 text-slate-950 font-semibold text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                />
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
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
