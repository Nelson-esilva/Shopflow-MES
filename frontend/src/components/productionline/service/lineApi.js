// src/services/lineService.js
import axios from 'axios';

// Configuração da URL base da API
const API_URL = import.meta.env.VITE_API_URL;

// Replicando as funções de autenticação e criação de options do seu deviceService
// ==============================================================================
export const getAuthToken = () => {
  const normalToken = localStorage.getItem('access_token');
  const googleToken = localStorage.getItem('google_access_token');
  return normalToken || googleToken;
};

const createAxiosOptions = (method, endpoint, data = null) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const options = {
    method,
    url: `${API_URL}/api${endpoint}`,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  if (data) {
    options.headers['Content-Type'] = 'application/json';
    options.data = data;
  }

  return options;
};
// ==============================================================================


/**
 * Serviço para interagir com a API de linhas de produção.
 * Utiliza as funções getAuthToken e createAxiosOptions para autenticação manual.
 */
const lineApi = {
  /**
   * Busca todas as linhas de produção.
   * @param {Object} params - Parâmetros de filtro e ordenação (opcional)
   * @returns {Promise<Array<Object>>} Uma promessa que resolve para a lista de linhas.
   */
  getAllLines: async (params = {}) => {
    try {
      console.log('Iniciando busca de todas as linhas de produção...');
      // Monta a URL base
      const url = `${API_URL}/api/lines/`;
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
      const token = getAuthToken();
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params: cleanParams
      });
      // Retorna o objeto completo (paginado ou não)
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar todas as linhas de produção:', {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  /**
   * Busca uma linha de produção específica pelo ID.
   * @param {number} lineId - O ID da linha de produção.
   * @returns {Promise<Object>} Uma promessa que resolve para o objeto da linha.
   */
  getLineById: async (lineId) => {
    try {
      console.log(`Iniciando busca da linha de produção com ID: ${lineId}...`);
      
      const options = createAxiosOptions('GET', `/lines/${lineId}/`);
      console.log('Options da requisição (getLineById):', options);

      const response = await axios.request(options);
      console.log(`Dados da linha ${lineId} recebidos:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar linha de produção com ID ${lineId}:`, {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  /**
   * Cria uma nova linha de produção.
   * @param {Object} lineData - Os dados da linha a ser criada.
   * @returns {Promise<Object>} Uma promessa que resolve para os dados da linha criada.
   */
  createLine: async (lineData) => {
    try {
      console.log('Criando nova linha de produção:', lineData);
      
      const options = createAxiosOptions('POST', '/lines/', lineData);
      console.log('Options da requisição (createLine):', options);

      const response = await axios.request(options);
      console.log('Resposta de criação da linha:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar linha de produção:', {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  /**
   * Atualiza uma linha de produção existente.
   * @param {number} lineId - O ID da linha a ser atualizada.
   * @param {Object} lineData - Os dados atualizados da linha.
   * @returns {Promise<Object>} Uma promessa que resolve para os dados da linha atualizada.
   */
  updateLine: async (lineId, lineData) => {
    try {
      console.log(`Atualizando linha de produção ${lineId}:`, lineData);
      
      const options = createAxiosOptions('PUT', `/lines/${lineId}/`, lineData);
      console.log('Options da requisição (updateLine):', options);

      const response = await axios.request(options);
      console.log('Resposta de atualização da linha:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar linha de produção ${lineId}:`, {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  /**
   * Deleta uma linha de produção.
   * @param {number} lineId - O ID da linha a ser deletada.
   * @returns {Promise<void>} Uma promessa que resolve quando a linha é deletada.
   */
  deleteLine: async (lineId) => {
    try {
      console.log(`Deletando linha de produção ${lineId}...`);
      
      const options = createAxiosOptions('DELETE', `/lines/${lineId}/`);
      console.log('Options da requisição (deleteLine):', options);

      await axios.request(options);
      console.log(`Linha ${lineId} deletada com sucesso.`);
    } catch (error) {
      console.error(`Erro ao deletar linha de produção ${lineId}:`, {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }
};

export default lineApi;