// Motor de Licenciamento Criptográfico e Proteção de Ativação

/**
 * Durabilidade das Licenças Disponíveis:
 * - 'TESTE_5M': 5 Minutos
 * - 'TESTE_24H': 24 Horas
 * - '1_MES': 30 Dias
 * - '6_MESES': 180 Dias
 * - '1_ANO': 365 Dias
 */

export const getExpirationDateByDuration = (duracao) => {
  const now = new Date();
  
  if (duracao === 'TESTE_5M') {
    now.setMinutes(now.getMinutes() + 5);
  } else if (duracao === 'TESTE_24H') {
    now.setHours(now.getHours() + 24);
  } else if (duracao === '1_MES') {
    now.setDate(now.getDate() + 30);
  } else if (duracao === '6_MESES') {
    now.setDate(now.getDate() + 180);
  } else if (duracao === '1_ANO') {
    now.setFullYear(now.getFullYear() + 1);
  } else {
    now.setDate(now.getDate() + 30);
  }

  return now.toISOString();
};

export const getLabelDuracao = (duracao) => {
  switch (duracao) {
    case 'TESTE_5M': return '⏱️ Teste Grátis de 5 Minutos';
    case 'TESTE_24H': return '⏳ Teste de 24 Horas';
    case '1_MES': return '🗓️ Plano 1 Mês';
    case '6_MESES': return '📅 Plano 6 Meses';
    case '1_ANO': return '👑 Plano 1 Ano';
    default: return 'Plano Comercial';
  }
};

/**
 * Gerar Código de Ativação Seguro com Prefixo de Validação
 */
export const generateSecureLicenseKey = (duracao) => {
  const prefixes = {
    'TESTE_5M': 'AGY-T5M',
    'TESTE_24H': 'AGY-24H',
    '1_MES': 'AGY-1M',
    '6_MESES': 'AGY-6M',
    '1_ANO': 'AGY-1ANO'
  };

  const pref = prefixes[duracao] || 'AGY-KEY';
  const seg1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const seg2 = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `${pref}-${seg1}-${seg2}`;
};

/**
 * Hardware Fingerprint Único do Aparelho
 */
export const getOrGenerateHardwareId = () => {
  let hwId = localStorage.getItem('saas_hardware_id');
  if (!hwId) {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const deviceType = isMobile ? 'MOB' : 'PC';
    
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const dateHex = Date.now().toString(36).substring(3, 7).toUpperCase();
    
    hwId = `HW-${deviceType}-${randomHex}-${dateHex}`;
    localStorage.setItem('saas_hardware_id', hwId);
  }
  return hwId;
};

/**
 * Validador Estrito da Licença no Sistema
 */
export const checkSystemLicenseValid = (licenca, currentHardwareId) => {
  if (!licenca) {
    return { 
      valido: false, 
      bloqueado: true, 
      motivo: 'Nenhuma licença ativa encontrada. Para usar o sistema no seu computador ou celular, é necessário adquirir uma licença.' 
    };
  }

  const nowIso = new Date().toISOString();

  // 1. Verificação de Revogação ou Inativação
  if (licenca.status === 'INATIVO' || licenca.status === 'REVOGADO') {
    return { 
      valido: false, 
      bloqueado: true, 
      motivo: 'Sua licença foi inativada ou revogada pelo administrador.' 
    };
  }

  // 2. Verificação Rigorosa de Data e Hora de Expiração
  if (licenca.dataExpiracaoIso && licenca.dataExpiracaoIso < nowIso) {
    return { 
      valido: false, 
      bloqueado: true, 
      expirado: true,
      motivo: 'Sua licença do sistema expirou! Entre em contato para renovar seu acesso.' 
    };
  }

  // Fallback para licenças legadas com formato simples YYYY-MM-DD
  if (!licenca.dataExpiracaoIso && licenca.dataExpiracao) {
    const todayStr = new Date().toISOString().split('T')[0];
    if (licenca.dataExpiracao < todayStr) {
      return { 
        valido: false, 
        bloqueado: true, 
        expirado: true,
        motivo: 'Sua licença do sistema expirou! Entre em contato para renovar seu acesso.' 
      };
    }
  }

  // 3. Restrição de Dispositivo para Planos Teste / Mensal
  if (licenca.duracao === 'TESTE_5M' || licenca.duracao === 'TESTE_24H' || licenca.duracao === '1_MES') {
    if (!licenca.dispositivoVinculadoId) {
      return { valido: true, autoVincular: true };
    }

    if (licenca.dispositivoVinculadoId !== currentHardwareId) {
      return {
        valido: false,
        bloqueado: true,
        motivo: 'Esta licença está vinculada a outro computador ou celular. Cada licença de teste/mensal é restrita a 1 dispositivo.'
      };
    }
  }

  return { valido: true, motivo: 'Licença ativa e autorizada.' };
};
