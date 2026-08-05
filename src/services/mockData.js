// Initial Mock Data for Multi-tenant SaaS Appointment System

export const initialEmpresas = [
  {
    id: 'emp-1',
    slug: 'barbearia-viking',
    nome: 'Barbearia Viking & Club',
    cnp: '12.345.678/0001-90',
    segmento: 'Barbearia',
    logo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=80',
    capa: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&auto=format&fit=crop&q=80',
    telefone: '(11) 3456-7890',
    whatsapp: '5511999887766',
    email: 'contato@barbeariaviking.com.br',
    site: 'https://barbeariaviking.com.br',
    instagram: '@barbearia.viking',
    facebook: 'barbearia.viking',
    endereco: 'Av. Paulista, 1000 - Sala 42',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100',
    descricao: 'Especialistas em cortes modernos, barba com toalha quente, estética masculina e experiência premium.',
    horarioFuncionamento: 'Segunda a Sábado: 09:00 - 20:00',
    diasAtendimento: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
    tempoPadraoServico: 30,
    fusoHorario: 'America/Sao_Paulo',
    dominioProprio: 'agenda.barbeariaviking.com.br',
    plano: 'Pro Anual',
    status: 'ativo'
  },
  {
    id: 'emp-2',
    slug: 'clinica-estetica-lumina',
    nome: 'Clínica Estética Lumina',
    cnp: '98.765.432/0001-10',
    segmento: 'Clínica de Estética',
    logo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&auto=format&fit=crop&q=80',
    capa: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&auto=format&fit=crop&q=80',
    telefone: '(11) 4004-1234',
    whatsapp: '5511988776655',
    email: 'atendimento@clinicalumina.com.br',
    site: 'https://clinicalumina.com.br',
    instagram: '@estetica.lumina',
    facebook: 'lumina.estetica',
    endereco: 'Rua Oscar Freire, 500',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01426-000',
    descricao: 'Tratamentos faciais, corporais, harmonização e cuidados com a pele com dermatologistas e biomédicas altamente qualificadas.',
    horarioFuncionamento: 'Segunda a Sexta: 08:00 - 19:00',
    diasAtendimento: ['seg', 'ter', 'qua', 'qui', 'sex'],
    tempoPadraoServico: 45,
    fusoHorario: 'America/Sao_Paulo',
    dominioProprio: 'agendamento.clinicalumina.com.br',
    plano: 'Enterprise',
    status: 'ativo'
  }
];

export const initialFuncionarios = [
  {
    id: 'func-1',
    empresaId: 'emp-1',
    nome: 'Carlos "Viking" Silva',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    cargo: 'Barbeiro Master & Visagista',
    especialidades: ['Degradê', 'Barba Terapia', 'Platinado', 'Corte Tesoura'],
    telefone: '(11) 99123-4567',
    whatsapp: '5511991234567',
    email: 'carlos@viking.com.br',
    descricao: 'Mais de 10 anos de experiência em visagismo masculino e técnicas avançadas de navalha.',
    comissaoPct: 50, // 50% de comissão
    linkPublicoSlug: 'carlos-viking',
    corAgenda: '#0284c7', // Azul
    status: 'ativo',
    diasAtendimento: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
    horarioInicio: '09:00',
    horarioFim: '19:00',
    tempoIntervalo: 15,
    avaliacoesCount: 148,
    notaMedia: 4.9
  },
  {
    id: 'func-2',
    empresaId: 'emp-1',
    nome: 'Lucas Oliveira (Lukita)',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    cargo: 'Barbeiro Especialista',
    especialidades: ['Freestyle', 'Pigmentação', 'Corte Infantil'],
    telefone: '(11) 99876-5432',
    whatsapp: '5511998765432',
    email: 'lucas@viking.com.br',
    descricao: 'Campeão paulista de cortes urbanos e especialista em desenhos em navalha.',
    comissaoPct: 60, // 60% de comissão
    linkPublicoSlug: 'lucas-oliveira',
    corAgenda: '#10b981', // Verde
    status: 'ativo',
    diasAtendimento: ['ter', 'qua', 'qui', 'sex', 'sab'],
    horarioInicio: '10:00',
    horarioFim: '20:00',
    tempoIntervalo: 15,
    avaliacoesCount: 92,
    notaMedia: 4.8
  },
  {
    id: 'func-3',
    empresaId: 'emp-2',
    nome: 'Dra. Amanda Rodrigues',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    cargo: 'Biomédica Esteta',
    especialidades: ['Harmonização Facial', 'Botox', 'Preenchimento Labial', 'Peeling Químico'],
    telefone: '(11) 98888-1122',
    whatsapp: '5511988881122',
    email: 'amanda@clinicalumina.com.br',
    descricao: 'Doutora em Biomedicina com especialização na Harvard Medical Extension School.',
    comissaoPct: 40, // 40% de comissão
    linkPublicoSlug: 'dra-amanda-rodrigues',
    corAgenda: '#ec4899', // Rosa
    status: 'ativo',
    diasAtendimento: ['seg', 'qua', 'sex'],
    horarioInicio: '08:30',
    horarioFim: '18:00',
    tempoIntervalo: 30,
    avaliacoesCount: 215,
    notaMedia: 5.0
  }
];

