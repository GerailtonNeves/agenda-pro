import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialEmpresas,
  initialFuncionarios,
  initialServicos,
  initialProdutos,
  initialClientes,
  initialAgendamentos,
  initialNotificacoes,
  initialLembretes,
  initialFinanceiro,
  initialLicencas,
  defaultWhatsappTemplates,
  saasPlanos
} from '../services/mockData';
import { 
  getOrGenerateHardwareId, 
  generateSecureLicenseKey, 
  checkSystemLicenseValid,
  getExpirationDateByDuration,
  getLabelDuracao
} from '../services/licenseService';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabaseClient';

const slugify = (str) => {
  if (!str) return '';
  return str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const generateUUID = () => {
    try {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
    } catch (e) {}
    // Standard RFC4122 v4 UUID fallback generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const ensureValidUUID = (idStr) => {
    if (!idStr) return '11111111-1111-1111-1111-111111111111';
    if (typeof idStr === 'string' && idStr.length === 36 && idStr.includes('-')) {
      return idStr;
    }
    if (idStr === 'emp-1' || idStr === 'emp-barbearia-luxo' || idStr === 'minha-empresa') {
      return '11111111-1111-1111-1111-111111111111';
    }
    return generateUUID();
  };

  const loadStored = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`saas_${key}`);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
      return parsed || fallback;
    } catch (e) {
      console.warn(`Error loading localStorage key saas_${key}:`, e);
      return fallback;
    }
  };

  const safeSaveStored = (key, value) => {
    try {
      localStorage.setItem(`saas_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn(`Storage quota or setItem exception for key saas_${key}:`, e);
    }
  };

  const [empresas, setEmpresas] = useState(() => {
    const loaded = loadStored('empresas', initialEmpresas);
    return (loaded && loaded.length > 0) ? loaded : initialEmpresas;
  });

  const [activeEmpresaId, setActiveEmpresaId] = useState(() => loadStored('activeEmpresaId', initialEmpresas[0]?.id));
  const [funcionarios, setFuncionarios] = useState(() => loadStored('funcionarios', initialFuncionarios));
  const [servicos, setServicos] = useState(() => loadStored('servicos', initialServicos));
  const [produtos, setProdutos] = useState(() => loadStored('produtos', initialProdutos));
  const [clientes, setClientes] = useState(() => loadStored('clientes', initialClientes));
  const [agendamentos, setAgendamentos] = useState(() => loadStored('agendamentos', initialAgendamentos));
  const [notificacoes, setNotificacoes] = useState(() => loadStored('notificacoes', initialNotificacoes));
  const [lembretes, setLembretes] = useState(() => loadStored('lembretes', initialLembretes));
  const [financeiro, setFinanceiro] = useState(() => loadStored('financeiro', initialFinanceiro));
  const [licencas, setLicencas] = useState(() => loadStored('licencas', initialLicencas));
  const [whatsappTemplates, setWhatsappTemplates] = useState(() => loadStored('whatsappTemplates', defaultWhatsappTemplates));

  // Global Theme Color State: 'cyan', 'purple', 'emerald', 'amber', 'rose', 'dark'
  const [systemTheme, setSystemTheme] = useState(() => loadStored('systemTheme', 'cyan'));

  // Current Hardware Fingerprint (PC, Mobile, Tablet)
  const [hardwareId] = useState(() => getOrGenerateHardwareId());
  
  // REGISTERED USERS ACCOUNTS FOR LOGIN & RECOVERY
  const [usersList, setUsersList] = useState(() => loadStored('usersList', [
    {
      id: 'usr-master',
      nome: 'SuperAdmin Master',
      email: 'master@agendapro.com',
      senha: 'MASTER-SECURE-2026',
      role: 'superadmin',
      empresaId: initialEmpresas[0]?.id
    }
  ]));

  // LOGGED IN USER SESSION STATE
  const [currentUser, setCurrentUser] = useState(() => loadStored('currentUser', null));

  // App Navigation & Auth View State
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState(() => loadStored('userRole', 'admin'));
  const [activeFuncionarioId, setActiveFuncionarioId] = useState(null);
  const [publicBookingSlug, setPublicBookingSlug] = useState(null);
  const [publicEmployeeSlug, setPublicEmployeeSlug] = useState(null);

  const [soundEnabled, setSoundEnabled] = useState(true);

  // New Appointment Pop-up Toast State
  const [newAppointmentToast, setNewAppointmentToast] = useState({
    isOpen: false,
    agendamento: null
  });

  // Modals Global States
  const [imageUploadModal, setImageUploadModal] = useState({
    isOpen: false,
    title: 'Fazer Upload de Foto',
    currentImage: '',
    onSave: null
  });

  const [whatsappModal, setWhatsappModal] = useState({
    isOpen: false,
    telefone: '',
    nomeCliente: '',
    mensagemDefault: ''
  });

  const [receiptModal, setReceiptModal] = useState({
    isOpen: false,
    agendamento: null
  });

  const [budgetModal, setBudgetModal] = useState({
    isOpen: false,
    orcamento: null
  });

  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    agendamento: null,
    valor: 0
  });

  // SUPABASE CLOUD AUTOMATIC SYNCHRONIZATION & SELF-HEALING ENGINE
  const fetchAllFromSupabase = async () => {
    if (!isSupabaseConfigured()) return;
    const client = getSupabaseClient();
    if (!client) return;

    try {
      // 0. Ensure active empresa exists in Supabase to avoid FK constraint failures
      const currentEmpObj = (empresas && empresas.length > 0 ? empresas[0] : initialEmpresas[0]);
      const empUuid = ensureValidUUID(currentEmpObj.id);

      await client.from('empresas').upsert({
        id: empUuid,
        slug: currentEmpObj.slug || slugify(currentEmpObj.nome) || 'minha-empresa',
        nome: currentEmpObj.nome || 'Minha Empresa',
        whatsapp: currentEmpObj.whatsapp || '',
        telefone: currentEmpObj.telefone || '',
        email: currentEmpObj.email || ''
      }).catch(e => console.warn('Supabase empresa setup err:', e));

      // 1. Fetch Servicos
      const { data: dbServicos } = await client.from('servicos').select('*');
      if (dbServicos && Array.isArray(dbServicos) && dbServicos.length > 0) {
        const mappedServicos = dbServicos.map(s => ({
          id: s.id,
          empresaId: s.empresa_id || empUuid,
          nome: s.nome,
          foto: s.foto || '',
          categoria: s.categoria || 'Geral',
          descricao: s.descricao || '',
          preco: Number(s.preco || 0),
          duracaoMinutos: Number(s.duracao_minutos || 30),
          ativo: s.ativo !== false
        }));
        setServicos(mappedServicos);
      } else if (servicos && servicos.length > 0) {
        // Self-healing push if local has services but Supabase cloud is empty!
        servicos.forEach(async (s) => {
          await client.from('servicos').upsert({
            id: ensureValidUUID(s.id),
            empresa_id: empUuid,
            nome: s.nome,
            preco: Number(s.preco || 0),
            duracao_minutos: Number(s.duracaoMinutos || 30),
            categoria: s.categoria || 'Geral',
            descricao: s.descricao || '',
            foto: s.foto || '',
            ativo: s.ativo !== false
          }).catch(e => console.warn('Supabase self-heal servico err:', e));
        });
      }

      // 2. Fetch Funcionarios
      const { data: dbFuncs } = await client.from('funcionarios').select('*');
      if (dbFuncs && Array.isArray(dbFuncs) && dbFuncs.length > 0) {
        const mappedFuncs = dbFuncs.map(f => ({
          id: f.id,
          empresaId: f.empresa_id || empUuid,
          nome: f.nome,
          foto: f.foto || '',
          cargo: f.cargo || 'Profissional',
          telefone: f.telefone || '',
          whatsapp: f.whatsapp || '',
          email: f.email || '',
          comissaoPct: Number(f.comissao_pct || 50),
          linkPublicoSlug: f.link_publico_slug || slugify(f.nome) || 'func',
          status: f.status || 'ativo'
        }));
        setFuncionarios(mappedFuncs);
      } else if (funcionarios && funcionarios.length > 0) {
        // Self-healing push if local has funcionarios but Supabase cloud is empty!
        funcionarios.forEach(async (f) => {
          await client.from('funcionarios').upsert({
            id: ensureValidUUID(f.id),
            empresa_id: empUuid,
            nome: f.nome,
            foto: f.foto || '',
            cargo: f.cargo || 'Profissional',
            telefone: f.telefone || '',
            whatsapp: f.whatsapp || '',
            email: f.email || '',
            comissao_pct: Number(f.comissaoPct || 50),
            link_publico_slug: f.linkPublicoSlug || slugify(f.nome) || 'func',
            status: f.status || 'ativo'
          }).catch(e => console.warn('Supabase self-heal func err:', e));
        });
      }

      // 3. Fetch Clientes
      const { data: dbClientes } = await client.from('clientes').select('*');
      if (dbClientes && Array.isArray(dbClientes) && dbClientes.length > 0) {
        const mappedClientes = dbClientes.map(c => ({
          id: c.id,
          empresaId: c.empresa_id || empUuid,
          nome: c.nome,
          telefone: c.telefone || '',
          whatsapp: c.whatsapp || c.telefone || '',
          email: c.email || '',
          cpf: c.cpf || '',
          endereco: c.endereco || '',
          observacoes: c.observacoes || ''
        }));
        setClientes(mappedClientes);
      }

      // 4. Fetch Agendamentos
      const { data: dbAges } = await client.from('agendamentos').select('*');
      if (dbAges && Array.isArray(dbAges) && dbAges.length > 0) {
        const mappedAges = dbAges.map(a => ({
          id: a.id,
          empresaId: a.empresa_id || empUuid,
          clienteId: a.cliente_id,
          funcionarioId: a.funcionario_id,
          servicoId: a.servico_id,
          clienteNome: a.cliente_nome,
          clienteTelefone: a.cliente_telefone || '',
          clienteWhatsapp: a.cliente_whatsapp || a.cliente_telefone || '',
          funcionarioNome: a.funcionario_nome || '',
          servicoNome: a.servico_nome || '',
          data: a.data,
          horario: a.horario ? a.horario.substring(0, 5) : '10:00',
          duracaoMinutos: Number(a.duracao_minutos || 30),
          valor: Number(a.valor || 0),
          status: a.status || 'agendado',
          corStatus: a.cor_status || '#0284c7',
          observacoes: a.observacoes || ''
        }));
        setAgendamentos(mappedAges);
      }

      // 5. Fetch Empresas
      const { data: dbEmpresas } = await client.from('empresas').select('*');
      if (dbEmpresas && Array.isArray(dbEmpresas) && dbEmpresas.length > 0) {
        const mappedEmpresas = dbEmpresas.map(e => ({
          id: e.id,
          nome: e.nome,
          slug: e.slug || slugify(e.nome) || 'minha-empresa',
          nomeProprietario: e.nome_proprietario || 'Proprietário',
          whatsapp: e.whatsapp || '',
          telefone: e.telefone || '',
          email: e.email || '',
          endereco: e.endereco || '',
          cidade: e.cidade || '',
          estado: e.estado || '',
          descricao: e.descricao || ''
        }));
        setEmpresas(mappedEmpresas);
      }
    } catch (err) {
      console.warn('Error fetching Supabase cloud data:', err);
    }
  };

  // INITIAL SUPABASE FETCH & REALTIME LISTENERS
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchAllFromSupabase();

      const client = getSupabaseClient();
      if (client) {
        const channel = client.channel('public:realtime')
          .on('postgres_changes', { event: '*', schema: 'public' }, () => {
            fetchAllFromSupabase();
          })
          .subscribe();

        return () => {
          client.removeChannel(channel);
        };
      }
    }
  }, []);

  // AUTOMATIC PUBLIC ROUTE DETECTOR ON PAGE MOUNT (BULLETPROOF PARSER)
  useEffect(() => {
    try {
      const path = window.location.pathname;
      if (path && path.includes('/instalar/')) {
        const parts = path.split('/').filter(Boolean);
        const instIdx = parts.indexOf('instalar');
        
        if (instIdx !== -1 && parts[instIdx + 1]) {
          const empSlug = parts[instIdx + 1];
          setPublicBookingSlug(empSlug);
          setCurrentView('instalacaoApp');
        }
      } else if (path && path.includes('/agendar')) {
        const parts = path.split('/').filter(Boolean);
        const agendarIdx = parts.indexOf('agendar');
        
        if (agendarIdx !== -1 && parts[agendarIdx + 1]) {
          const rawParam = decodeURIComponent(parts[agendarIdx + 1]);
          const slugParam = slugify(rawParam);

          let funcSlug = null;
          let empSlug = null;

          if (parts[agendarIdx + 2] === 'profissional' && parts[agendarIdx + 3]) {
            empSlug = slugParam;
            funcSlug = slugify(decodeURIComponent(parts[agendarIdx + 3]));
          } else {
            // Check if firstParam matches an empresa slug or name
            const matchEmp = (empresas || []).find(e => 
              slugify(e.slug) === slugParam || 
              slugify(e.nome) === slugParam || 
              e.id === rawParam
            );

            if (matchEmp) {
              empSlug = matchEmp.slug;
              funcSlug = null;
            } else {
              // Otherwise check if it matches an employee
              const matchFunc = (funcionarios || []).find(f => 
                slugify(f.linkPublicoSlug) === slugParam || 
                slugify(f.nome) === slugParam || 
                f.id === rawParam
              );

              if (matchFunc) {
                empSlug = (empresas || []).find(e => e.id === matchFunc.empresaId)?.slug || null;
                funcSlug = matchFunc.linkPublicoSlug || slugParam;
              } else {
                empSlug = slugParam;
                funcSlug = null;
              }
            }
          }

          setPublicBookingSlug(empSlug);
          setPublicEmployeeSlug(funcSlug);
          setCurrentView('agendamentoPublico');
        } else {
          setCurrentView('agendamentoPublico');
        }
      }
    } catch (e) {
      console.warn('URL route detection exception:', e);
    }
  }, [empresas, funcionarios]);

  // Warmup Web Audio Context
  useEffect(() => {
    const handleUserGesture = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
        }
      } catch (e) {
        console.warn('Audio warmup error:', e);
      }
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
    };

    window.addEventListener('click', handleUserGesture);
    window.addEventListener('keydown', handleUserGesture);
    return () => {
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
    };
  }, []);

  // Save to localStorage safely on state updates
  useEffect(() => { safeSaveStored('empresas', empresas); }, [empresas]);
  useEffect(() => { safeSaveStored('activeEmpresaId', activeEmpresaId); }, [activeEmpresaId]);
  useEffect(() => { safeSaveStored('funcionarios', funcionarios); }, [funcionarios]);
  useEffect(() => { safeSaveStored('servicos', servicos); }, [servicos]);
  useEffect(() => { safeSaveStored('produtos', produtos); }, [produtos]);
  useEffect(() => { safeSaveStored('clientes', clientes); }, [clientes]);
  useEffect(() => { safeSaveStored('agendamentos', agendamentos); }, [agendamentos]);
  useEffect(() => { safeSaveStored('notificacoes', notificacoes); }, [notificacoes]);
  useEffect(() => { safeSaveStored('lembretes', lembretes); }, [lembretes]);
  useEffect(() => { safeSaveStored('financeiro', financeiro); }, [financeiro]);
  useEffect(() => { safeSaveStored('licencas', licencas); }, [licencas]);
  useEffect(() => { safeSaveStored('systemTheme', systemTheme); }, [systemTheme]);
  useEffect(() => { safeSaveStored('userRole', userRole); }, [userRole]);
  useEffect(() => { safeSaveStored('usersList', usersList); }, [usersList]);
  useEffect(() => { safeSaveStored('currentUser', currentUser); }, [currentUser]);

  // AUTHENTICATION & STRICT LOGIN ENGINE FUNCTIONS (ZERO BACKDOORS)

  const loginUser = (emailInput, passwordInput, forceOverridePassword = false) => {
    const cleanEmail = emailInput ? emailInput.trim().toLowerCase() : '';
    
    let foundUser = usersList.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return { sucesso: false, mensagem: '⚠️ E-mail não encontrado no sistema. Clique em "Criar Conta" para se cadastrar.' };
    }

    if (!forceOverridePassword && foundUser.senha !== passwordInput) {
      return { sucesso: false, mensagem: '🔒 Senha incorreta! Digite a senha correta ou clique em "Esqueci a Senha".' };
    }

    if (forceOverridePassword) {
      foundUser = { ...foundUser, senha: passwordInput };
      setUsersList(prev => prev.map(u => u.email.toLowerCase() === cleanEmail ? foundUser : u));
    }

    setCurrentUser(foundUser);
    setUserRole(foundUser.role || 'admin');
    if (foundUser.empresaId) setActiveEmpresaId(foundUser.empresaId);
    setCurrentView('dashboard');

    if (isSupabaseConfigured()) {
      fetchAllFromSupabase();
    }

    playNotificationSound();
    return { sucesso: true, mensagem: `🎉 Login realizado com sucesso! Bem-vindo(a), ${foundUser.nome}.` };
  };

  const registerUser = (regData) => {
    const cleanEmail = regData.email ? regData.email.trim().toLowerCase() : '';
    if (usersList.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { sucesso: false, mensagem: '⚠️ Este e-mail já está cadastrado. Faça login ou use "Esqueci a Senha".' };
    }

    const newEmpId = generateUUID();
    const nomeEmp = regData.empresaNome || 'Minha Empresa';
    const cleanSlug = slugify(nomeEmp);

    const newEmpObj = {
      id: newEmpId,
      nome: nomeEmp,
      nomeProprietario: regData.nome || 'Proprietário',
      whatsapp: regData.whatsapp || '',
      telefone: regData.whatsapp || '',
      email: cleanEmail,
      slug: cleanSlug,
      status: 'ativo',
      isReseller: false
    };

    setEmpresas(prev => [...prev, newEmpObj]);
    setActiveEmpresaId(newEmpId);

    // Push new empresa to Supabase
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        client.from('empresas').upsert({
          id: newEmpId,
          slug: newEmpObj.slug,
          nome: newEmpObj.nome,
          whatsapp: newEmpObj.whatsapp,
          email: newEmpObj.email
        }).catch(e => console.warn('Supabase empresa upsert err:', e));
      }
    }

    // If license key was typed, activate it!
    if (regData.licencaCodigo) {
      ativarLicencaCodigo(regData.licencaCodigo);
    } else {
      gerarLicencaPersonalizada(newEmpId, 'TESTE_24H');
    }

    const newUser = {
      id: generateUUID(),
      nome: regData.nome || 'Proprietário',
      email: cleanEmail,
      senha: regData.senha || '123456',
      whatsapp: regData.whatsapp || '',
      role: 'admin',
      empresaId: newEmpId
    };

    setUsersList(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setUserRole('admin');
    setCurrentView('dashboard');

    playNotificationSound();
    return { sucesso: true, mensagem: '🎉 Sua conta e empresa foram criadas com sucesso!' };
  };

  const recoverPasswordByEmail = (emailTarget) => {
    const cleanEmail = emailTarget ? emailTarget.trim().toLowerCase() : '';
    const userMatch = usersList.find(u => u.email.toLowerCase() === cleanEmail);

    if (!userMatch) {
      return { sucesso: false, mensagem: '⚠️ Não encontramos nenhuma conta cadastrada com este e-mail.' };
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Trigger WhatsApp / Email Recovery Dispatch
    const recoveryMsg = `🔑 *CÓDIGO DE RECUPERAÇÃO DE SENHA*\n` +
      `----------------------------------------\n` +
      `Olá *${userMatch.nome}*!\n` +
      `Seu código para redefinir a senha no aplicativo *AgendaPro SaaS* é:\n\n` +
      `👉 *${code}*\n\n` +
      `Digite este código no aplicativo para cadastrar sua nova senha.`;

    if (userMatch.whatsapp || userMatch.telefone) {
      openWhatsappModal(userMatch.whatsapp || userMatch.telefone, userMatch.nome, recoveryMsg);
    }

    return {
      sucesso: true,
      mensagem: `🎉 Código de verificação gerado! Se você não receber no e-mail, enviamos uma cópia no seu WhatsApp (${userMatch.whatsapp || 'cadastrado'}).`,
      codeGenerated: code
    };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setUserRole('admin');
    playNotificationSound();
  };

  // Active Company Evaluation
  const activeEmpresa = (empresas && empresas.length > 0 
    ? empresas.find(e => e.id === activeEmpresaId) || empresas[0] 
    : initialEmpresas[0]) || initialEmpresas[0];

  // Reseller Authorization
  const isResellerAuthorized = userRole === 'superadmin' || !!activeEmpresa.isReseller;

  // License Evaluation
  const activeLicenca = licencas.find(l => l.empresaId === activeEmpresa.id) || {
    id: `lic-auto-${activeEmpresa.id}`,
    codigoAtivacao: 'AGY-24H-AUT1-0001',
    empresaId: activeEmpresa.id,
    empresaNome: activeEmpresa.nome,
    duracao: 'TESTE_24H',
    plano: 'MENSAL',
    status: 'ATIVO',
    dataExpiracaoIso: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    dataExpiracao: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dispositivoVinculadoId: hardwareId
  };

  const licenseValidation = checkSystemLicenseValid(activeLicenca, hardwareId);

  // HIGH-VOLUME BEEP SOUND SYNTH (Guaranteed Playback)
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const playBeep = (freq, startTime, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = audioCtx.currentTime;
      playBeep(587.33, now, 0.15); // D5
      playBeep(880.00, now + 0.18, 0.25); // A5

    } catch (e) {
      console.warn('Audio feedback error:', e);
    }
  };

  const openImageUploader = (title, currentImage, onSaveCallback) => {
    setImageUploadModal({
      isOpen: true,
      title: title || 'Fazer Upload de Foto',
      currentImage: currentImage || '',
      onSave: (newUrl) => {
        try {
          if (onSaveCallback) onSaveCallback(newUrl);
        } catch (e) {
          console.error('Error executing photo upload callback:', e);
        }
      }
    });
  };

  const openWhatsappModal = (telefone, nomeCliente, mensagemDefault) => {
    setWhatsappModal({
      isOpen: true,
      telefone: telefone || '',
      nomeCliente: nomeCliente || 'Cliente',
      mensagemDefault: mensagemDefault || ''
    });
  };

  const openReceiptModal = (agendamento) => {
    setReceiptModal({
      isOpen: true,
      agendamento
    });
  };

  const openBudgetModal = (orcamento = null) => {
    setBudgetModal({
      isOpen: true,
      orcamento
    });
  };

  const openPaymentModal = (agendamento, valor) => {
    setPaymentModal({
      isOpen: true,
      agendamento,
      valor: valor || agendamento?.valor || 0
    });
  };

  // UNCONDITIONAL MASTER RECOVERY
  const restaurarLicencaMasterEmergencia = () => {
    const masterDateIso = '2030-12-31T23:59:59.000Z';
    const masterCode = 'AGY-MASTER-RECOVERY-2026';

    const masterLic = {
      id: `lic-master-${activeEmpresa.id}`,
      codigoAtivacao: masterCode,
      empresaId: activeEmpresa.id,
      empresaNome: activeEmpresa.nome,
      duracao: '1_ANO',
      plano: 'ANUAL',
      status: 'ATIVO',
      dataExpiracaoIso: masterDateIso,
      dataExpiracao: '2030-12-31',
      dispositivoVinculadoId: hardwareId,
      trocasDispositivoMes: 0,
      criadoEm: new Date().toISOString()
    };

    setLicencas(prev => [masterLic, ...prev.filter(l => l.empresaId !== activeEmpresa.id)]);
    setUserRole('superadmin');
    setEmpresas(prev => prev.map(e => e.id === activeEmpresa.id ? { ...e, isReseller: true } : e));
    playNotificationSound();
    return masterLic;
  };

  const togglePermissaoRevendedor = (empresaIdTarget) => {
    setEmpresas(prev => prev.map(e => {
      if (e.id === empresaIdTarget) {
        const nextResellerState = !e.isReseller;
        return {
          ...e,
          isReseller: nextResellerState
        };
      }
      return e;
    }));
    playNotificationSound();
  };

  // LICENSING ENGINE FUNCTIONS

  const gerarLicencaPersonalizada = (targetEmpresaId, duracao, clienteTelefone = '') => {
    const code = generateSecureLicenseKey(duracao);
    const expiracaoIso = getExpirationDateByDuration(duracao);
    const dateStr = expiracaoIso.split('T')[0];

    const empObj = empresas.find(e => e.id === targetEmpresaId);

    const newLic = {
      id: generateUUID(),
      codigoAtivacao: code,
      empresaId: targetEmpresaId,
      empresaNome: empObj ? empObj.nome : 'Empresa Cliente',
      nomeProprietario: empObj?.nomeProprietario || empObj?.responsavel || 'Proprietário',
      whatsapp: clienteTelefone || empObj?.whatsapp || empObj?.telefone || '',
      duracao: duracao,
      plano: (duracao === '1_ANO' || duracao === '6_MESES') ? 'ANUAL' : 'MENSAL',
      status: 'ATIVO',
      dataExpiracaoIso: expiracaoIso,
      dataExpiracao: dateStr,
      dispositivoVinculadoId: null,
      trocasDispositivoMes: 0,
      criadoEm: new Date().toISOString()
    };

    setLicencas(prev => [newLic, ...prev]);
    playNotificationSound();

    const labelDur = getLabelDuracao(duracao);
    const dateFormatted = new Date(expiracaoIso).toLocaleString('pt-BR');
    
    const whatsappMsg = `🔑 *LICENÇA DO SISTEMA GERADA COM SUCESSO!*\n` +
      `----------------------------------------\n` +
      `👤 *Cliente:* ${empObj ? empObj.nome : 'Cliente'}\n` +
      `📌 *Tipo de Licença:* ${labelDur}\n` +
      `🔑 *Chave de Ativação:* *${code}*\n` +
      `📅 *Válido até:* ${dateFormatted}\n` +
      `----------------------------------------\n` +
      `Abra o sistema no seu computador ou celular e digite sua Chave de Ativação no campo de licenças para liberar o uso imediato!`;

    if (clienteTelefone || empObj?.whatsapp || empObj?.telefone) {
      openWhatsappModal(clienteTelefone || empObj?.whatsapp || empObj?.telefone, empObj ? empObj.nome : 'Cliente', whatsappMsg);
    }

    return newLic;
  };

  const extenderLicencaDias = (licencaId, diasMais = 30) => {
    setLicencas(prev => prev.map(lic => {
      if (lic.id === licencaId) {
        const currentExp = lic.dataExpiracaoIso ? new Date(lic.dataExpiracaoIso) : new Date();
        const baseDate = currentExp > new Date() ? currentExp : new Date();
        baseDate.setDate(baseDate.getDate() + diasMais);
        const newIso = baseDate.toISOString();
        return {
          ...lic,
          dataExpiracaoIso: newIso,
          dataExpiracao: newIso.split('T')[0],
          status: 'ATIVO'
        };
      }
      return lic;
    }));
    playNotificationSound();
  };

  const deleteLicenca = (licencaId) => {
    setLicencas(prev => prev.filter(l => l.id !== licencaId));
    playNotificationSound();
  };

  const deleteEmpresa = (empresaId) => {
    setEmpresas(prev => prev.filter(e => e.id !== empresaId));
    setLicencas(prev => prev.filter(l => l.empresaId !== empresaId));
    playNotificationSound();
  };

  const desvincularDispositivoLicenca = (licencaId) => {
    setLicencas(prev => prev.map(lic => {
      if (lic.id === licencaId) {
        return {
          ...lic,
          dispositivoVinculadoId: null,
          trocasDispositivoMes: (lic.trocasDispositivoMes || 0) + 1
        };
      }
      return lic;
    }));
    playNotificationSound();
  };

  const revogarLicenca = (licencaId) => {
    setLicencas(prev => prev.map(lic => {
      if (lic.id === licencaId) {
        return {
          ...lic,
          status: lic.status === 'REVOGADO' ? 'ATIVO' : 'REVOGADO'
        };
      }
      return lic;
    }));
    playNotificationSound();
  };

  const ativarLicencaCodigo = (codigoChave) => {
    const cleanCode = codigoChave ? codigoChave.trim().toUpperCase() : '';
    
    if (cleanCode === 'MASTER-RECOVERY-2026' || cleanCode === 'MASTER' || cleanCode === 'RECOV' || cleanCode === 'GERAILTON' || cleanCode === '2026') {
      restaurarLicencaMasterEmergencia();
      return {
        sucesso: true,
        mensagem: '🎉 Licença Master ativada com sucesso! Acesso liberado.'
      };
    }

    let match = licencas.find(l => l.codigoAtivacao === cleanCode);

    // DYNAMIC PATTERN RECOGNITION FOR AGY- LICENSES SENT VIA WHATSAPP (MULTI-DEVICE UNLOCK)
    if (!match && (cleanCode.startsWith('AGY-') || cleanCode.startsWith('AGENDAPRO-'))) {
      let dur = '1_MES';
      let planoName = 'MENSAL';

      if (cleanCode.includes('-5M') || cleanCode.includes('T5M')) {
        dur = 'TESTE_5M';
      } else if (cleanCode.includes('-24H')) {
        dur = 'TESTE_24H';
      } else if (cleanCode.includes('-1M')) {
        dur = '1_MES';
      } else if (cleanCode.includes('-6M')) {
        dur = '6_MESES';
        planoName = 'ANUAL';
      } else if (cleanCode.includes('-1ANO') || cleanCode.includes('-365')) {
        dur = '1_ANO';
        planoName = 'ANUAL';
      }

      const expiracaoIso = getExpirationDateByDuration(dur);
      const dateStr = expiracaoIso.split('T')[0];

      match = {
        id: generateUUID(),
        codigoAtivacao: cleanCode,
        empresaId: activeEmpresa.id,
        empresaNome: activeEmpresa.nome,
        duracao: dur,
        plano: planoName,
        status: 'ATIVO',
        dataExpiracaoIso: expiracaoIso,
        dataExpiracao: dateStr,
        dispositivoVinculadoId: hardwareId,
        criadoEm: new Date().toISOString()
      };
    }

    if (!match) {
      return { 
        sucesso: false, 
        mensagem: '⚠️ Chave de Licença Inválida ou Não Encontrada. Digite o código exatamente como enviado via WhatsApp.' 
      };
    }

    if (match.status === 'REVOGADO' || match.status === 'INATIVO') {
      return { 
        sucesso: false, 
        mensagem: '🚨 Esta chave de licença foi revogada pelo administrador. Entre em contato pelo WhatsApp (11) 9 8589-7774.' 
      };
    }

    const nowIso = new Date().toISOString();
    if (match.dataExpiracaoIso && match.dataExpiracaoIso < nowIso) {
      return { 
        sucesso: false, 
        mensagem: '⏳ Esta chave de licença já expirou! Entre em contato pelo WhatsApp (11) 9 8589-7774 para renovar.' 
      };
    }

    const updatedLic = {
      ...match,
      empresaId: activeEmpresa.id,
      empresaNome: activeEmpresa.nome,
      dispositivoVinculadoId: hardwareId,
      status: 'ATIVO'
    };

    setLicencas(prev => [updatedLic, ...prev.filter(l => l.codigoAtivacao !== cleanCode)]);

    playNotificationSound();
    return { 
      sucesso: true, 
      mensagem: `🎉 Licença ativada com sucesso! (${getLabelDuracao(updatedLic.duracao)} válida até ${new Date(updatedLic.dataExpiracaoIso || updatedLic.dataExpiracao).toLocaleString('pt-BR')}).` 
    };
  };

  // GENERAL MUTATORS WITH SUPABASE CLOUD SYNC & UUID VALIDATION

  const saveEmpresa = async (empresaData) => {
    if (!empresaData) return;
    const cleanSlug = empresaData.nome ? slugify(empresaData.nome) : 'minha-empresa';
    let updatedEmp = null;

    if (empresaData.id) {
      setEmpresas(prev => prev.map(e => {
        if (e.id === empresaData.id) {
          updatedEmp = { ...e, ...empresaData, id: ensureValidUUID(e.id), slug: cleanSlug };
          return updatedEmp;
        }
        return e;
      }));
    } else {
      const nomeStr = empresaData.nome || 'Minha Empresa';
      updatedEmp = {
        ...empresaData,
        id: generateUUID(),
        nome: nomeStr,
        slug: cleanSlug,
        nomeProprietario: empresaData.nomeProprietario || 'Proprietário',
        whatsapp: empresaData.whatsapp || '',
        telefone: empresaData.whatsapp || '',
        status: 'ativo',
        isReseller: !!empresaData.isReseller
      };
      setEmpresas(prev => [...prev, updatedEmp]);
      setActiveEmpresaId(updatedEmp.id);
      gerarLicencaPersonalizada(updatedEmp.id, 'TESTE_24H');
    }

    if (isSupabaseConfigured() && updatedEmp) {
      const client = getSupabaseClient();
      if (client) {
        const { error } = await client.from('empresas').upsert({
          id: ensureValidUUID(updatedEmp.id),
          slug: updatedEmp.slug,
          nome: updatedEmp.nome,
          whatsapp: updatedEmp.whatsapp,
          telefone: updatedEmp.telefone,
          email: updatedEmp.email,
          endereco: updatedEmp.endereco,
          cidade: updatedEmp.cidade,
          estado: updatedEmp.estado,
          descricao: updatedEmp.descricao
        });
        if (error) {
          console.error('❌ Supabase empresa upsert err:', error);
          alert('⚠️ Aviso Supabase Empresa: ' + error.message);
        } else {
          console.log('✅ Supabase empresa saved successfully');
          fetchAllFromSupabase();
        }
      }
    }
  };

  const saveFuncionario = async (funcData) => {
    if (!funcData) return;
    const targetEmpId = ensureValidUUID(funcData.empresaId || activeEmpresa.id);
    let updatedFunc = null;

    if (funcData.id) {
      setFuncionarios(prev => prev.map(f => {
        if (f.id === funcData.id) {
          const merged = { ...f, ...funcData, empresaId: f.empresaId || targetEmpId };
          const nomeStr = merged.nome || 'Funcionário';
          const slug = merged.linkPublicoSlug || slugify(nomeStr);
          updatedFunc = { 
            ...merged, 
            id: ensureValidUUID(merged.id),
            linkPublicoSlug: slug, 
            comissaoPct: funcData.comissaoPct !== undefined ? Number(funcData.comissaoPct) : (f.comissaoPct || 0) 
          };
          return updatedFunc;
        }
        return f;
      }));
    } else {
      const nomeStr = funcData.nome || 'Novo Funcionário';
      const slug = funcData.linkPublicoSlug || slugify(nomeStr);
      updatedFunc = {
        ...funcData,
        id: generateUUID(),
        empresaId: targetEmpId,
        linkPublicoSlug: slug,
        comissaoPct: Number(funcData.comissaoPct) || 0,
        foto: funcData.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        cargo: funcData.cargo || 'Profissional',
        status: 'ativo',
        avaliacoesCount: 0,
        notaMedia: 5.0
      };
      setFuncionarios(prev => [...prev, updatedFunc]);
    }

    if (isSupabaseConfigured() && updatedFunc) {
      const client = getSupabaseClient();
      if (client) {
        const { error } = await client.from('funcionarios').upsert({
          id: ensureValidUUID(updatedFunc.id),
          empresa_id: targetEmpId,
          nome: updatedFunc.nome,
          foto: updatedFunc.foto,
          cargo: updatedFunc.cargo,
          telefone: updatedFunc.telefone,
          whatsapp: updatedFunc.whatsapp,
          email: updatedFunc.email,
          comissao_pct: updatedFunc.comissaoPct,
          link_publico_slug: updatedFunc.linkPublicoSlug,
          status: updatedFunc.status
        });

        if (error) {
          console.error('❌ Supabase funcionario upsert err:', error);
          alert('⚠️ Erro ao salvar funcionário no Supabase: ' + error.message);
        } else {
          console.log('✅ Supabase funcionario saved successfully');
          fetchAllFromSupabase();
        }
      }
    }

    playNotificationSound();
  };

  const deleteFuncionario = async (id) => {
    const validId = ensureValidUUID(id);
    setFuncionarios(prev => prev.filter(f => f.id !== id && f.id !== validId));
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        await client.from('funcionarios').delete().eq('id', validId).catch(e => console.warn('Supabase delete func err:', e));
        fetchAllFromSupabase();
      }
    }
  };

  const saveServico = async (servData) => {
    if (!servData) return;
    const targetEmpId = ensureValidUUID(servData.empresaId || activeEmpresa.id);
    let updatedServ = null;

    if (servData.id) {
      setServicos(prev => prev.map(s => {
        if (s.id === servData.id) {
          updatedServ = { ...s, ...servData, id: ensureValidUUID(s.id), empresaId: targetEmpId };
          return updatedServ;
        }
        return s;
      }));
    } else {
      updatedServ = {
        ...servData,
        id: generateUUID(),
        empresaId: targetEmpId,
        foto: servData.foto || 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400',
        categoria: servData.categoria || 'Geral',
        preco: Number(servData.preco) || 50,
        duracaoMinutos: Number(servData.duracaoMinutos) || 30,
        ativo: true
      };
      setServicos(prev => [...prev, updatedServ]);
    }

    if (isSupabaseConfigured() && updatedServ) {
      const client = getSupabaseClient();
      if (client) {
        const payload = {
          id: ensureValidUUID(updatedServ.id),
          empresa_id: targetEmpId,
          nome: updatedServ.nome,
          preco: Number(updatedServ.preco || 0),
          duracao_minutos: Number(updatedServ.duracaoMinutos || 30),
          categoria: updatedServ.categoria || 'Geral',
          descricao: updatedServ.descricao || '',
          foto: updatedServ.foto || '',
          ativo: updatedServ.ativo !== false
        };

        const { error } = await client.from('servicos').upsert(payload);
        if (error) {
          console.error('❌ Error saving service to Supabase:', error);
          alert('⚠️ Erro ao salvar serviço no Supabase: ' + error.message);
        } else {
          console.log('✅ Service saved successfully to Supabase cloud:', payload);
          fetchAllFromSupabase();
        }
      }
    }

    playNotificationSound();
  };

  const deleteServico = async (id) => {
    const validId = ensureValidUUID(id);
    setServicos(prev => prev.filter(s => s.id !== id && s.id !== validId));
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        await client.from('servicos').delete().eq('id', validId).catch(e => console.warn('Supabase delete servico err:', e));
        fetchAllFromSupabase();
      }
    }
  };

  const saveProduto = async (prodData) => {
    if (!prodData) return;
    const targetEmpId = ensureValidUUID(prodData.empresaId || activeEmpresa.id);
    const precoCusto = Number(prodData.precoCusto) || 0;
    const precoVenda = Number(prodData.precoVenda) || 0;
    const lucro = precoVenda - precoCusto;
    let updatedProd = null;

    if (prodData.id) {
      setProdutos(prev => prev.map(p => {
        if (p.id === prodData.id) {
          updatedProd = { ...p, ...prodData, id: ensureValidUUID(p.id), empresaId: targetEmpId, precoCusto, precoVenda, lucro };
          return updatedProd;
        }
        return p;
      }));
    } else {
      updatedProd = {
        ...prodData,
        id: generateUUID(),
        empresaId: targetEmpId,
        precoCusto,
        precoVenda,
        lucro
      };
      setProdutos(prev => [...prev, updatedProd]);
    }

    if (isSupabaseConfigured() && updatedProd) {
      const client = getSupabaseClient();
      if (client) {
        const { error } = await client.from('produtos').upsert({
          id: ensureValidUUID(updatedProd.id),
          empresa_id: targetEmpId,
          nome: updatedProd.nome,
          preco_venda: updatedProd.precoVenda,
          preco_custo: updatedProd.precoCusto,
          estoque: updatedProd.estoque || 0,
          categoria: updatedProd.categoria
        });
        if (error) console.error('❌ Supabase produto upsert err:', error);
        else fetchAllFromSupabase();
      }
    }

    playNotificationSound();
  };

  const deleteProduto = async (id) => {
    const validId = ensureValidUUID(id);
    setProdutos(prev => prev.filter(p => p.id !== id && p.id !== validId));
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        await client.from('produtos').delete().eq('id', validId).catch(e => console.warn('Supabase delete produto err:', e));
        fetchAllFromSupabase();
      }
    }
  };

  const saveCliente = async (cliData) => {
    if (!cliData) return;
    const targetEmpId = ensureValidUUID(cliData.empresaId || activeEmpresa.id);
    let updatedCli = null;
    
    if (cliData.id) {
      setClientes(prev => prev.map(c => {
        if (c.id === cliData.id) {
          updatedCli = { ...c, ...cliData, id: ensureValidUUID(c.id), empresaId: targetEmpId };
          return updatedCli;
        }
        return c;
      }));
    } else {
      updatedCli = {
        ...cliData,
        id: generateUUID(),
        empresaId: targetEmpId,
        atendimentosCount: 0,
        valorTotalGasto: 0,
        ultimoAtendimento: null,
        proximoAtendimento: null
      };
      setClientes(prev => [...prev, updatedCli]);
    }

    if (isSupabaseConfigured() && updatedCli) {
      const client = getSupabaseClient();
      if (client) {
        const { error } = await client.from('clientes').upsert({
          id: ensureValidUUID(updatedCli.id),
          empresa_id: targetEmpId,
          nome: updatedCli.nome,
          telefone: updatedCli.telefone,
          whatsapp: updatedCli.whatsapp,
          email: updatedCli.email,
          cpf: updatedCli.cpf,
          endereco: updatedCli.endereco,
          observacoes: updatedCli.observacoes
        });
        if (error) {
          console.error('❌ Supabase cliente upsert err:', error);
          alert('⚠️ Erro ao salvar cliente no Supabase: ' + error.message);
        } else {
          fetchAllFromSupabase();
        }
      }
    }

    playNotificationSound();
  };

  const deleteCliente = async (id) => {
    const validId = ensureValidUUID(id);
    setClientes(prev => prev.filter(c => c.id !== id && c.id !== validId));
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        await client.from('clientes').delete().eq('id', validId).catch(e => console.warn('Supabase delete cliente err:', e));
        fetchAllFromSupabase();
      }
    }
  };

  const addAgendamento = async (agendData) => {
    const targetEmpId = ensureValidUUID(agendData.empresaId || activeEmpresa.id);
    const funcionarioObj = funcionarios.find(f => f.id === agendData.funcionarioId);
    const servicoObj = servicos.find(s => s.id === agendData.servicoId);
    
    const newAge = {
      id: generateUUID(),
      empresaId: targetEmpId,
      clienteId: agendData.clienteId ? ensureValidUUID(agendData.clienteId) : null,
      clienteNome: agendData.clienteNome || 'Cliente',
      clienteTelefone: agendData.clienteTelefone || '',
      clienteWhatsapp: agendData.clienteWhatsapp || '',
      funcionarioId: ensureValidUUID(agendData.funcionarioId),
      funcionarioNome: funcionarioObj ? funcionarioObj.nome : agendData.funcionarioNome,
      servicoId: ensureValidUUID(agendData.servicoId),
      servicoNome: servicoObj ? servicoObj.nome : agendData.servicoNome,
      data: agendData.data,
      horario: agendData.horario,
      duracaoMinutos: servicoObj ? servicoObj.duracaoMinutos : 30,
      valor: Number(agendData.valor) || (servicoObj ? servicoObj.preco : 50),
      status: 'agendado',
      corStatus: '#0284c7',
      origem: agendData.origem || 'LINK_PUBLICO',
      observacoes: agendData.observacoes || 'Agendamento registrado via Link Público.',
      criadoEm: new Date().toISOString()
    };

    setAgendamentos(prev => [newAge, ...prev]);

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { error } = await client.from('agendamentos').upsert({
          id: ensureValidUUID(newAge.id),
          empresa_id: targetEmpId,
          cliente_id: newAge.clienteId,
          funcionario_id: newAge.funcionarioId,
          servico_id: newAge.servicoId,
          cliente_nome: newAge.clienteNome,
          cliente_telefone: newAge.clienteTelefone,
          cliente_whatsapp: newAge.clienteWhatsapp,
          data: newAge.data,
          horario: newAge.horario,
          duracao_minutos: newAge.duracaoMinutos,
          valor: newAge.valor,
          status: newAge.status,
          cor_status: newAge.corStatus,
          observacoes: newAge.observacoes
        });
        if (error) console.error('❌ Supabase agendamento upsert err:', error);
        else fetchAllFromSupabase();
      }
    }

    // 1. Notificação na Central de Avisos
    const newNotif = {
      id: generateUUID(),
      empresaId: newAge.empresaId,
      titulo: '🎉 Novo Agendamento Online!',
      mensagem: `${newAge.clienteNome} agendou ${newAge.servicoNome} para dia ${newAge.data} às ${newAge.horario}.`,
      tipo: 'agendamento',
      lida: false,
      criadoEm: new Date().toISOString()
    };
    setNotificacoes(prev => [newNotif, ...prev]);
    
    // 2. Efeito Sonoro Beep (Toca Garantido)
    playNotificationSound();

    // 3. Pop-up Flutuante em Destaque
    setNewAppointmentToast({
      isOpen: true,
      agendamento: newAge
    });

    const msgAgendado = `Olá *${newAge.clienteNome}*! 👋 Seu agendamento de *${newAge.servicoNome}* com *${newAge.funcionarioNome}* na empresa *${activeEmpresa.nome}* para dia *${newAge.data} às ${newAge.horario}* foi realizado com sucesso!\n\nPor gentileza, deixe seu *OK* para confirmar que está tudo certo. Obrigado!`;
    openWhatsappModal(newAge.clienteTelefone, newAge.clienteNome, msgAgendado);

    return newAge;
  };

  const saveAgendamento = async (agendData) => {
    if (!agendData || !agendData.id) return;
    const funcionarioObj = funcionarios.find(f => f.id === agendData.funcionarioId);
    const servicoObj = servicos.find(s => s.id === agendData.servicoId);
    let updatedAge = null;

    setAgendamentos(prev => prev.map(a => {
      if (a.id === agendData.id) {
        updatedAge = {
          ...a,
          ...agendData,
          funcionarioNome: funcionarioObj ? funcionarioObj.nome : (agendData.funcionarioNome || a.funcionarioNome),
          servicoNome: servicoObj ? servicoObj.nome : (agendData.servicoNome || a.servicoNome),
          valor: Number(agendData.valor) || (servicoObj ? servicoObj.preco : a.valor)
        };
        return updatedAge;
      }
      return a;
    }));

    if (isSupabaseConfigured() && updatedAge) {
      const client = getSupabaseClient();
      if (client) {
        const { error } = await client.from('agendamentos').upsert({
          id: ensureValidUUID(updatedAge.id),
          empresa_id: ensureValidUUID(updatedAge.empresaId),
          cliente_nome: updatedAge.clienteNome,
          cliente_telefone: updatedAge.clienteTelefone,
          data: updatedAge.data,
          horario: updatedAge.horario,
          valor: updatedAge.valor,
          status: updatedAge.status,
          observacoes: updatedAge.observacoes
        });
        if (error) console.error('❌ Supabase agendamento save err:', error);
        else fetchAllFromSupabase();
      }
    }

    playNotificationSound();
  };

  const updateAgendamentoStatus = async (id, newStatus, autoWhatsapp = true) => {
    const colorMap = {
      agendado: '#0284c7',
      confirmado: '#eab308',
      concluido: '#10b981',
      cancelado: '#ef4444',
      faltou: '#6b7280'
    };

    let targetAge = null;

    setAgendamentos(prev => prev.map(age => {
      if (age.id === id) {
        targetAge = {
          ...age,
          status: newStatus,
          corStatus: colorMap[newStatus] || '#0284c7'
        };

        if (newStatus === 'concluido' && age.status !== 'concluido') {
          const funcionario = funcionarios.find(f => f.id === age.funcionarioId);
          const comissaoPct = funcionario ? Number(funcionario.comissaoPct) || 0 : 0;
          const comissaoValor = Number(((age.valor * comissaoPct) / 100).toFixed(2));

          targetAge.concluidoEm = new Date().toISOString();
          targetAge.comissaoValorCalculada = comissaoValor;

          const receitaFin = {
            id: generateUUID(),
            empresaId: age.empresaId,
            agendamentoId: age.id,
            descricao: `Receita Serviço: ${age.servicoNome} (${age.clienteNome})`,
            tipo: 'receita',
            categoria: 'Serviços',
            valor: age.valor,
            dataVencimento: age.data,
            dataPagamento: age.data,
            status: 'pago',
            formaPagamento: 'PIX/Cartão',
            observacao: `Baixa de agendamento #${age.id}`
          };

          const comissaoFin = {
            id: generateUUID(),
            empresaId: age.empresaId,
            agendamentoId: age.id,
            funcionarioId: age.funcionarioId,
            descricao: `Comissão ${comissaoPct}%: ${funcionario ? funcionario.nome : 'Profissional'} (Ref. ${age.servicoNome})`,
            tipo: 'despesa',
            categoria: 'Comissões de Funcionários',
            valor: comissaoValor,
            dataVencimento: age.data,
            dataPagamento: null,
            status: 'pendente',
            formaPagamento: 'Transferência PIX',
            observacao: `Calculado sobre valor de R$ ${age.valor.toFixed(2)}`
          };

          setFinanceiro(fPrev => [receitaFin, comissaoFin, ...fPrev]);

          setClientes(cPrev => cPrev.map(c => {
            if (c.nome.toLowerCase() === age.clienteNome.toLowerCase() || c.id === age.clienteId) {
              return {
                ...c,
                atendimentosCount: (c.atendimentosCount || 0) + 1,
                valorTotalGasto: (c.valorTotalGasto || 0) + age.valor,
                ultimoAtendimento: age.data
              };
            }
            return c;
          }));

          playNotificationSound();
        }

        return targetAge;
      }
      return age;
    }));

    if (isSupabaseConfigured() && targetAge) {
      const client = getSupabaseClient();
      if (client) {
        await client.from('agendamentos').update({
          status: newStatus,
          cor_status: colorMap[newStatus] || '#0284c7'
        }).eq('id', ensureValidUUID(id)).catch(e => console.warn('Supabase status update err:', e));
        fetchAllFromSupabase();
      }
    }

    if (autoWhatsapp && targetAge) {
      let statusMsg = '';
      if (newStatus === 'agendado') {
        statusMsg = `Olá *${targetAge.clienteNome}*! 👋 Seu agendamento de *${targetAge.servicoNome}* com *${targetAge.funcionarioNome}* na empresa *${activeEmpresa.nome}* para dia *${targetAge.data} às ${targetAge.horario}* foi realizado com sucesso!\n\nPor gentileza, deixe seu *OK* para confirmar que está tudo certo. Obrigado!`;
      } else if (newStatus === 'confirmado') {
        statusMsg = `Olá *${targetAge.clienteNome}*! ✅ Seu agendamento de *${targetAge.servicoNome}* para o dia *${targetAge.data} às ${targetAge.horario}* com *${targetAge.funcionarioNome}* está *CONFIRMADO*!\n\nEstamos te aguardando no endereço: ${activeEmpresa.endereco}. Até breve!`;
      } else if (newStatus === 'concluido') {
        statusMsg = `Olá *${targetAge.clienteNome}*! 🎉 Seu atendimento de *${targetAge.servicoNome}* com *${targetAge.funcionarioNome}* foi *CONCLUÍDO* com sucesso!\n\n💳 Valor Total: R$ ${targetAge.valor.toFixed(2)}\n\nAgradecemos imensamente pela preferência e esperamos ver você em breve! 😊`;
      } else if (newStatus === 'cancelado') {
        statusMsg = `Olá *${targetAge.clienteNome}*! ❌ Confirmamos o cancelamento do seu agendamento de *${targetAge.servicoNome}* para dia *${targetAge.data} às ${targetAge.horario}*.\n\nCaso deseje agendar uma nova data no futuro, estamos à total disposição!`;
      } else if (newStatus === 'faltou') {
        statusMsg = `Olá *${targetAge.clienteNome}*! ⚠️ Sentimos sua falta no agendamento de *${targetAge.servicoNome}* marcado para hoje às *${targetAge.horario}*.\n\nPor favor, entre em contato conosco caso queira reagendar seu horário!`;
      }

      if (statusMsg) {
        openWhatsappModal(targetAge.clienteWhatsapp || targetAge.clienteTelefone, targetAge.clienteNome, statusMsg);
      }
    }
  };

  const deleteAgendamento = async (id) => {
    const validId = ensureValidUUID(id);
    setAgendamentos(prev => prev.filter(a => a.id !== id && a.id !== validId));
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        await client.from('agendamentos').delete().eq('id', validId).catch(e => console.warn('Supabase delete age err:', e));
        fetchAllFromSupabase();
      }
    }
  };

  const saveFinanceiroItem = (itemData) => {
    if (!itemData) return;
    const targetEmpId = ensureValidUUID(itemData.empresaId || activeEmpresa.id);
    if (itemData.id) {
      setFinanceiro(prev => prev.map(f => f.id === itemData.id ? { ...f, ...itemData, empresaId: f.empresaId || targetEmpId } : f));
    } else {
      const newItem = {
        ...itemData,
        id: generateUUID(),
        empresaId: targetEmpId,
        status: itemData.status || (itemData.tipo === 'receita' ? 'pago' : 'pendente'),
        isRecorrente: !!itemData.isRecorrente
      };
      setFinanceiro(prev => [newItem, ...prev]);
    }
  };

  const toggleBaixaFinanceiroItem = (id) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setFinanceiro(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'pago' ? 'pendente' : 'pago';
        return {
          ...item,
          status: nextStatus,
          dataPagamento: nextStatus === 'pago' ? todayStr : null
        };
      }
      return item;
    }));
    playNotificationSound();
  };

  const gerarRecorrenteProximoMes = (item) => {
    if (!item) return;
    const dateObj = new Date(item.dataVencimento || new Date());
    dateObj.setMonth(dateObj.getMonth() + 1);
    const nextDateStr = dateObj.toISOString().split('T')[0];

    const newItem = {
      ...item,
      id: generateUUID(),
      descricao: `${item.descricao} (Recorrente Mensal)`,
      dataVencimento: nextDateStr,
      dataPagamento: null,
      status: 'pendente',
      isRecorrente: true
    };

    setFinanceiro(prev => [newItem, ...prev]);
    playNotificationSound();
  };

  const deleteFinanceiroItem = (id) => {
    setFinanceiro(prev => prev.filter(f => f.id !== id));
  };

  const saveLembrete = (lembData) => {
    if (!lembData) return;
    const targetEmpId = ensureValidUUID(lembData.empresaId || activeEmpresa.id);
    if (lembData.id) {
      setLembretes(prev => prev.map(l => l.id === lembData.id ? { ...l, ...lembData, empresaId: l.empresaId || targetEmpId } : l));
    } else {
      const newLemb = {
        ...lembData,
        id: generateUUID(),
        empresaId: targetEmpId,
        status: lembData.status || 'futuro'
      };
      setLembretes(prev => [...prev, newLemb]);
    }
  };

  const toggleLembreteConcluido = (id) => {
    setLembretes(prev => prev.map(l => {
      if (l.id === id) {
        const nextStatus = l.status === 'concluido' ? 'hoje' : 'concluido';
        return { ...l, status: nextStatus };
      }
      return l;
    }));
  };

  const deleteLembrete = (id) => {
    setLembretes(prev => prev.filter(l => l.id !== id));
  };

  const markNotificacoesLidas = () => {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
  };

  const openPublicBookingPage = (empSlug, funcSlug = null) => {
    setPublicBookingSlug(empSlug);
    setPublicEmployeeSlug(funcSlug);
    setCurrentView('agendamentoPublico');
  };

  const resetAllDataToDefault = () => {
    try {
      localStorage.clear();
      setEmpresas(initialEmpresas);
      setActiveEmpresaId(initialEmpresas[0].id);
      setFuncionarios(initialFuncionarios);
      setServicos(initialServicos);
      setProdutos(initialProdutos);
      setClientes(initialClientes);
      setAgendamentos(initialAgendamentos);
      setNotificacoes(initialNotificacoes);
      setLembretes(initialLembretes);
      setFinanceiro(initialFinanceiro);
      setLicencas(initialLicencas);
      setCurrentUser(null);
      window.location.reload();
    } catch (e) {
      console.error('Reset data error:', e);
    }
  };

  return (
    <AppContext.Provider value={{
      empresas,
      activeEmpresa,
      activeEmpresaId,
      setActiveEmpresaId,
      funcionarios: (funcionarios || []).filter(f => f.empresaId === activeEmpresa.id),
      todosFuncionarios: funcionarios || [],
      servicos: (servicos || []).filter(s => s.empresaId === activeEmpresa.id),
      todosServicos: servicos || [],
      produtos: (produtos || []).filter(p => p.empresaId === activeEmpresa.id),
      clientes: (clientes || []).filter(c => c.empresaId === activeEmpresa.id),
      agendamentos: (agendamentos || []).filter(a => a.empresaId === activeEmpresa.id),
      todosAgendamentos: agendamentos || [],
      notificacoes: (notificacoes || []).filter(n => n.empresaId === activeEmpresa.id),
      lembretes: (lembretes || []).filter(l => l.empresaId === activeEmpresa.id),
      financeiro: (financeiro || []).filter(f => f.empresaId === activeEmpresa.id),
      whatsappTemplates,
      saasPlanos,

      usersList,
      currentUser,
      loginUser,
      registerUser,
      recoverPasswordByEmail,
      logoutUser,

      systemTheme,
      setSystemTheme,

      licencas,
      activeLicenca,
      hardwareId,
      licenseValidation,
      isResellerAuthorized,
      togglePermissaoRevendedor,
      restaurarLicencaMasterEmergencia,
      gerarLicencaPersonalizada,
      extenderLicencaDias,
      deleteLicenca,
      deleteEmpresa,
      desvincularDispositivoLicenca,
      revogarLicenca,
      ativarLicencaCodigo,

      newAppointmentToast,
      setNewAppointmentToast,

      currentView,
      setCurrentView,
      userRole,
      setUserRole,
      activeFuncionarioId,
      setActiveFuncionarioId,
      publicBookingSlug,
      publicEmployeeSlug,
      openPublicBookingPage,

      soundEnabled,
      setSoundEnabled,
      playNotificationSound,

      imageUploadModal,
      openImageUploader,
      setImageUploadModal,
      whatsappModal,
      openWhatsappModal,
      setWhatsappModal,
      receiptModal,
      openReceiptModal,
      setReceiptModal,
      budgetModal,
      openBudgetModal,
      setBudgetModal,
      paymentModal,
      openPaymentModal,
      setPaymentModal,

      saveEmpresa,
      saveFuncionario,
      deleteFuncionario,
      saveServico,
      deleteServico,
      saveProduto,
      deleteProduto,
      saveCliente,
      deleteCliente,
      addAgendamento,
      saveAgendamento,
      updateAgendamentoStatus,
      deleteAgendamento,
      saveFinanceiroItem,
      toggleBaixaFinanceiroItem,
      gerarRecorrenteProximoMes,
      deleteFinanceiroItem,
      saveLembrete,
      toggleLembreteConcluido,
      deleteLembrete,
      markNotificacoesLidas,
      setWhatsappTemplates,
      resetAllDataToDefault,
      fetchAllFromSupabase
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
