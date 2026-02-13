import axios from 'axios';

// API URL
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  console.log('Token presente:', !!token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ===================== CRUD PRINCIPAL ===================== //

// Listar planos de produção com detalhes
export const listPlans = async () => {
  try {
    const url = `${API_URL}/api/plans/`.replace(/([^:]\/)\/+/, "$1");
    console.log('URL da requisição:', url);
    console.log('Headers:', getAuthHeader());

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });

    console.log('Resposta completa da API:', response);
    if (!response.data) {
      throw new Error('Resposta da API não contém dados');
    }
    const plans = response.data.results || response.data;
    console.log('Dados dos planos:', plans);

    // Buscar dados relacionados para cada plano
    const plansWithDetails = await Promise.all(
      plans.map(async (plan) => {
        console.log('Buscando detalhes para plano:', plan.id);
        const [product, productionLine, order] = await Promise.all([
          getProductById(plan.product),
          getProductionLineById(plan.production_line),
          getOrderById(plan.product_order)
        ]);
        console.log('Detalhes encontrados:', {
          product,
          productionLine,
          order
        });
        return {
          ...plan,
          product,
          production_line: productionLine,
          product_order: order
        };
      })
    );
    console.log('Planos com detalhes:', plansWithDetails);
    return plansWithDetails;
  } catch (error) {
    console.error('Erro na requisição:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
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

// Criar novo plano de produção
export const createPlan = async (planData) => {
  try {
    const response = await axios.post(`${API_URL}/api/plans/`, planData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar plano:', error);
    throw error;
  }
};

// Atualizar plano de produção por ID (agora usando PUT, que pode exigir todos os campos obrigatórios)
export const updatePlan = async (id, planData) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/plans/${id}/`,
      planData,
      {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    throw error;
  }
};

// Deletar plano de produção por ID
export const deletePlan = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/plans/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar plano:', error);
    throw error;
  }
};

// ===================== FUNÇÕES AUXILIARES ===================== //

// Buscar produto por ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/products/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return null;
  }
};

// Buscar linha de produção por ID
export const getProductionLineById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/lines/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar linha de produção:', error);
    return null;
  }
};

// Buscar ordem de produção por ID
export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/orders/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar ordem de produção:', error);
    return null;
  }
}; 