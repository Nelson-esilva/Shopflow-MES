import apiClient from '../../services/apiClient';

const carouselApi = {
  getDailyWorkstationData: async (workstationId, params = {}) => {
    const { data } = await apiClient.get(`/daily_workstation_relativo/${workstationId}/`, { params });
    return data;
  },

  getAllLinesData: async (params = {}) => {
    const { data: linesResponse } = await apiClient.get('/lines/');
    const lines = linesResponse.results || linesResponse || [];
    const date = params.date || new Date().toISOString().split('T')[0];

    const linesData = [];
    for (const line of lines) {
      try {
        const workstationData = await carouselApi.getDailyWorkstationData(1, {
          production_line_id: line.id,
          registered_at: date,
        });
        const meta = workstationData.meta || 0;
        const produzido = workstationData.produzido || 0;
        linesData.push({
          id: line.id,
          nome: line.name || `Linha ${line.id}`,
          percentage: workstationData.percentage || 0,
          meta,
          produzido,
          diferenca: meta - produzido,
          rawData: workstationData,
        });
      } catch {
        linesData.push({
          id: line.id,
          nome: line.name || `Linha ${line.id}`,
          percentage: 0,
          meta: 0,
          produzido: 0,
          diferenca: 0,
          error: true,
        });
      }
    }
    return linesData;
  },

  getDailyProductionData: async (params = {}) => {
    const { data } = await apiClient.get('/daily_workstation_relativo/', { params });
    return data;
  },
};

export default carouselApi;
