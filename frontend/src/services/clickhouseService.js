// services/clickhouseService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Substitua pela URL da sua API

const clickhouseService = {
  getGraphData: async (queryParams) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/graph-data`, {
        params: queryParams, // Envie parâmetros de filtro, datas, etc.
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
      throw error;
    }
  },
  // Adicione outras funções para diferentes tipos de dados
};

export default clickhouseService;