export const initialServicos = [
  {
    id: 'serv-1',
    empresaId: 'emp-1',
    nome: 'Corte de Cabelo Premium + Lavagem',
    foto: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&auto=format&fit=crop&q=80',
    categoria: 'Cabelo',
    descricao: 'Corte sob medida com análise visagista, lavagem com shampoo revigorante e finalização com pomada importada.',
    preco: 75.00,
    duracaoMinutos: 40,
    cor: '#0284c7',
    modalidade: 'Presencial',
    ativo: true,
    ordem: 1
  },
  {
    id: 'serv-2',
    empresaId: 'emp-1',
    nome: 'Barba Terapia com Toalha Quente',
    foto: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=80',
    categoria: 'Barba',
    descricao: 'Modelagem de barba com esfoliação facial, óleos essenciais, aplicação de toalha quente e pós-barba suavizante.',
    preco: 55.00,
    duracaoMinutos: 35,
    cor: '#10b981',
    modalidade: 'Presencial',
    ativo: true,
    ordem: 2
  },
  {
    id: 'serv-3',
    empresaId: 'emp-1',
    nome: 'Combo Viking (Cabelo + Barba + Sobrancelha)',
    foto: 'https://images.unsplash.com/photo-1517832606589-7150a6d59187?w=400&auto=format&fit=crop&q=80',
    categoria: 'Combos',
    descricao: 'O pacote completo do homem moderno. Economize R$ 25 agendando o combo VIP com bebida cortesia.',
    preco: 115.00,
    duracaoMinutos: 65,
    cor: '#8b5cf6',
    modalidade: 'Presencial',
    ativo: true,
    ordem: 3
  },
  {
    id: 'serv-4',
    empresaId: 'emp-1',
    nome: 'Consultoria de Estilo Masculino Online',
    foto: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
    categoria: 'Consultoria',
    descricao: 'Sessão por videochamada para definição de estilo, cortes adequados ao formato de rosto e produtos ideais.',
    preco: 150.00,
    duracaoMinutos: 45,
    cor: '#f59e0b',
    modalidade: 'Online',
    ativo: true,
    ordem: 4
  }
];

export const initialProdutos = [
  {
    id: 'prod-1',
    empresaId: 'emp-1',
    nome: 'Pomada Modeladora Viking Matte 100g',
    foto: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
    categoria: 'Finalizadores',
    codigo: 'POM-VIK-01',
    fornecedor: 'Cosméticos Premium SP',
    estoque: 24,
    estoqueMinimo: 5,
    precoCusto: 22.00,
    precoVenda: 55.00,
    lucro: 33.00,
    descricao: 'Fixação forte com efeito opaco fosco natural. Não engordura os fios.'
  },
  {
    id: 'prod-2',
    empresaId: 'emp-1',
    nome: 'Óleo para Barba BarbaFlex 50ml',
    foto: 'https://images.unsplash.com/photo-1608248597261-83325805435f?w=400&auto=format&fit=crop&q=80',
    categoria: 'Barba',
    codigo: 'OLE-BAR-02',
    fornecedor: 'Naturals Beard Ltda',
    estoque: 18,
    estoqueMinimo: 5,
    precoCusto: 18.50,
    precoVenda: 48.00,
    lucro: 29.50,
    descricao: 'Hidratação profunda para os fios da barba com fragrância suave de amadeirado.'
  }
];

