import apiClient from '../../services/apiClient';

const getById = async (path) => {
  try {
    const { data } = await apiClient.get(path);
    return data;
  } catch {
    return null;
  }
};

export const getProductById = (id) => getById(`/products/${id}/`);
export const getProductionLineById = (id) => getById(`/lines/${id}/`);
export const getOrderById = (id) => getById(`/orders/${id}/`);

export const listPlans = async () => {
  const { data } = await apiClient.get('/plans/');
  const plans = data.results || data;

  return Promise.all(plans.map(async (plan) => {
    const [product, production_line, product_order] = await Promise.all([
      getProductById(plan.product),
      getProductionLineById(plan.production_line),
      getOrderById(plan.product_order),
    ]);
    return { ...plan, product, production_line, product_order };
  }));
};

export const getPlanById = (id) => getById(`/plans/${id}/`);

export const createPlan = async (planData) => {
  const { data } = await apiClient.post('/plans/', planData);
  return data;
};

export const updatePlan = async (id, planData) => {
  const { data } = await apiClient.put(`/plans/${id}/`, planData);
  return data;
};

export const deletePlan = async (id) => {
  const { data } = await apiClient.delete(`/plans/${id}/`);
  return data;
};
