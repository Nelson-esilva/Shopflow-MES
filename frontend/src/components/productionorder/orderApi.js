import apiClient from '../../services/apiClient';

export const getPlanById = async (id) => {
  try {
    const { data } = await apiClient.get(`/plans/${id}/`);
    return data;
  } catch {
    return null;
  }
};

export const listOrders = async (params = {}) => {
  const cleanParams = { ...params };
  Object.keys(cleanParams).forEach((key) => {
    if (cleanParams[key] === '' || (Array.isArray(cleanParams[key]) && cleanParams[key].length === 0)) {
      delete cleanParams[key];
    }
    if (key === 'status' && Array.isArray(cleanParams[key])) {
      cleanParams[key] = cleanParams[key].join(',');
    }
  });
  const { data } = await apiClient.get('/orders/', { params: cleanParams });
  return data;
};

export const deleteOrder = async (id) => {
  const { data } = await apiClient.delete(`/orders/${id}/`);
  return data;
};

export const createOrder = async (orderData) => {
  const { data } = await apiClient.post('/orders/', orderData);
  return data;
};

export const updateOrder = async (id, orderData) => {
  const { data } = await apiClient.patch(`/orders/${id}/`, orderData);
  return data;
};
