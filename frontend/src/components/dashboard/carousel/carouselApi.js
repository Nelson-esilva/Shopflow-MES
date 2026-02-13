// src/components/dashboard/carousel/carouselApi.js
import axios from 'axios';

// Configuração da URL base da API
const API_URL = 'http://127.0.0.1:8000';

// Função para obter o token de autenticação
export const getAuthToken = () => {
  const normalToken = localStorage.getItem('access_token');
  const googleToken = localStorage.getItem('google_access_token');
  
  console.log('=== Verificando tokens ===');
  console.log('Token normal:', normalToken ? 'Encontrado' : 'Não encontrado');
  console.log('Token Google:', googleToken ? 'Encontrado' : 'Não encontrado');
  
  const token = normalToken || googleToken;
  
  if (token) {
    console.log('Token selecionado:', token.substring(0, 20) + '...');
  } else {
    console.log('❌ Nenhum token encontrado!');
  }
  
  return token;
};

// Função para criar as options padrão do axios
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
      'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
      'User-Agent': 'insomnia/11.1.0',
      'Authorization': `Bearer ${token}`
    }
  };

  if (data) {
    options.data = data;
  }

  return options;
};

/**
 * Serviço para buscar dados do carousel das linhas de produção
 */
const carouselApi = {
  /**
   * Busca dados de produção diária de uma estação de trabalho específica
   * @param {number} workstationId - ID da estação de trabalho
   * @param {Object} params - Parâmetros opcionais (product_id, production_line_id, station_id, registered_at)
   * @returns {Promise<Object>} Dados de produção da estação
   */
  getDailyWorkstationData: async (workstationId, params = {}) => {
    try {
      console.log(`Buscando dados da estação de trabalho ${workstationId}...`);
      console.log('Parâmetros:', params);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      // Construir a URL com parâmetros
      let url = `${API_URL}/api/daily_workstation_relativo/${workstationId}/`;
      
      // Criar FormData para enviar os parâmetros como form-data
      const formData = new FormData();
      
      if (params.product_id) {
        formData.append('product_id', params.product_id);
      }
      if (params.production_line_id) {
        formData.append('production_line_id', params.production_line_id);
      }
      if (params.station_id) {
        formData.append('station_id', params.station_id);
      }
      if (params.registered_at) {
        formData.append('registered_at', params.registered_at);
      }

      console.log('URL da requisição:', url);
      console.log('FormData:', Object.fromEntries(formData.entries()));

      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
          'User-Agent': 'insomnia/11.1.0',
          'Authorization': `Bearer ${token}`
        },
        params: Object.fromEntries(formData.entries()) // Enviar como query parameters
      });

      console.log('Dados recebidos da API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados da estação de trabalho:', {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  /**
   * Busca dados de todas as linhas de produção para o carousel
   * @param {Object} params - Parâmetros opcionais (data, filtros, etc.)
   * @returns {Promise<Array>} Array com dados de todas as linhas
   */
  getAllLinesData: async (params = {}) => {
    try {
      console.log('=== getAllLinesData iniciado ===');
      console.log('Parâmetros recebidos:', params);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }
      console.log('Token encontrado:', token.substring(0, 20) + '...');

      // Primeiro, buscar todas as linhas de produção
      console.log('Buscando linhas de produção...');
      const linesResponse = await axios.get(`${API_URL}/api/lines/`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
          'User-Agent': 'insomnia/11.1.0',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Resposta das linhas:', linesResponse.data);
      const lines = linesResponse.data.results || linesResponse.data || [];
      console.log('Linhas encontradas:', lines.length);
      console.log('Primeira linha:', lines[0]);

      const linesData = [];

      // Para cada linha, buscar os dados de produção
      for (const line of lines) {
        try {
          console.log(`Buscando dados para linha ${line.id} (${line.name})...`);
          
          // Buscar dados da primeira estação da linha (ou estação principal)
          const workstationData = await carouselApi.getDailyWorkstationData(1, {
            production_line_id: line.id,
            registered_at: params.date || new Date().toISOString().split('T')[0]
          });

          console.log(`Dados da estação para linha ${line.id}:`, workstationData);

          // Calcular percentual baseado nos dados recebidos
          const percentage = workstationData.percentage || 0;
          const meta = workstationData.meta || 0;
          const produzido = workstationData.produzido || 0;
          const diferenca = meta - produzido;

          const linhaData = {
            id: line.id,
            nome: line.name || `Linha ${line.id}`,
            percentage: percentage,
            meta: meta,
            produzido: produzido,
            diferenca: diferenca,
            rawData: workstationData // dados brutos da API
          };

          console.log(`Dados processados para linha ${line.id}:`, linhaData);
          linesData.push(linhaData);
        } catch (error) {
          console.error(`Erro ao buscar dados da linha ${line.id}:`, error);
          // Adicionar dados padrão em caso de erro
          linesData.push({
            id: line.id,
            nome: line.name || `Linha ${line.id}`,
            percentage: 0,
            meta: 0,
            produzido: 0,
            diferenca: 0,
            error: true
          });
        }
      }

      console.log('=== Dados finais processados ===');
      console.log('Total de linhas processadas:', linesData.length);
      console.log('Dados processados das linhas:', linesData);
      return linesData;
    } catch (error) {
      console.error('Erro ao buscar dados de todas as linhas:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      throw error;
    }
  },

  /**
   * Busca dados de produção diária geral (sem especificar estação)
   * @param {Object} params - Parâmetros opcionais (data, filtros, etc.)
   * @returns {Promise<Object>} Dados de produção geral
   */
  getDailyProductionData: async (params = {}) => {
    try {
      console.log('Buscando dados de produção diária geral...');
      console.log('Parâmetros:', params);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      // Construir a URL
      let url = `${API_URL}/api/daily_workstation_relativo/`;
      
      // Criar FormData para enviar os parâmetros como form-data
      const formData = new FormData();
      
      if (params.registered_at) {
        formData.append('registered_at', params.registered_at);
      }

      console.log('URL da requisição:', url);
      console.log('FormData:', Object.fromEntries(formData.entries()));

      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
          'User-Agent': 'insomnia/11.1.0',
          'Authorization': `Bearer ${token}`
        },
        params: Object.fromEntries(formData.entries()) // Enviar como query parameters
      });

      console.log('Dados de produção diária recebidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados de produção diária:', error);
      throw error;
    }
  },

  /**
   * Função de teste para verificar se a API está respondendo
   * @returns {Promise<Object>} Resposta da API
   */
  testApiConnection: async () => {
    try {
      console.log('=== Testando conexão com API ===');
      
      const token = getAuthToken();
      console.log('Token disponível:', !!token);
      
      if (!token) {
        console.log('Nenhum token encontrado no localStorage');
        return { error: 'Token não encontrado' };
      }

      console.log('Fazendo requisição de teste...');
      const response = await axios.get(`${API_URL}/api/daily_workstation_relativo/`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
          'User-Agent': 'insomnia/11.1.0',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✅ API respondendo com sucesso!');
      console.log('Status:', response.status);
      console.log('Dados:', response.data);
      
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Erro na conexão com API:', error);
      console.error('Status:', error.response?.status);
      console.error('Dados do erro:', error.response?.data);
      
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  }
};

export default carouselApi; 