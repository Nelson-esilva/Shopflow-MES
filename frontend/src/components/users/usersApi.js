import axios from 'axios';

// Configuração da URL base da API
const API_URL = import.meta.env.VITE_API_URL;

// Função para listar todos os usuários
export const listAllUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Verifica se a resposta está no formato esperado
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.results && Array.isArray(response.data.results)) {
      return response.data.results;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      throw new Error('Formato de resposta não reconhecido');
    }
  } catch (error) {
    console.error('Erro ao listar usuários:', {
      mensagem: error.message,
      status: error.response?.status,
      dados: error.response?.data
    });
    throw error;
  }
};

// Função para deletar um usuário
export const deleteUser = async (userId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

    const options = {
      method: 'DELETE',
      url: `${API_URL}/api/users/${userId}/`,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar usuário:', {
      mensagem: error.message,
      status: error.response?.status,
      dados: error.response?.data
    });
    throw error;
  }
};

// Função para obter o token de autenticação
export const getAuthToken = () => {
  const normalToken = localStorage.getItem('access_token');
  const googleToken = localStorage.getItem('google_access_token');
  return normalToken || googleToken;
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

// Função para atualizar um usuário
export const updateUser = async (userId, userData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

    // Criar FormData para enviar como multipart/form-data
    const formData = new FormData();
    
    // Adicionar campos obrigatórios
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('username', userData.username);
    formData.append('password', userData.password);
    
    // Adicionar campos opcionais apenas se existirem
    if (userData.phone) formData.append('phone', userData.phone.replace(/\D/g, '')); // Remove tudo que não é número
    if (userData.address) formData.append('address', userData.address);
    if (userData.job_title) formData.append('job_title', userData.job_title);
    if (userData.role) formData.append('role', userData.role);

    const options = {
      method: 'PUT',
      url: `${API_URL}/api/users/${userId}/`,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: formData
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', {
      mensagem: error.message,
      status: error.response?.status,
      dados: error.response?.data
    });
    throw error;
  }
};

// Função para criar um novo usuário
export const createUser = async (userData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

    // Log para debug - verificar dados recebidos
    console.log('Dados recebidos para criar usuário:', userData);
    console.log('Campo job_title recebido:', userData.job_title);

    // Preparar dados para envio
    const requestData = {
      name: userData.name,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      phone: userData.phone ? userData.phone.replace(/\D/g, '') : '', // Remove tudo que não é número
      address: userData.address || '',
      job_title: userData.job_title || '',
      role: userData.role || 'operator'
    };

    // Log específico para job_title
    console.log('Campo job_title que será enviado:', requestData.job_title);
    console.log('Todos os dados que serão enviados:', requestData);

    const options = {
      method: 'POST',
      url: `${API_URL}/api/users/`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: requestData
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar usuário:', {
      mensagem: error.message,
      status: error.response?.status,
      dados: error.response?.data,
      dadosEnviados: error.config?.data,
      headers: error.response?.headers,
      url: error.config?.url,
      method: error.config?.method
    });
    
    // Log detalhado da resposta de erro
    if (error.response) {
      console.error('Resposta de erro completa:', error.response);
      console.error('Dados de erro da API:', error.response.data);
      console.error('Status do erro:', error.response.status);
      console.error('Headers da resposta:', error.response.headers);
      console.error('URL da requisição:', error.config?.url);
      console.error('Método da requisição:', error.config?.method);
      console.error('Dados enviados (string):', error.config?.data);
      console.error('Dados enviados (parsed):', JSON.parse(error.config?.data || '{}'));
    }
    
    throw error;
  }
}; 

// Listar usuários paginados
export const listUsers = async ({
  page = 1,
  pageSize = 10,
  ordering = '-id',
  name = '',
  email = '',
  role = '',
  search = '' // novo parâmetro
} = {}) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
    const params = {
      page,
      page_size: pageSize,
    };
    if (ordering) {
      params.ordering = ordering;
    }
    if (role) params.role = role;
    if (name) params.name = name;
    if (email) params.email = email;
    if (search) params.search = search; // novo parâmetro

    const response = await axios.get(`${API_URL}/api/users/`, {
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (!response.data) {
      throw new Error('Resposta da API não contém dados');
    }
    return response.data;
  } catch (error) {
    console.error('Erro ao listar usuários paginados:', {
      mensagem: error.message,
      status: error.response?.status,
      dados: error.response?.data
    });
    throw error;
  }
}; 