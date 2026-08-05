// Production Clean Initial Data - All Demo/Fake Data Removed
// Ready for buyers to register their own REAL company, employees, services, and clients.

export const initialEmpresas = [
  {
    id: 'emp-1',
    slug: 'minha-empresa',
    nome: 'Minha Empresa',
    nomeProprietario: 'Proprietário',
    responsavel: 'Proprietário',
    cnp: '',
    segmento: 'Comercial',
    logo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=80',
    capa: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&auto=format&fit=crop&q=80',
    telefone: '(11) 98589-7774',
    whatsapp: '(11) 98589-7774',
    email: 'contato@minhaempresa.com.br',
    site: '',
    instagram: '',
    facebook: '',
    endereco: 'Digite seu endereço em Configurações',
    cidade: 'Sua Cidade',
    estado: 'UF',
    cep: '',
    descricao: 'Configure os dados e história da sua empresa no menu Configurações.',
    horarioFuncionamento: 'Segunda a Sábado: 08:00 - 18:00',
    diasAtendimento: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
    tempoPadraoServico: 30,
    fusoHorario: 'America/Sao_Paulo',
    dominioProprio: '',
    plano: 'SaaS Pro',
    isReseller: true,
    status: 'ativo'
  }
];

export const initialFuncionarios = [];

export const initialServicos = [];

export const initialProdutos = [];

export const initialClientes = [];

export const initialAgendamentos = [];

export const initialNotificacoes = [];

export const initialLembretes = [];

export const initialFinanceiro = [];

export const initialLicencas = [
  {
    id: 'lic-master-initial',
    codigoAtivacao: 'AGY-MASTER-RECOVERY-2026',
    empresaId: 'emp-1',
    empresaNome: 'Minha Empresa',
    duracao: '1_ANO',
    plano: 'ANUAL',
    status: 'ATIVO',
    dataExpiracaoIso: '2030-12-31T23:59:59.000Z',
    dataExpiracao: '2030-12-31',
    dispositivoVinculadoId: null,
    criadoEm: new Date().toISOString()
  }
];

export const defaultWhatsappTemplates = [
  {
    id: 'tpl-1',
    titulo: 'Confirmação de Agendamento',
    gatilho: 'agendado',
    mensagem: 'Olá *{CLIENTE_NOME}*! 👋 Confirmamos seu agendamento de *{SERVICO_NOME}* com *{PROFISSIONAL_NOME}* para dia *{DATA} às {HORARIO}*.\n\nPor favor, deixe seu OK para confirmar!'
  },
  {
    id: 'tpl-2',
    titulo: 'Lembrete de Horário',
    gatilho: 'lembrete',
    mensagem: 'Olá *{CLIENTE_NOME}*! ⏰ Lembramos do seu horário marcado hoje às *{HORARIO}* para *{SERVICO_NOME}* na empresa *{EMPRESA_NOME}*. Estamos te aguardando!'
  },
  {
    id: 'tpl-3',
    titulo: 'Agradecimento Pós-Atendimento',
    gatilho: 'concluido',
    mensagem: 'Olá *{CLIENTE_NOME}*! 🎉 Seu atendimento foi concluído com sucesso. Agradecemos muito pela preferência e até a próxima!'
  }
];

export const saasPlanos = [
  {
    id: 'plano-mensal',
    nome: 'Plano Mensal',
    preco: 97.00,
    periodo: 'mês',
    recursos: ['Agendamentos Ilimitados', 'Equipe Sem Limites', 'WhatsApp Direto', 'Controle Financeiro Completo']
  },
  {
    id: 'plano-anual',
    nome: 'Plano Anual (Recomendado)',
    preco: 797.00,
    periodo: 'ano',
    recursos: ['Economia de 30%', 'Agendamentos Ilimitados', 'Equipe Sem Limites', 'Recibos & Orçamentos', 'Suporte Prioritário VIP']
  }
];
