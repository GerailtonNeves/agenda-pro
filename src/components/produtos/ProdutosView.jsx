import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Plus, Camera, AlertTriangle, DollarSign, TrendingUp, Edit3, Trash2, X, Check, ShoppingBag } from 'lucide-react';

export const ProdutosView = () => {
  const { produtos, saveProduto, deleteProduto, openImageUploader } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingProd, setEditingProd] = useState(null);

  // Form State
  const [nome, setNome] = useState('');
  const [foto, setFoto] = useState('');
  const [categoria, setCategoria] = useState('Pomadas & Cosmeticos');
  const [precoCusto, setPrecoCusto] = useState(20);
  const [precoVenda, setPrecoVenda] = useState(50);
  const [estoqueAtual, setEstoqueAtual] = useState(15);
  const [estoqueMinimo, setEstoqueMinimo] = useState(5);

  const openCreateModal = () => {
    setEditingProd(null);
    setNome('');
    setFoto('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400');
    setCategoria('Pomadas & Cosméticos');
    setPrecoCusto(20);
    setPrecoVenda(50);
    setEstoqueAtual(15);
    setEstoqueMinimo(5);
    setShowModal(true);
  };

  const openEditModal = (prod) => {
    setEditingProd(prod);
    setNome(prod.nome);
    setFoto(prod.foto);
    setCategoria(prod.categoria || 'Geral');
    setPrecoCusto(prod.precoCusto || 0);
    setPrecoVenda(prod.precoVenda || 0);
    setEstoqueAtual(prod.estoqueAtual || 0);
    setEstoqueMinimo(prod.estoqueMinimo || 5);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveProduto({
      id: editingProd?.id,
      nome,
      foto,
      categoria,
      precoCusto: Number(precoCusto) || 0,
      precoVenda: Number(precoVenda) || 0,
      estoqueAtual: Number(estoqueAtual) || 0,
      estoqueMinimo: Number(estoqueMinimo) || 5
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 flex items-center gap-2.5">
            <Package className="w-8 h-8 text-cyan-600" /> Produtos & Controle de Estoque
          </h2>
          <p className="text-sm text-slate-600 font-extrabold mt-1">
            Controle de preço de custo, preço de venda, margem de lucro e alertas automáticos de reposição
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white font-black text-sm shadow-md shadow-cyan-500/20 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Cadastrar Produto
        </button>
      </div>

      {/* Product Cards Grid with Full Image Display (object-contain) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {produtos.map(prod => {
          const lucro = (prod.precoVenda || 0) - (prod.precoCusto || 0);
          const margemPct = prod.precoCusto > 0 ? ((lucro / prod.precoCusto) * 100).toFixed(0) : 100;
          const isLowStock = prod.estoqueAtual <= (prod.estoqueMinimo || 5);

          return (
            <div 
              key={prod.id} 
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Product Image Container (object-contain so 100% of product is visible without cropping) */}
              <div className="relative h-60 overflow-hidden bg-slate-50/90 p-4 border-b border-slate-200 flex items-center justify-center">
                <img 
                  src={prod.foto} 
                  alt={prod.nome} 
                  className="max-h-full max-w-full object-contain rounded-xl group-hover:scale-105 transition duration-500 drop-shadow-md" 
                />
                
                <button
                  onClick={() => openImageUploader('Foto do Produto', prod.foto, (newUrl) => saveProduto({ ...prod, foto: newUrl }))}
                  className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs font-black text-white gap-2"
                >
                  <Camera className="w-6 h-6" /> Alterar Foto do Produto
                </button>

                <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900/90 backdrop-blur-md text-white border border-white/20 shadow-sm">
                  {prod.categoria || 'Cosméticos'}
                </span>

                {isLowStock ? (
                  <span className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-xs font-black bg-rose-500 text-white shadow-md flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-4 h-4" /> Repor Estoque!
                  </span>
                ) : (
                  <span className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500 text-white shadow-md flex items-center gap-1">
                    <Check className="w-4 h-4" /> Estoque Ok
                  </span>
                )}
              </div>

              {/* Card Main Body */}
              <div className="p-6 space-y-4 flex-1">
                <div>
                  <h3 className="font-black text-xl text-slate-950 leading-tight">{prod.nome}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Quantidade em Estoque:</span>
                    <span className={`text-base font-black px-3 py-1 rounded-xl ${isLowStock ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-950'}`}>
                      {prod.estoqueAtual} unidades
                    </span>
                  </div>
                </div>

                {/* Profitability Summary Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                    <span>Preço de Custo:</span>
                    <span className="font-black text-slate-900">R$ {(prod.precoCusto || 0).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                    <span>Preço de Venda ao Cliente:</span>
                    <span className="text-2xl font-black text-emerald-600">
                      R$ {(prod.precoVenda || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs font-black">
                    <span className="text-slate-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-emerald-600" /> Lucro por Unidade:
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-950 text-sm font-black">
                      + R$ {lucro.toFixed(2)} ({margemPct}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => openEditModal(prod)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-950 text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Edit3 className="w-4 h-4" /> Editar Produto
                </button>
                <button
                  onClick={() => deleteProduto(prod.id)}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 text-xs font-extrabold transition flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scaleUp">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-600 to-emerald-500 text-white flex justify-between items-center">
              <h3 className="font-black text-lg">{editingProd ? 'Editar Produto' : 'Cadastrar Produto'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-sm font-semibold text-slate-950">
              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pomada Modeladora Matte 150g"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-base outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-950 mb-1">Categoria</label>
                <input
                  type="text"
                  placeholder="Ex: Pomadas & Cosméticos"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Preço de Custo (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={precoCusto}
                    onChange={(e) => setPrecoCusto(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-black text-base outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-emerald-700 mb-1">Preço de Venda (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={precoVenda}
                    onChange={(e) => setPrecoVenda(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-400 text-slate-950 font-black text-base outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Estoque Atual *</label>
                  <input
                    type="number"
                    required
                    value={estoqueAtual}
                    onChange={(e) => setEstoqueAtual(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-black text-base outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Estoque Mínimo (Alerta)</label>
                  <input
                    type="number"
                    required
                    value={estoqueMinimo}
                    onChange={(e) => setEstoqueMinimo(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-black text-base outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
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
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
