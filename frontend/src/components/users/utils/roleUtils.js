// Configuração das roles do sistema
export const ROLE_CONFIG = {
  'operator': { 
    label: 'Operador', 
    color: '#757575',
    hierarchy: 1
  },
  'manager': { 
    label: 'Gerente', 
    color: '#1976d2',
    hierarchy: 2
  },
  'administrator': { 
    label: 'Administrador', 
    color: '#d32f2f',
    hierarchy: 3
  }
};

// Email do super usuário
export const SUPER_ADMIN_EMAIL = 'super-admin@shopflow.local';

// Função para obter configuração da role
export const getRoleConfig = (role) => {
  return ROLE_CONFIG[role] || { 
    label: role, 
    color: '#757575',
    hierarchy: 0
  };
};

// Função para verificar se é super usuário
export const isSuperAdmin = (email) => {
  return email === SUPER_ADMIN_EMAIL;
};

// Função para obter display da role com chip
export const getRoleDisplay = (role) => {
  const config = getRoleConfig(role);
  return {
    label: config.label,
    color: config.color,
    backgroundColor: `${config.color}15`,
    hierarchy: config.hierarchy
  };
};

// Função para obter todas as roles disponíveis
export const getAvailableRoles = () => {
  return Object.keys(ROLE_CONFIG).map(key => ({
    value: key,
    label: ROLE_CONFIG[key].label
  }));
}; 