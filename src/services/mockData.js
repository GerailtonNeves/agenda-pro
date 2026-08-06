// Production Clean Initial Data - All Demo/Fake Data Removed
// Ready for buyers to register their own REAL company, employees, services, and clients.

export const initialEmpresas = [
  {
    id: '11111111-1111-1111-1111-111111111111',
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
    empresaId: '11111111-1111-1111-1111-111111111111',
    empresaNome: 'Minha Empresa',
    duracao: '1_ANO',
    plano: 'ANUAL',
    status: 'ATIVO',
    dataExpiracaoIso: '2030-12-31T23:59:59.000Z',
    dataExpiracao: '2030-12-31',
    dispositivoVinculadoId: null
  }
];

export const defaultWhatsappTemplates = [
  {
    id: 'tpl-1',
    titulo: 'Lembrete 2 Horas Antes',
    gatilho: 'lembrete_2h',
    mensagem: 'Olá {cliente}! 👋 Lembrando do seu agendamento hoje às {horario} para {servico} com {profissional} na {empresa}. Confirma sua presença?'
  },
  {
    id: 'tpl-2',
    titulo: 'Confirmação de Agendamento',
    gatilho: 'novo_agendamento',
    mensagem: 'Olá {cliente}! 🎉 Seu agendamento de {servico} para dia {data} às {horario} com {profissional} foi realizado com sucesso!'
  }
];

export const saasPlanos = [
  {
    id: 'plano-mensal',
    nome: 'Plano Mensal Pro',
    preco: 99.90,
    duracao: '1_MES',
    recursos: ['Agendamentos Ilimitados', 'Página de Link 1 e Link 2', 'WhatsApp Automático', 'Multi-Profissional']
  },
  {
    id: 'plano-anual',
    nome: 'Plano Anual Master',
    preco: 899.00,
    duracao: '1_ANO',
    recursos: ['Economia de 25%', 'Suporte VIP 24h', 'Todas as Funcionalidades Pro', 'Domínio Personalizado']
  }
];