export const initialClientes = [
  {
    id: 'cli-1',
    empresaId: 'emp-1',
    nome: 'Roberto Albuquerque',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    telefone: '(11) 98765-1122',
    whatsapp: '5511987651122',
    email: 'roberto.albuquerque@gmail.com',
    cpf: '123.456.789-00',
    nascimento: '1988-04-12',
    endereco: 'Rua Pamplona, 120 - Ap 41',
    cidade: 'São Paulo',
    estado: 'SP',
    observacoes: 'Cliente VIP. Prefere café expresso sem açúcar durante o atendimento.',
    atendimentosCount: 14,
    valorTotalGasto: 1120.00,
    ultimoAtendimento: '2026-07-25',
    proximoAtendimento: '2026-08-04'
  },
  {
    id: 'cli-2',
    empresaId: 'emp-1',
    nome: 'Fernando Mendes',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    telefone: '(11) 97654-3344',
    whatsapp: '5511976543344',
    email: 'fernando.mendes@techcorp.com',
    cpf: '234.567.890-11',
    nascimento: '1992-09-28',
    endereco: 'Av. Brigadeiro Faria Lima, 3000',
    cidade: 'São Paulo',
    estado: 'SP',
    observacoes: 'Faz barba a cada 15 dias com o barbeiro Carlos.',
    atendimentosCount: 8,
    valorTotalGasto: 640.00,
    ultimoAtendimento: '2026-07-18',
    proximoAtendimento: null
  }
];

export const initialAgendamentos = [
  {
    id: 'age-101',
    empresaId: 'emp-1',
    clienteId: 'cli-1',
    clienteNome: 'Roberto Albuquerque',
    clienteTelefone: '(11) 98765-1122',
    clienteWhatsapp: '5511987651122',
    funcionarioId: 'func-1',
    funcionarioNome: 'Carlos "Viking" Silva',
    servicoId: 'serv-3',
    servicoNome: 'Combo Viking (Cabelo + Barba + Sobrancelha)',
    data: '2026-08-04',
    horario: '14:30',
    duracaoMinutos: 65,
    valor: 115.00,
    status: 'agendado', // agendado, confirmado, concluido, cancelado, faltou
    corStatus: '#0284c7',
    observacoes: 'Agendado pelo link público do profissional Carlos.',
    criadoEm: '2026-08-03T18:30:00Z'
  },
  {
    id: 'age-102',
    empresaId: 'emp-1',
    clienteId: 'cli-2',
    clienteNome: 'Fernando Mendes',
    clienteTelefone: '(11) 97654-3344',
    clienteWhatsapp: '5511976543344',
    funcionarioId: 'func-2',
    funcionarioNome: 'Lucas Oliveira (Lukita)',
    servicoId: 'serv-1',
    servicoNome: 'Corte de Cabelo Premium + Lavagem',
    data: '2026-08-04',
    horario: '16:00',
    duracaoMinutos: 40,
    valor: 75.00,
    status: 'confirmado',
    corStatus: '#eab308',
    observacoes: 'Cliente confirmou presença via WhatsApp.',
    criadoEm: '2026-08-02T10:15:00Z'
  },
  {
    id: 'age-100',
    empresaId: 'emp-1',
    clienteId: 'cli-1',
    clienteNome: 'Roberto Albuquerque',
    clienteTelefone: '(11) 98765-1122',
    clienteWhatsapp: '5511987651122',
    funcionarioId: 'func-1',
    funcionarioNome: 'Carlos "Viking" Silva',
    servicoId: 'serv-1',
    servicoNome: 'Corte de Cabelo Premium + Lavagem',
    data: '2026-08-01',
    horario: '10:00',
    duracaoMinutos: 40,
    valor: 75.00,
    status: 'concluido', // Concluído!
    corStatus: '#10b981',
    concluidoEm: '2026-08-01T10:45:00Z',
    comissaoValorCalculada: 37.50, // 50% de 75
    observacoes: 'Serviço concluído com sucesso.',
    criadoEm: '2026-07-30T14:00:00Z'
  }
];

export const initialNotificacoes = [
  {
    id: 'notif-1',
    empresaId: 'emp-1',
    titulo: 'Novo Agendamento Recebido!',
    mensagem: 'Roberto Albuquerque agendou Combo Viking para hoje às 14:30.',
    tipo: 'agendamento',
    lida: false,
    criadoEm: '2026-08-04T10:12:00Z'
  },
  {
    id: 'notif-2',
    empresaId: 'emp-1',
    titulo: 'Lembrete de Pagamento',
    mensagem: 'Fatura de fornecedor vence amanhã (R$ 350,00).',
    tipo: 'financeiro',
    lida: false,
    criadoEm: '2026-08-04T08:00:00Z'
  }
];

export const initialLembretes = [
  {
    id: 'lemb-1',
    empresaId: 'emp-1',
    titulo: 'Confirmar lista de presença para o workshop de barbearia',
    data: '2026-08-04',
    horario: '17:00',
    status: 'hoje', // hoje, futuro, vencido, concluido
    prioridade: 'alta'
  },
  {
    id: 'lemb-2',
    empresaId: 'emp-1',
    titulo: 'Repor estoque de Pomada Viking Matte',
    data: '2026-08-06',
    horario: '10:00',
    status: 'futuro',
    prioridade: 'media'
  }
];

