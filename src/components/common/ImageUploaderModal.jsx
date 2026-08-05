import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, Image as ImageIcon, X, Check, Link as LinkIcon } from 'lucide-react';

export const ImageUploaderModal = () => {
  const { imageUploadModal, setImageUploadModal } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'url'
  const [isCompressing, setIsCompressing] = useState(false);

  if (!imageUploadModal.isOpen) return null;

  // Compress image to max 600px width/height and 80% JPEG quality to fit safely in memory/storage
  const compressImage = (dataUrl, callback) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_SIZE = 600;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_SIZE) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedUrl = canvas.toDataURL('image/jpeg', 0.82);
      callback(compressedUrl);
    };
    img.onerror = () => {
      callback(dataUrl);
    };
    img.src = dataUrl;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsCompressing(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        compressImage(reader.result, (compressed) => {
          setPreviewUrl(compressed);
          setIsCompressing(false);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    try {
      const finalUrl = activeTab === 'upload' ? (previewUrl || imageUploadModal.currentImage) : (inputUrl || imageUploadModal.currentImage);
      if (imageUploadModal.onSave) {
        imageUploadModal.onSave(finalUrl);
      }
    } catch (err) {
      console.error('Error saving image:', err);
    } finally {
      setImageUploadModal(prev => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-md">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{imageUploadModal.title || 'Foto do Funcionário'}</h3>
              <p className="text-xs text-sky-100">Adicione uma foto para personalizar o card no sistema</p>
            </div>
          </div>
          <button 
            onClick={() => setImageUploadModal({ ...imageUploadModal, isOpen: false })}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-cyan-500 text-cyan-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Upload className="w-4 h-4" /> Upload do Computador / Celular
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'url'
                ? 'border-cyan-500 text-cyan-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <LinkIcon className="w-4 h-4" /> Link URL Externo
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {activeTab === 'upload' ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-sky-200 hover:border-cyan-500 bg-sky-50/30 rounded-2xl p-6 text-center transition-all cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden" 
                  id="modal-file-input"
                />
                <label htmlFor="modal-file-input" className="cursor-pointer block">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                  <p className="font-semibold text-sm text-slate-700 mb-1">
                    {isCompressing ? 'Otimizando imagem...' : 'Clique aqui para selecionar uma foto'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Otimização automática ativada (máx. 600px)
                  </p>
                </label>
              </div>

              {previewUrl && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" /> Imagem pronta para uso:
                  </p>
                  <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label htmlFor="modal-file-input" className="px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-lg cursor-pointer shadow-lg hover:bg-slate-100">
                        Trocar Foto
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">URL Direta da Imagem</label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/sua-foto.jpg"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                />
              </div>

              {inputUrl && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2">Pré-visualização do Link:</p>
                  <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img 
                      src={inputUrl} 
                      alt="Preview Link" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'; }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Current Photo preview if available */}
          {!previewUrl && !inputUrl && imageUploadModal.currentImage && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-400 mb-1">Foto Atual do Card:</p>
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                <img src={imageUploadModal.currentImage} alt="Atual" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={() => setImageUploadModal({ ...imageUploadModal, isOpen: false })}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isCompressing}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 shadow-md shadow-cyan-500/20 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> Salvar Foto no Card
          </button>
        </div>
      </div>
    </div>
  );
};
