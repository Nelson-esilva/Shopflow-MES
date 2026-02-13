import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getAuthToken = () => {
  const normalToken = localStorage.getItem('access_token');
  const googleToken = localStorage.getItem('google_access_token');
  return normalToken || googleToken;
};

const createAxiosOptions = (method, endpoint, data = null) => {
  const token = getAuthToken();
  
  if (!token) {
    // É crucial lidar com a falta de token, talvez redirecionando para login ou exibindo um erro
    console.error('Token de autenticação não encontrado. Redirecionando ou solicitando login.');
    // Dependendo da sua aplicação, você pode lançar um erro ou retornar um objeto específico
    throw new Error('Token de autenticação não encontrado. Usuário não autenticado.');
  }

  const options = {
    method,
    // Concatena a API_URL, '/api' e o endpoint fornecido.
    // Garanta que API_URL NÃO TERMINE com '/' e endpoint NÃO COMECE com '/' para evitar '//'.
    // Ou normalize, como feito abaixo para segurança.
    url: `${API_URL}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, 
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
 * Serviço para interagir com a API de estações de trabalho.
 * Utiliza as funções getAuthToken e createAxiosOptions para autenticação e configuração.
 */
const stationApi = {
  /**
   * Busca todas as estações de trabalho.
   * Pode ser filtrado por lineId se a API suportar um parâmetro de query (e.g., /stations/?line_id=X).
   * @param {number} [lineId] - Opcional. O ID da linha para filtrar as estações.
   * @returns {Promise<Array<Object>>} Uma promessa que resolve para a lista de estações.
   */
  getAllStations: async (lineId = null) => {
    try {
      console.log('Iniciando busca de todas as estações de trabalho...');
      
      let endpoint = '/stations/';
      if (lineId) {
        // Se a API suportar filtragem por query param: /api/stations/?line_id=123
        endpoint = `/stations/?line_id=${lineId}`;
        console.log(`Buscando estações para a linha com ID: ${lineId}...`);
      }

      // Usa createAxiosOptions
      const options = createAxiosOptions('GET', endpoint);
      console.log('Options da requisição (getAllStations):', options);

      const response = await axios.request(options);
      console.log('Resposta completa (getAllStations):', response);
      console.log('Dados da resposta (getAllStations):', response.data);

      // Adaptar a lógica de retorno de dados, assim como no lineService
      let stations = [];
      if (Array.isArray(response.data)) {
        stations = response.data;
      } else if (response.data && Array.isArray(response.data.results)) {
        stations = response.data.results;
      } else {
        console.warn('Formato de resposta inesperado para getAllStations:', response.data);
        stations = [];
      }

      console.log('Estações de trabalho processadas:', stations);
      return stations;
    } catch (error) {
      console.error('Erro ao buscar todas as estações de trabalho:', {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  /**
   * Busca uma estação de trabalho específica pelo ID.
   * @param {number} stationId - O ID da estação de trabalho.
   * @returns {Promise<Object>} Uma promessa que resolve para o objeto da estação.
   */
  getStationById: async (stationId) => {
    try {
      console.log(`Iniciando busca da estação de trabalho com ID: ${stationId}...`);
      
      // Usa createAxiosOptions
      const options = createAxiosOptions('GET', `/stations/${stationId}/`);
      console.log('Options da requisição (getStationById):', options);

      const response = await axios.request(options);
      console.log(`Dados da estação ${stationId} recebidos:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar estação de trabalho com ID ${stationId}:`, {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  /**
   * Cria uma nova estação de trabalho.
   * Assume que a estação é criada no endpoint '/stations/'.
   * Se a API exige que a estação seja criada sob uma linha (e.g., POST /lines/{lineId}/stations/),
   * você precisará modificar o endpoint aqui e adicionar lineId como parâmetro.
   * @param {Object} stationData - Os dados da estação a ser criada (e.g., { name, location, status, line_id }).
   * @returns {Promise<Object>} Uma promessa que resolve para os dados da estação criada.
   */
  createStation: async (stationData) => {
    try {
      console.log('Criando nova estação de trabalho:', stationData);
      
      // Se sua API exige line_id no corpo da requisição e não na URL, stationData deve incluí-lo
      // Se a API for do tipo /lines/{lineId}/stations/, o endpoint mudaria para:
      // const lineId = stationData.line_id; // Supondo que line_id virá nos dados
      // const options = createAxiosOptions('POST', `/lines/${lineId}/stations/`, stationData);

      // Usa createAxiosOptions
      const options = createAxiosOptions('POST', '/stations/', stationData);
      console.log('Options da requisição (createStation):', options);

      const response = await axios.request(options);
      console.log('Resposta de criação da estação:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar estação de trabalho:', {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  /**
   * Atualiza uma estação de trabalho existente.
   * @param {number} stationId - O ID da estação a ser atualizada.
   * @param {Object} stationData - Os dados atualizados da estação.
   * @returns {Promise<Object>} Uma promessa que resolve para os dados da estação atualizada.
   */
  updateStation: async (stationId, stationData) => {
    try {
      console.log(`Atualizando estação de trabalho ${stationId}:`, stationData);
      
      // Usa createAxiosOptions
      const options = createAxiosOptions('PUT', `/stations/${stationId}/`, stationData);
      console.log('Options da requisição (updateStation):', options);

      const response = await axios.request(options);
      console.log('Resposta de atualização da estação:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar estação de trabalho ${stationId}:`, {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  /**
   * Deleta uma estação de trabalho.
   * @param {number} stationId - O ID da estação a ser deletada.
   * @returns {Promise<void>} Uma promessa que resolve quando a estação é deletada.
   */
  deleteStation: async (stationId) => {
    try {
      console.log(`Deletando estação de trabalho ${stationId}...`);
      
      // Usa createAxiosOptions
      const options = createAxiosOptions('DELETE', `/stations/${stationId}/`);
      console.log('Options da requisição (deleteStation):', options);

      await axios.request(options);
      console.log(`Estação ${stationId} deletada com sucesso.`);
    } catch (error) {
      console.error(`Erro ao deletar estação de trabalho ${stationId}:`, {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }
};

export default stationApi;