export const initialFinanceiro = [
  {
    id: 'fin-1',
    empresaId: 'emp-1',
    descricao: 'Recebimento Agendamento - Roberto Albuquerque',
    tipo: 'receita',
    categoria: 'Serviços',
    valor: 75.00,
    dataVencimento: '2026-08-01',
    dataPagamento: '2026-08-01',
    status: 'pago',
    formaPagamento: 'PIX',
    observacao: 'Ref. Agendamento #age-100'
  },
  {
    id: 'fin-2',
    empresaId: 'emp-1',
    descricao: 'Repasse Comissão Barbeiro - Carlos Silva',
    tipo: 'despesa',
    categoria: 'Comissões de Funcionários',
    valor: 37.50,
    dataVencimento: '2026-08-05',
    dataPagamento: null,
    status: 'pendente',
    formaPagamento: 'Transferência PIX',
    observacao: 'Comissão 50% ref. serviço #age-100'
  },
  {
    id: 'fin-3',
    empresaId: 'emp-1',
    descricao: 'Compra de Toalhas Macias para Barba',
    tipo: 'despesa',
    categoria: 'Insumos',
    valor: 180.00,
    dataVencimento: '2026-08-10',
    dataPagamento: null,
    status: 'pendente',
    formaPagamento: 'Boleto',
    observacao: 'Fornecedor Textil SP'
  }
];

export const defaultWhatsappTemplates = {
  confirmacao: 'Olá {cliente}! Seu agendamento para {servico} com {profissional} na {empresa} foi CONFIRMADO para {data} às {horario}. Qualquer dúvida entre em contato!',
  lembrete: 'Olá {cliente}! Passando para lembrar do seu atendimento hoje às {horario} com {profissional} na {empresa}. Te esperamos!',
  cancelamento: 'Olá {cliente}. Seu agendamento do dia {data} na {empresa} foi cancelado. Para reagendar, acesse: {link_publico}',
  aniversario: 'Parabéns {cliente}! 🎂 A {empresa} deseja um feliz aniversário! Agende seu horário essa semana e ganhe 15% de desconto.',
  posAtendimento: 'Olá {cliente}! Agradecemos pela preferência no atendimento com {profissional}. Como foi sua experiência na {empresa}?'
};

export const saasPlanos = [
  {
    id: 'plano-starter',
    nome: 'Starter',
    precoMensal: 49.90,
    precoAnual: 499.00,
    limiteFuncionarios: 2,
    limiteClientes: 100,
    limiteProdutos: 20,
    limiteServicos: 10,
    recursos: ['Link público geral', 'Agenda básica', 'Notificações visual', 'Suporte email']
  },
  {
    id: 'plano-pro',
    nome: 'Pro Multi-tenant',
    precoMensal: 99.90,
    precoAnual: 999.00,
    limiteFuncionarios: 10,
    limiteClientes: 1000,
    limiteProdutos: 100,
    limiteServicos: 50,
    recursos: ['Link público individual por funcionário', 'Gestão de Comissão (%)', 'Disparo WhatsApp', 'Recibos & Orçamentos', 'Domínio Próprio']
  },
  {
    id: 'plano-enterprise',
    nome: 'Enterprise Unlimited',
    precoMensal: 199.90,
    precoAnual: 1999.00,
    limiteFuncionarios: 999,
    limiteClientes: 99999,
    limiteProdutos: 9999,
    limiteServicos: 9999,
    recursos: ['Tudo do Pro ilimitado', 'Suporte VIP WhatsApp 24/7', 'Múltiplas filiais', 'Exportação Supabase RLS dedicada']
  }
];

export const initialLicencas = [
  {
    id: 'lic-1',
    codigoAtivacao: 'GN-2026-X9K2-M4P1',
    empresaId: 'emp-1',
    empresaNome: 'Barbearia Viking & Club',
    plano: 'ANUAL',
    status: 'ATIVO',
    dataExpiracao: '2027-08-04',
    dispositivoVinculadoId: null,
    trocasDispositivoMes: 0
  },
  {
    id: 'lic-2',
    codigoAtivacao: null,
    empresaId: 'emp-2',
    empresaNome: 'Clínica Estética Lumina',
    plano: 'MENSAL',
    status: 'ATIVO',
    dataExpiracao: '2026-09-04',
    dispositivoVinculadoId: 'HW-PC-98F4-A1B2',
    trocasDispositivoMes: 1
  }
];

