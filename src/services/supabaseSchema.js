// Complete Production-Ready Supabase PostgreSQL Schema Script with RLS

export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- SISTEMA SAAS MULTI-TENANT DE AGENDAMENTOS ONLINE (SUPABASE + POSTGRESQL + RLS)
-- Gerado automaticamente para Antigravity SaaS Engine
-- ==============================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Empresas (Tenants)
CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20),
    segmento VARCHAR(100),
    logo TEXT,
    capa TEXT,
    telefone VARCHAR(30),
    whatsapp VARCHAR(30),
    email VARCHAR(255),
    site VARCHAR(255),
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(10),
    cep VARCHAR(20),
    descricao TEXT,
    horario_funcionamento VARCHAR(255),
    fuso_horario VARCHAR(100) DEFAULT 'America/Sao_Paulo',
    dominio_proprio VARCHAR(255) UNIQUE,
    plano VARCHAR(50) DEFAULT 'Pro Anual',
    status VARCHAR(20) DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Usuários / Perfis vinculados à Empresa
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- 'superadmin', 'admin', 'funcionario'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Funcionários (Profissionais com Comissão %)
CREATE TABLE IF NOT EXISTS public.funcionarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nome VARCHAR(255) NOT NULL,
    foto TEXT,
    cargo VARCHAR(150),
    especialidades TEXT[],
    telefone VARCHAR(30),
    whatsapp VARCHAR(30),
    email VARCHAR(255),
    descricao TEXT,
    comissao_pct NUMERIC(5,2) DEFAULT 50.00, -- Ex: 50.00%
    link_publico_slug VARCHAR(100) NOT NULL,
    cor_agenda VARCHAR(20) DEFAULT '#0284c7',
    dias_atendimento TEXT[] DEFAULT ARRAY['seg','ter','qua','qui','sex','sab'],
    horario_inicio TIME DEFAULT '09:00',
    horario_fim TIME DEFAULT '19:00',
    tempo_intervalo INT DEFAULT 15,
    status VARCHAR(20) DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uk_funcionario_slug_empresa UNIQUE(empresa_id, link_publico_slug)
);

-- 5. Tabela de Serviços
CREATE TABLE IF NOT EXISTS public.servicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    foto TEXT,
    categoria VARCHAR(100),
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL,
    duracao_minutos INT NOT NULL,
    cor VARCHAR(20) DEFAULT '#0284c7',
    modalidade VARCHAR(30) DEFAULT 'Presencial', -- 'Presencial', 'Online', 'Domicilio'
    ativo BOOLEAN DEFAULT TRUE,
    ordem INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabela de Produtos e Controle de Estoque
CREATE TABLE IF NOT EXISTS public.produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    foto TEXT,
    categoria VARCHAR(100),
    codigo VARCHAR(50),
    fornecedor VARCHAR(255),
    estoque INT DEFAULT 0,
    estoque_minimo INT DEFAULT 5,
    preco_custo NUMERIC(10,2) DEFAULT 0.00,
    preco_venda NUMERIC(10,2) NOT NULL,
    lucro NUMERIC(10,2) GENERATED ALWAYS AS (preco_venda - preco_custo) STORED,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabela de Clientes
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    foto TEXT,
    telefone VARCHAR(30),
    whatsapp VARCHAR(30),
    email VARCHAR(255),
    cpf VARCHAR(20),
    nascimento DATE,
    endereco TEXT,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tabela de Agendamentos (com cálculo de comissão automatizado)
