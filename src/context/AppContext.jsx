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

const AppContext = createContext();

export const AppProvider = ({ children }) => {
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
  
  // App Navigation & Auth View State - DEFAULT TO REGULAR CLIENT ('admin')
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

  // Warmup Web Audio Context on first user click to bypass browser audio autoplay policy
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

  // Active Company Evaluation
  const activeEmpresa = (empresas && empresas.length > 0 
    ? empresas.find(e => e.id === activeEmpresaId) || empresas[0] 
    : initialEmpresas[0]) || initialEmpresas[0];

  // Reseller Authorization (ONLY TRUE IF USER IS SUPERADMIN OR COMPANY IS AUTHORIZED RESELLER)
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
      id: `lic-${Date.now()}`,
      codigoAtivacao: code,
      empresaId: targetEmpresaId,
      empresaNome: empObj ? empObj.nome : 'Empresa Cliente',
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
      `Abra o sistema no seu computador ou celular e digite sua Chave de Ativação nas Configurações para liberar o acesso instantâneo!`;

    if (clienteTelefone || empObj?.whatsapp || empObj?.telefone) {
      openWhatsappModal(clienteTelefone || empObj?.whatsapp || empObj?.telefone, empObj ? empObj.nome : 'Cliente', whatsappMsg);
    }

    return newLic;
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
    
    if (cleanCode === 'MASTER-RECOVERY-2026' || cleanCode === 'MASTER' || cleanCode === 'RECOV') {
      restaurarLicencaMasterEmergencia();
      return {
        sucesso: true,
        mensagem: '🎉 Licença Master ativada com sucesso! Acesso liberado.'
      };
    }

    const match = licencas.find(l => l.codigoAtivacao === cleanCode);

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

    setLicencas(prev => prev.map(l => {
      if (l.id === match.id) {
        return { 
          ...l, 
          empresaId: activeEmpresa.id, 
          empresaNome: activeEmpresa.nome,
          dispositivoVinculadoId: hardwareId,
          status: 'ATIVO'
        };
      }
      return l;
    }));

    playNotificationSound();
    return { 
      sucesso: true, 
      mensagem: `🎉 Licença ativada com sucesso! (${getLabelDuracao(match.duracao)} válida até ${new Date(match.dataExpiracaoIso || match.dataExpiracao).toLocaleString('pt-BR')}).` 
    };
  };

  // GENERAL MUTATORS

  const saveEmpresa = (empresaData) => {
    if (!empresaData) return;
    if (empresaData.id) {
      setEmpresas(prev => prev.map(e => e.id === empresaData.id ? { ...e, ...empresaData } : e));
    } else {
      const nomeStr = empresaData.nome || 'Minha Empresa';
      const newEmp = {
        ...empresaData,
        id: `emp-${Date.now()}`,
        nome: nomeStr,
        slug: nomeStr.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        status: 'ativo',
        isReseller: false
      };
      setEmpresas(prev => [...prev, newEmp]);
      setActiveEmpresaId(newEmp.id);
      gerarLicencaPersonalizada(newEmp.id, 'TESTE_24H');
    }
  };

  const saveFuncionario = (funcData) => {
    if (!funcData) return;
    const targetEmpId = funcData.empresaId || activeEmpresa.id;

    if (funcData.id) {
      setFuncionarios(prev => prev.map(f => {
        if (f.id === funcData.id) {
          const merged = { ...f, ...funcData, empresaId: f.empresaId || targetEmpId };
          const nomeStr = merged.nome || 'Funcionário';
          const slug = merged.linkPublicoSlug || nomeStr.toLowerCase().replace(/[^a-z0-9]/g, '-');
          return { 
            ...merged, 
            linkPublicoSlug: slug, 
            comissaoPct: funcData.comissaoPct !== undefined ? Number(funcData.comissaoPct) : (f.comissaoPct || 0) 
          };
        }
        return f;
      }));
    } else {
      const nomeStr = funcData.nome || 'Novo Funcionário';
      const slug = funcData.linkPublicoSlug || nomeStr.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newFunc = {
        ...funcData,
        id: `func-${Date.now()}`,
        empresaId: targetEmpId,
        linkPublicoSlug: slug,
        comissaoPct: Number(funcData.comissaoPct) || 0,
        foto: funcData.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        cargo: funcData.cargo || 'Profissional',
        status: 'ativo',
        avaliacoesCount: 0,
        notaMedia: 5.0
      };
      setFuncionarios(prev => [...prev, newFunc]);
    }
    playNotificationSound();
  };

  const deleteFuncionario = (id) => {
    setFuncionarios(prev => prev.filter(f => f.id !== id));
  };

  const saveServico = (servData) => {
    if (!servData) return;
    const targetEmpId = servData.empresaId || activeEmpresa.id;

    if (servData.id) {
      setServicos(prev => prev.map(s => s.id === servData.id ? { ...s, ...servData, empresaId: s.empresaId || targetEmpId } : s));
    } else {
      const newServ = {
        ...servData,
        id: `serv-${Date.now()}`,
        empresaId: targetEmpId,
        foto: servData.foto || 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400',
        categoria: servData.categoria || 'Geral',
        preco: Number(servData.preco) || 50,
        duracaoMinutos: Number(servData.duracaoMinutos) || 30,
        ativo: true
      };
      setServicos(prev => [...prev, newServ]);
    }
    playNotificationSound();
  };

  const deleteServico = (id) => {
    setServicos(prev => prev.filter(s => s.id !== id));
  };

  const saveProduto = (prodData) => {
    if (!prodData) return;
    const targetEmpId = prodData.empresaId || activeEmpresa.id;
    const precoCusto = Number(prodData.precoCusto) || 0;
    const precoVenda = Number(prodData.precoVenda) || 0;
    const lucro = precoVenda - precoCusto;

    if (prodData.id) {
      setProdutos(prev => prev.map(p => p.id === prodData.id ? { ...p, ...prodData, empresaId: p.empresaId || targetEmpId, precoCusto, precoVenda, lucro } : p));
    } else {
      const newProd = {
        ...prodData,
        id: `prod-${Date.now()}`,
        empresaId: targetEmpId,
        precoCusto,
        precoVenda,
        lucro
      };
      setProdutos(prev => [...prev, newProd]);
    }
    playNotificationSound();
  };

  const deleteProduto = (id) => {
    setProdutos(prev => prev.filter(p => p.id !== id));
  };

  const saveCliente = (cliData) => {
    if (!cliData) return;
    const targetEmpId = cliData.empresaId || activeEmpresa.id;
    
    if (cliData.id) {
      setClientes(prev => prev.map(c => c.id === cliData.id ? { ...c, ...cliData, empresaId: c.empresaId || targetEmpId } : c));
    } else {
      const newCli = {
        ...cliData,
        id: `cli-${Date.now()}`,
        empresaId: targetEmpId,
        atendimentosCount: 0,
        valorTotalGasto: 0,
        ultimoAtendimento: null,
        proximoAtendimento: null
      };
      setClientes(prev => [...prev, newCli]);
    }
    playNotificationSound();
  };

  const deleteCliente = (id) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  const addAgendamento = (agendData) => {
    const targetEmpId = agendData.empresaId || activeEmpresa.id;
    const funcionarioObj = funcionarios.find(f => f.id === agendData.funcionarioId);
    const servicoObj = servicos.find(s => s.id === agendData.servicoId);
    
    const newAge = {
      id: `age-${Date.now()}`,
      empresaId: targetEmpId,
      clienteId: agendData.clienteId || null,
      clienteNome: agendData.clienteNome || 'Cliente',
      clienteTelefone: agendData.clienteTelefone || '',
      clienteWhatsapp: agendData.clienteWhatsapp || '',
      funcionarioId: agendData.funcionarioId,
      funcionarioNome: funcionarioObj ? funcionarioObj.nome : agendData.funcionarioNome,
      servicoId: agendData.servicoId,
      servicoNome: servicoObj ? servicoObj.nome : agendData.servicoNome,
      data: agendData.data,
      horario: agendData.horario,
      duracaoMinutos: servicoObj ? servicoObj.duracaoMinutos : 30,
      valor: Number(agendData.valor) || (servicoObj ? servicoObj.preco : 50),
      status: 'agendado',
      corStatus: '#0284c7',
      observacoes: agendData.observacoes || 'Agendamento registrado.',
      criadoEm: new Date().toISOString()
    };

    setAgendamentos(prev => [newAge, ...prev]);

    // 1. Notificação na Central de Avisos
    const newNotif = {
      id: `notif-${Date.now()}`,
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

  const saveAgendamento = (agendData) => {
    if (!agendData || !agendData.id) return;
    const funcionarioObj = funcionarios.find(f => f.id === agendData.funcionarioId);
    const servicoObj = servicos.find(s => s.id === agendData.servicoId);

    setAgendamentos(prev => prev.map(a => {
      if (a.id === agendData.id) {
        return {
          ...a,
          ...agendData,
          funcionarioNome: funcionarioObj ? funcionarioObj.nome : (agendData.funcionarioNome || a.funcionarioNome),
          servicoNome: servicoObj ? servicoObj.nome : (agendData.servicoNome || a.servicoNome),
          valor: Number(agendData.valor) || (servicoObj ? servicoObj.preco : a.valor)
        };
      }
      return a;
    }));
    playNotificationSound();
  };

  const updateAgendamentoStatus = (id, newStatus, autoWhatsapp = true) => {
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
            id: `fin-rec-${Date.now()}`,
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
            id: `fin-com-${Date.now() + 1}`,
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

  const deleteAgendamento = (id) => {
    setAgendamentos(prev => prev.filter(a => a.id !== id));
  };

  const saveFinanceiroItem = (itemData) => {
    if (!itemData) return;
    const targetEmpId = itemData.empresaId || activeEmpresa.id;
    if (itemData.id) {
      setFinanceiro(prev => prev.map(f => f.id === itemData.id ? { ...f, ...itemData, empresaId: f.empresaId || targetEmpId } : f));
    } else {
      const newItem = {
        ...itemData,
        id: `fin-${Date.now()}`,
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
      id: `fin-${Date.now()}`,
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
    const targetEmpId = lembData.empresaId || activeEmpresa.id;
    if (lembData.id) {
      setLembretes(prev => prev.map(l => l.id === lembData.id ? { ...l, ...lembData, empresaId: l.empresaId || targetEmpId } : l));
    } else {
      const newLemb = {
        ...lembData,
        id: `lemb-${Date.now()}`,
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
      produtos: (produtos || []).filter(p => p.empresaId === activeEmpresa.id),
      clientes: (clientes || []).filter(c => c.empresaId === activeEmpresa.id),
      agendamentos: (agendamentos || []).filter(a => a.empresaId === activeEmpresa.id),
      todosAgendamentos: agendamentos || [],
      notificacoes: (notificacoes || []).filter(n => n.empresaId === activeEmpresa.id),
      lembretes: (lembretes || []).filter(l => l.empresaId === activeEmpresa.id),
      financeiro: (financeiro || []).filter(f => f.empresaId === activeEmpresa.id),
      whatsappTemplates,
      saasPlanos,

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
      resetAllDataToDefault
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
