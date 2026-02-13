import axios from 'axios';

// API URL
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  console.log('Token presente:', !!token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Buscar plano por ID
export const getPlanById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/plans/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar plano:', error);
    return null;
  }
};

// Listar ordens de produção
export const listOrders = async (params = {}) => {
  try {
    // Monta a URL base
    const url = `${API_URL}/api/orders/`.replace(/([^:]\/)/g, "$1");
    // Remove filtros vazios
    const cleanParams = { ...params };
    Object.keys(cleanParams).forEach(key => {
      if (cleanParams[key] === '' || (Array.isArray(cleanParams[key]) && cleanParams[key].length === 0)) {
        delete cleanParams[key];
      }
      // Se status for array, transforma em string
      if (key === 'status' && Array.isArray(cleanParams[key])) {
        cleanParams[key] = cleanParams[key].join(',');
      }
    });
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      params: cleanParams
    });
    if (!response.data) {
      throw new Error('Resposta da API não contém dados');
    }
    return response.data;
  } catch (error) {
    console.error('Erro na requisição:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// Deletar ordem de produção por ID
export const deleteOrder = async (id) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    const url = `${API_URL}/api/orders/${id}/`;
    const response = await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar ordem:', error);
    throw error;
  }
};

// Criar ordem de produção
export const createOrder = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/api/orders/`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar ordem:', error);
    throw error;
  }
};

// Atualizar ordem de produção
export const updateOrder = async (id, data) => {
  try {
    const response = await axios.patch(`${API_URL}/api/orders/${id}/`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar ordem:', error);
    throw error;
  }
};
