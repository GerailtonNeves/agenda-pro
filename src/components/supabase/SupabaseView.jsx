import React, { useState } from 'react';
import { SUPABASE_SQL_SCHEMA } from '../../services/supabaseSchema';
import { saveSupabaseConfig, isSupabaseConfigured, clearSupabaseConfig } from '../../services/supabaseClient';
import { Database, Copy, Check, ShieldCheck, Terminal, Server, Key } from 'lucide-react';

export const SupabaseView = () => {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(localStorage.getItem('saas_supabase_url') || '');
  const [key, setKey] = useState(localStorage.getItem('saas_supabase_anon_key') || '');
  const [isSaved, setIsSaved] = useState(isSupabaseConfigured());

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCredentials = (e) => {
    e.preventDefault();
    if (saveSupabaseConfig(url, key)) {
      setIsSaved(true);
      alert('🎉 Conexão Supabase salva com sucesso!');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-emerald-500/20">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-emerald-500/20 rounded-2xl border border-emerald-400/30 text-emerald-300">
              <Database className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-400/30">
              Pronto para Supabase + PostgreSQL
            </span>
          </div>
          <h2 className="text-3xl font-black">Gerador de Script SQL & Conexão Supabase</h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Tabelas completas com Foreign Keys, Triggers de comissão automatizada, Views e Row Level Security (RLS) para isolar empresas 100% no banco de dados.
          </p>
        </div>

        <button
          onClick={handleCopySql}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition hover:scale-105 flex items-center gap-2 flex-shrink-0"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'SQL Copiado com Sucesso!' : 'Copiar Todo o Script SQL'}
        </button>
      </div>

      {/* Supabase Config Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-600" /> Credenciais da sua Conta Supabase
          </h3>
          {isSaved && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Conectado ao Supabase
            </span>
          )}
        </div>

        <form onSubmit={handleSaveCredentials} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-slate-400" /> Supabase Project URL
            </label>
            <input
              type="url"
              placeholder="https://seu-projeto.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-slate-400" /> Supabase anon key / Public Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2">
            {isSaved && (
              <button
                type="button"
                onClick={() => { clearSupabaseConfig(); setIsSaved(false); setUrl(''); setKey(''); }}
                className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-semibold"
              >
                Desconectar
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-white font-bold bg-emerald-600 hover:bg-emerald-700 shadow-md"
            >
              Salvar Conexão Supabase
            </button>
          </div>
        </form>
      </div>

      {/* Code Viewer Box */}
      <div className="bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
            <Terminal className="w-4 h-4" /> schema_supabase_multitenant.sql
          </div>
          <button
            onClick={handleCopySql}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> Copiar
          </button>
        </div>

        <div className="p-6 max-h-[500px] overflow-y-auto font-mono text-[11px] leading-relaxed text-emerald-300/90 whitespace-pre-wrap select-all">
          {SUPABASE_SQL_SCHEMA}
        </div>
      </div>
    </div>
  );
};