CREATE TABLE IF NOT EXISTS public.agendamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
    servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE RESTRICT,
    cliente_nome VARCHAR(255) NOT NULL,
    cliente_telefone VARCHAR(30),
    cliente_whatsapp VARCHAR(30),
    data DATE NOT NULL,
    horario TIME NOT NULL,
    duracao_minutos INT NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    comissao_valor NUMERIC(10,2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'agendado', -- 'agendado', 'confirmado', 'concluido', 'cancelado', 'faltou'
    cor_status VARCHAR(20) DEFAULT '#0284c7',
    observacoes TEXT,
    concluido_em TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Tabela Financeira (Contas a Pagar / Receber e Extrato de Comissões)
CREATE TABLE IF NOT EXISTS public.financeiro (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    agendamento_id UUID REFERENCES public.agendamentos(id) ON DELETE SET NULL,
    funcionario_id UUID REFERENCES public.funcionarios(id) ON DELETE SET NULL,
    descricao VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL, -- 'receita', 'despesa'
    categoria VARCHAR(100),
    valor NUMERIC(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status VARCHAR(20) DEFAULT 'pendente', -- 'pendente', 'pago', 'cancelado'
    forma_pagamento VARCHAR(50),
    observacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. TRIGGER PARA CÁLCULO DE COMISSÃO AO CONCLUIR SERVIÇO
CREATE OR REPLACE FUNCTION public.calcular_comissao_servico()
RETURNS TRIGGER AS $$
DECLARE
    v_comissao_pct NUMERIC(5,2);
    v_comissao_calculada NUMERIC(10,2);
BEGIN
    IF NEW.status = 'concluido' AND OLD.status != 'concluido' THEN
        -- Buscar porcentagem de comissão do funcionário
        SELECT comissao_pct INTO v_comissao_pct 
        FROM public.funcionarios 
        WHERE id = NEW.funcionario_id;

        IF v_comissao_pct IS NULL THEN
            v_comissao_pct := 50.00;
        END IF;

        v_comissao_calculada := ROUND((NEW.valor * (v_comissao_pct / 100.00)), 2);
        NEW.comissao_valor := v_comissao_calculada;
        NEW.concluido_em := now();

        -- Lançar automaticamente a despesa de comissão no financeiro
        INSERT INTO public.financeiro (
            empresa_id, agendamento_id, funcionario_id, descricao, tipo, categoria, valor, data_vencimento, status
        ) VALUES (
            NEW.empresa_id, NEW.id, NEW.funcionario_id, 
            'Comissão Ref. Atendimento #' || SUBSTRING(NEW.id::text, 1, 8),
            'despesa', 'Comissão de Funcionário', v_comissao_calculada, CURRENT_DATE, 'pendente'
        );

        -- Lançar a receita no financeiro da empresa
        INSERT INTO public.financeiro (
            empresa_id, agendamento_id, descricao, tipo, categoria, valor, data_vencimento, data_pagamento, status
        ) VALUES (
            NEW.empresa_id, NEW.id, 
            'Receita Atendimento #' || SUBSTRING(NEW.id::text, 1, 8),
            'receita', 'Serviços', NEW.valor, CURRENT_DATE, CURRENT_DATE, 'pago'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_concluir_agendamento ON public.agendamentos;
CREATE TRIGGER trigger_concluir_agendamento
BEFORE UPDATE ON public.agendamentos
FOR EACH ROW EXECUTE FUNCTION public.calcular_comissao_servico();

-- 11. HABILITAR ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financeiro ENABLE ROW LEVEL SECURITY;

-- 12. POLÍTICAS RLS PARA LEITURA PÚBLICA (Links de Agendamento)
CREATE POLICY "Permitir leitura pública de empresas ativas"
ON public.empresas FOR SELECT USING (status = 'ativo');

CREATE POLICY "Permitir leitura pública de funcionários ativos"
ON public.funcionarios FOR SELECT USING (status = 'ativo');

CREATE POLICY "Permitir leitura pública de serviços ativos"
ON public.servicos FOR SELECT USING (ativo = true);

CREATE POLICY "Permitir clientes criarem agendamentos públicos"
ON public.agendamentos FOR INSERT WITH CHECK (true);

-- 13. POLÍTICAS RLS DE ISOLAMENTO POR TENANT (Empresa Autenticada)
CREATE POLICY "Isolamento por Tenant - Funcionarios"
ON public.funcionarios FOR ALL USING (
    empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Isolamento por Tenant - Servicos"
ON public.servicos FOR ALL USING (
    empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Isolamento por Tenant - Produtos"
ON public.produtos FOR ALL USING (
    empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Isolamento por Tenant - Clientes"
ON public.clientes FOR ALL USING (
    empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Isolamento por Tenant - Agendamentos"
ON public.agendamentos FOR ALL USING (
    empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Isolamento por Tenant - Financeiro"
ON public.financeiro FOR ALL USING (
    empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
);
`;
