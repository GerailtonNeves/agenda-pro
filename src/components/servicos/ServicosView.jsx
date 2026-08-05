import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scissors, Plus, Camera, Clock, DollarSign, Edit3, Trash2, X, Globe, Home, UserCheck } from 'lucide-react';

export const ServicosView = () => {
  const { servicos, saveServico, deleteServico, openImageUploader } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingServico, setEditingServico] = useState(null);

  // Form State
  const [nome, setNome] = useState('');
  const [foto, setFoto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState(50);
  const [duracaoMinutos, setDuracaoMinutos] = useState(30);
  const [modalidade, setModalidade] = useState('Presencial');
  const [cor, setCor] = useState('#0284c7');

  const openCreateModal = () => {
    setEditingServico(null);
    setNome('');
    setFoto('https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400');
    setCategoria('Geral');
    setDescricao('');
    setPreco(50);
    setDuracaoMinutos(30);
    setModalidade('Presencial');
    setCor('#0284c7');
    setShowModal(true);
  };

  const openEditModal = (serv) => {
    setEditingServico(serv);
    setNome(serv.nome);
    setFoto(serv.foto);
    setCategoria(serv.categoria);
    setDescricao(serv.descricao || '');
    setPreco(serv.preco);
    setDuracaoMinutos(serv.duracaoMinutos);
    setModalidade(serv.modalidade || 'Presencial');
    setCor(serv.cor || '#0284c7');
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveServico({
      id: editingServico?.id,
      nome,
      foto,
      categoria,
      descricao,
      preco: Number(preco) || 0,
      duracaoMinutos: Number(duracaoMinutos) || 30,
      modalidade,
      cor
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2">
            <Scissors className="w-7 h-7 text-cyan-600" /> Cadastros de Serviços
          </h2>
          <p className="text-sm text-slate-600 font-medium">Configure preços, tempos, fotos nos cards e modalidades (Presencial, Online, Domicílio)</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white font-extrabold text-sm shadow-md shadow-cyan-500/20 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Cadastrar Serviço
        </button>
      </div>

      {/* Services Grid with Larger Fonts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicos.map(serv => (
          <div key={serv.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img src={serv.foto} alt={serv.nome} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <button
                onClick={() => openImageUploader('Foto do Card de Serviço', serv.foto, (newUrl) => saveServico({ ...serv, foto: newUrl }))}
                className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs font-bold text-white gap-1.5"
              >
                <Camera className="w-5 h-5" /> Trocar Foto
              </button>

              <span className="absolute top-3 left-3 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900/90 backdrop-blur-md text-white border border-white/20">
                {serv.categoria}
              </span>

              <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-md flex items-center gap-1">
                {serv.modalidade === 'Online' ? <Globe className="w-3.5 h-3.5" /> : serv.modalidade === 'Domicílio' ? <Home className="w-3.5 h-3.5" /> : <Scissors className="w-3.5 h-3.5" />}
                {serv.modalidade}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-950">{serv.nome}</h3>
                <p className="text-sm text-slate-700 font-medium mt-1 line-clamp-2">{serv.descricao || 'Sem descrição.'}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-700">
                  <Clock className="w-4 h-4 text-cyan-600" />
                  <span>{serv.duracaoMinutos} min</span>
                </div>
                <span className="text-2xl font-black text-emerald-600">
                  R$ {serv.preco.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => openEditModal(serv)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-900 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Edit3 className="w-4 h-4" /> Editar
              </button>
              <button
                onClick={() => deleteServico(serv.id)}
                className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 text-xs font-bold transition flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scaleUp">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-600 to-emerald-500 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-lg">{editingServico ? 'Editar Serviço' : 'Cadastrar Serviço'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-sm font-semibold text-slate-950">
              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Nome do Serviço *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Corte Premium"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-black text-base outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Duração (Minutos) *</label>
                  <input
                    type="number"
                    required
                    value={duracaoMinutos}
                    onChange={(e) => setDuracaoMinutos(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-black text-base outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Categoria</label>
                  <input
                    type="text"
                    placeholder="Ex: Cabelo, Barba, Estética"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Modalidade</label>
                  <select
                    value={modalidade}
                    onChange={(e) => setModalidade(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Online">Online</option>
                    <option value="Domicílio">Domicílio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
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
                  Salvar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
