import apiClient from '../../services/apiClient';

const normalizeListParams = (params) => {
  const normalized = { ...params };
  ['product_type', 'code', 'status'].forEach((key) => {
    if (Array.isArray(normalized[key])) {
      normalized[key] = normalized[key].join(',');
    }
  });
  return normalized;
};

export const listProducts = async (page = 1, pageSize = 10, filters = {}) => {
  const { data } = await apiClient.get('/products/', {
    params: normalizeListParams({ page, page_size: pageSize, ...filters }),
  });
  return data;
};

export const searchProduct = async (searchTerm) => {
  if (!Number.isNaN(Number(searchTerm))) {
    const { data } = await apiClient.get(`/products/${searchTerm}/`);
    return [data];
  }
  const { data } = await apiClient.get('/products/', { params: { code: searchTerm } });
  return Array.isArray(data) ? data : [data];
};

export const deleteProduct = async (productId) => {
  const { data } = await apiClient.delete(`/products/${productId}/`);
  return data;
};

export const updateProduct = async (productId, productData) => {
  const { data } = await apiClient.put(`/products/${productId}/`, productData);
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await apiClient.post('/products/', productData);
  return data;
};
