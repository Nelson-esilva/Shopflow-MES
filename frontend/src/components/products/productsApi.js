import axios from 'axios';

// API URL
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  console.log('Token presente:', !!token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Listar produtos
export const listProducts = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    // Ajustar filtros para o formato correto
    const params = {
      page,
      page_size: pageSize,
      ...filters
    };
    // Se product_type for array, transformar em string separada por vírgula
    if (Array.isArray(params.product_type)) {
      params.product_type = params.product_type.join(',');
    }
    // Se code for array, transformar em string separada por vírgula
    if (Array.isArray(params.code)) {
      params.code = params.code.join(',');
    }
    const url = `${API_URL}/api/products/`.replace(/([^:]\/)\/+/, "$1");
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      params
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

// Buscar produto por ID ou código
export const searchProduct = async (searchTerm) => {
  try {
    // Se o termo de busca for um número, assume que é um ID
    if (!isNaN(searchTerm)) {
      const url = `${API_URL}/api/products/${searchTerm}/`.replace(/([^:]\/)\/+/g, "$1");
      console.log('Buscando por ID:', url);
      
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });

      return [response.data]; // Retorna como array para manter consistência
    }

    // Se não for um ID, busca por código
    const url = `${API_URL}/api/products/`.replace(/([^:]\/)\/+/g, "$1");
    console.log('Buscando por código:', url);
    
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      params: {
        code: searchTerm
      }
    });

    if (!response.data) {
      throw new Error('Resposta da API não contém dados');
    }

    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error('Erro na busca:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// Deletar produto
export const deleteProduct = async (productId) => {
  try {
    const url = `${API_URL}/api/products/${productId}/`.replace(/([^:]\/)\/+/g, "$1");
    console.log('Deletando produto:', url);
    
    const response = await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });

    console.log('Produto deletado com sucesso:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar produto:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// Atualizar produto
export const updateProduct = async (productId, productData) => {
  try {
    const url = `${API_URL}/api/products/${productId}/`.replace(/([^:]\/)\/+/g, "$1");
    console.log('Atualizando produto:', url);
    console.log('Dados do produto:', productData);
    
    const response = await axios.put(url, productData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });

    console.log('Produto atualizado com sucesso:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar produto:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// Criar produto
export const createProduct = async (productData) => {
  try {
    const url = `${API_URL}/api/products/`.replace(/([^:]\/)\/+/g, "$1");
    console.log('Criando produto:', url);
    console.log('Dados do produto:', productData);
    
    const response = await axios.post(url, productData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });

    console.log('Produto criado com sucesso:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar produto:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};
