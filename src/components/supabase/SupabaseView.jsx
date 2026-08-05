import React, { useState } from 'react';
import { SUPABASE_SQL_SCHEMA } from '../../services/supabaseSchema';
import { saveSupabaseConfig, isSupabaseConfigured, clearSupabaseConfig, getSupabaseClient } from '../../services/supabaseClient';
import { Database, Copy, Check, ShieldCheck, Terminal, Server, Key, Activity, AlertTriangle, RefreshCw } from 'lucide-react';

export const SupabaseView = () => {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(localStorage.getItem('saas_supabase_url') || '');
  const [key, setKey] = useState(localStorage.getItem('saas_supabase_anon_key') || '');
  const [isSaved, setIsSaved] = useState(isSupabaseConfigured());
  
  // Connection Test State
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCredentials = (e) => {
    e.preventDefault();
    if (!url || !key) {
      alert('⚠️ Preencha a URL e a Anon Key do Supabase.');
      return;
    }
    if (saveSupabaseConfig(url, key)) {
      setIsSaved(true);
      handleTestConnection();
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const startTime = Date.now();

    try {
      const client = getSupabaseClient();
      if (!client) {
        setTestResult({
          sucesso: false,
          mensagem: '❌ URL ou Key inválidas no cliente Supabase. Verifique se os dados estão corretos.'
        });
        setTesting(false);
        return;
      }

      // Perform a ping / query test
      const { data, error } = await client.from('empresas').select('count', { count: 'exact', head: true });
      const latency = Date.now() - startTime;

      if (error && error.code !== 'PGRST116') {
        // If table doesn't exist yet, give helpful instruction
        if (error.message && error.message.toLowerCase().includes('does not exist')) {
          setTestResult({
            sucesso: true,
            isTableMissing: true,
            mensagem: `⚠️ Conectado à API Supabase (${latency}ms), porém as tabelas ainda não foram criadas! Clique no botão verde "Copiar Todo o Script SQL" acima e rode no SQL Editor do Supabase.`
          });
        } else {
          setTestResult({
            sucesso: false,
            mensagem: `❌ Erro ao comunicar com a nuvem: ${error.message || error.details}`
          });
        }
      } else {
        setTestResult({
          sucesso: true,
          mensagem: `🟢 Conexão com a Nuvem Supabase Ativa & Respondendo em ${latency}ms! Celulares e Computadores sincronizados.`
        });
      }
    } catch (err) {
      setTestResult({
        sucesso: false,
        mensagem: `❌ Falha ao tentar conectar: ${err.message}`
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-950">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-emerald-500/20">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-emerald-500/20 rounded-2xl border border-emerald-400/30 text-emerald-300">
              <Database className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-400/30">
              Pronto para Supabase + PostgreSQL
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black">Gerador de Script SQL & Conexão Supabase</h2>
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
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg text-slate-950 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-600" /> Credenciais da sua Conta Supabase
          </h3>
          {isSaved && (
            <span className="px-3.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full flex items-center gap-1.5 border border-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Credenciais Salvas
            </span>
          )}
        </div>

        <form onSubmit={handleSaveCredentials} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
          <div>
            <label className="block text-slate-700 mb-1 flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-slate-400" /> Supabase Project URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://seu-projeto.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-300 font-mono text-sm text-slate-950 outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-slate-400" /> Supabase anon key / Public Key *
            </label>
            <input
              type="password"
              required
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-300 font-mono text-sm text-slate-950 outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !url || !key}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xs transition flex items-center gap-2 shadow-sm"
            >
              {testing ? <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" /> : <Activity className="w-4 h-4 text-emerald-400" />}
              {testing ? 'Testando Conexão...' : '⚡ Testar Conexão em Tempo Real'}
            </button>

            <div className="flex items-center gap-2">
              {isSaved && (
                <button
                  type="button"
                  onClick={() => { clearSupabaseConfig(); setIsSaved(false); setUrl(''); setKey(''); setTestResult(null); }}
                  className="px-4 py-3 rounded-xl text-rose-700 hover:bg-rose-50 font-bold border border-rose-200"
                >
                  Desconectar
                </button>
              )}

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-md uppercase tracking-wider"
              >
                Salvar Conexão
              </button>
            </div>
          </div>
        </form>

        {/* TEST RESULT FEEDBACK BADGE */}
        {testResult && (
          <div className={`p-4 rounded-2xl text-xs font-black border animate-scaleUp flex items-center gap-3 ${
            testResult.sucesso && !testResult.isTableMissing
              ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
              : testResult.isTableMissing
              ? 'bg-amber-100 text-amber-950 border-amber-300'
              : 'bg-rose-100 text-rose-950 border-rose-300'
          }`}>
            {testResult.sucesso ? <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" /> : <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0" />}
            <div>{testResult.mensagem}</div>
          </div>
        )}
      </div>
    </div>
  );
};
