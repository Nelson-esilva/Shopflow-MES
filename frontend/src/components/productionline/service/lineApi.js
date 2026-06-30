import apiClient from '../../../services/apiClient';

const cleanParams = (params) => {
  const normalized = { ...params };
  Object.keys(normalized).forEach((key) => {
    if (normalized[key] === '' || (Array.isArray(normalized[key]) && normalized[key].length === 0)) {
      delete normalized[key];
    }
    if (key === 'status' && Array.isArray(normalized[key])) {
      normalized[key] = normalized[key].join(',');
    }
  });
  return normalized;
};

const lineApi = {
  getAllLines: async (params = {}) => {
    const { data } = await apiClient.get('/lines/', { params: cleanParams(params) });
    return data;
  },

  getLineById: async (lineId) => {
    const { data } = await apiClient.get(`/lines/${lineId}/`);
    return data;
  },

  createLine: async (lineData) => {
    const { data } = await apiClient.post('/lines/', lineData);
    return data;
  },

  updateLine: async (lineId, lineData) => {
    const { data } = await apiClient.put(`/lines/${lineId}/`, lineData);
    return data;
  },

  deleteLine: async (lineId) => {
    await apiClient.delete(`/lines/${lineId}/`);
  },
};

export default lineApi;
