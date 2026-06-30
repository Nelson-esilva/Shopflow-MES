import apiClient from '../../../services/apiClient';

const stationApi = {
  getAllStations: async (lineId = null) => {
    const params = lineId ? { line_id: lineId } : undefined;
    const { data } = await apiClient.get('/stations/', { params });
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  },

  getStationById: async (stationId) => {
    const { data } = await apiClient.get(`/stations/${stationId}/`);
    return data;
  },

  createStation: async (stationData) => {
    const { data } = await apiClient.post('/stations/', stationData);
    return data;
  },

  updateStation: async (stationId, stationData) => {
    const { data } = await apiClient.put(`/stations/${stationId}/`, stationData);
    return data;
  },

  deleteStation: async (stationId) => {
    await apiClient.delete(`/stations/${stationId}/`);
  },
};

export default stationApi;
