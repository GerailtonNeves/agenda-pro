import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Phone, 
  Key, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Crown
} from 'lucide-react';

export const LoginView = () => {
  const { 
    loginUser, 
    registerUser, 
    recoverPasswordByEmail
  } = useApp();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'forgot'
  
  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);

  // Login Form State - ZERO AUTOFILL
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regNome, setRegNome] = useState('');
  const [regEmpresaNome, setRegEmpresaNome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLicencaKey, setRegLicencaKey] = useState('');

  // Forgot Password Form State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1: Email | 2: New Password
  const [forgotCodeInput, setForgotCodeInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Notifications Feedback
  const [feedback, setFeedback] = useState(null);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setFeedback(null);
    if (!loginEmail || !loginPassword) {
      setFeedback({ sucesso: false, mensagem: '⚠️ Preencha o e-mail e a senha cadastrados.' });
      return;
    }
    const res = loginUser(loginEmail, loginPassword);
    setFeedback(res);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setFeedback(null);
    if (!regNome || !regEmpresaNome || !regEmail || !regPassword) {
      setFeedback({ sucesso: false, mensagem: '⚠️ Preencha todos os campos obrigatórios (*).' });
      return;
    }
    const res = registerUser({
      nome: regNome,
      empresaNome: regEmpresaNome,
      email: regEmail,
      whatsapp: regWhatsapp,
      senha: regPassword,
      licencaCodigo: regLicencaKey
    });
    setFeedback(res);
  };

  const handleForgotStep1SendCode = (e) => {
    e.preventDefault();
    setFeedback(null);
    if (!forgotEmail) return;

    const res = recoverPasswordByEmail(forgotEmail);
    setFeedback(res);

    if (res.sucesso) {
      setGeneratedCode(res.codeGenerated || '123456');
      setForgotStep(2);
    }
  };

  const handleForgotStep2ResetPassword = (e) => {
    e.preventDefault();
    setFeedback(null);

    if (forgotCodeInput.trim() !== generatedCode.toString().trim()) {
      setFeedback({ sucesso: false, mensagem: '❌ Código de verificação incorreto! Digite o código correto.' });
      return;
    }

    if (!newPasswordInput || newPasswordInput.length < 4) {
      setFeedback({ sucesso: false, mensagem: '⚠️ A nova senha deve ter no mínimo 4 caracteres.' });
      return;
    }

    const res = loginUser(forgotEmail, newPasswordInput, true); // Force password override
    setFeedback({ sucesso: true, mensagem: '🎉 Senha redefinida com sucesso! Você já está logado no sistema.' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 text-slate-950 font-sans p-4 md:p-8 flex items-center justify-center selection:bg-sky-500 selection:text-white">
      <div className="max-w-xl w-full bg-white rounded-3xl border-2 border-sky-300 p-6 md:p-8 space-y-6 shadow-2xl animate-scaleUp">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center font-black mx-auto shadow-lg shadow-sky-500/20">
            <Sparkles className="w-8 h-8" />
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">
            Agenda<span className="text-sky-600">Pro</span> SaaS
          </h1>
          <p className="text-xs text-slate-600 font-semibold">
            Painel de Acesso Seguro • Autenticação Obrigatória
          </p>
        </div>

        {/* Auth Tab Selector */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-black">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setFeedback(null); }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'login' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> 🔑 Entrar
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('register'); setFeedback(null); }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'register' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <User className="w-3.5 h-3.5" /> 🚀 Criar Conta
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('forgot'); setFeedback(null); setForgotStep(1); }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'forgot' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" /> 🔒 Esqueci a Senha
          </button>
        </div>

        {/* TAB 1: STRICT LOGIN FORM (ZERO PRE-FILLED DATA) */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-sky-600" /> SEU E-MAIL CADASTRADO *
              </label>
              <input
                type="email"
                required
                placeholder="seuemail@empresa.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full p-3.5 rounded-2xl border-2 border-sky-200 text-slate-950 font-bold text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-sky-600" /> SUA SENHA *</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('forgot')}
                  className="text-[11px] text-sky-700 hover:underline font-extrabold"
                >
                  Esqueceu a senha?
                </button>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full p-3.5 pr-11 rounded-2xl border-2 border-sky-200 text-slate-950 font-bold text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-black text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Lock className="w-5 h-5 text-white" /> Entrar no Aplicativo
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">Seu Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={regNome}
                  onChange={(e) => setRegNome(e.target.value)}
                  className="w-full p-3 rounded-xl border border-sky-200 text-slate-950 font-bold text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">Nome da Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Barbearia Luxo"
                  value={regEmpresaNome}
                  onChange={(e) => setRegEmpresaNome(e.target.value)}
                  className="w-full p-3 rounded-xl border border-sky-200 text-slate-950 font-bold text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">Seu E-mail (Para Acesso & Recuperação) *</label>
                <input
                  type="email"
                  required
                  placeholder="seuemail@empresa.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-sky-200 text-slate-950 font-bold text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">WhatsApp de Contato *</label>
                <input
                  type="text"
                  required
                  placeholder="(11) 98589-7774"
                  value={regWhatsapp}
                  onChange={(e) => setRegWhatsapp(e.target.value)}
                  className="w-full p-3 rounded-xl border border-sky-200 text-slate-950 font-bold text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">Crie Uma Senha de Acesso *</label>
              <input
                type="password"
                required
                placeholder="Mínimo 4 caracteres"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-sky-200 text-slate-950 font-bold text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-amber-700 mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-amber-600" /> Chave de Licença de Ativação (Enviada no WhatsApp)
              </label>
              <input
                type="text"
                placeholder="Ex: AGY-1ANO-XXXX-XXXX"
                value={regLicencaKey}
                onChange={(e) => setRegLicencaKey(e.target.value.toUpperCase())}
                className="w-full p-3 rounded-xl border-2 border-amber-300 text-slate-950 font-mono font-black text-sm bg-amber-50 outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 uppercase"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-black text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <CheckCircle2 className="w-5 h-5 text-white" /> Cadastrar Empresa & Entrar
            </button>
          </form>
        )}

        {/* TAB 3: FORGOT PASSWORD RECOVERY FORM */}
        {activeTab === 'forgot' && (
          <div className="space-y-4 animate-fadeIn">
            {forgotStep === 1 ? (
              <form onSubmit={handleForgotStep1SendCode} className="space-y-4">
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900 font-semibold">
                  🔒 Digite o e-mail cadastrado no sistema. Nós validaremos o seu cadastro e enviaremos um código de verificação para redefinir sua senha!
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-sky-600" /> SEU E-MAIL CADASTRADO *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="seuemail@empresa.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border-2 border-sky-200 text-slate-950 font-bold text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-black text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Mail className="w-5 h-5 text-white" /> Enviar Código de Recuperação
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotStep2ResetPassword} className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950 font-bold">
                  🔑 O código de validação <b>{generatedCode}</b> foi enviado para {forgotEmail}. Digite-o abaixo e escolha sua nova senha!
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">CÓDIGO DE VERIFICAÇÃO DE 6 DÍGITOS *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Ex: 123456"
                    value={forgotCodeInput}
                    onChange={(e) => setForgotCodeInput(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border-2 border-amber-300 text-slate-950 font-mono font-black text-lg text-center bg-amber-50 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">DIGITE SUA NOVA SENHA *</label>
                  <input
                    type="password"
                    required
                    placeholder="Digite a nova senha"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border-2 border-sky-200 text-slate-950 font-bold text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-black text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <CheckCircle2 className="w-5 h-5 text-white" /> Redefinir Senha & Entrar
                </button>
              </form>
            )}
          </div>
        )}

        {/* Feedback Messages */}
        {feedback && (
          <div className={`p-4 rounded-2xl text-xs font-black border animate-scaleUp ${
            feedback.sucesso 
              ? 'bg-emerald-100 text-emerald-950 border-emerald-300' 
              : 'bg-rose-100 text-rose-950 border-rose-300'
          }`}>
            {feedback.mensagem}
          </div>
        )}
      </div>
    </div>
  );
};
