import apiClient from '../../services/apiClient';

export const deleteUser = async (userId) => {
  const { data } = await apiClient.delete(`/users/${userId}/`);
  return data;
};

export const updateUser = async (userId, userData) => {
  const formData = new FormData();
  formData.append('name', userData.name);
  formData.append('email', userData.email);
  formData.append('username', userData.username);
  formData.append('password', userData.password);
  if (userData.phone) formData.append('phone', userData.phone.replace(/\D/g, ''));
  if (userData.address) formData.append('address', userData.address);
  if (userData.job_title) formData.append('job_title', userData.job_title);
  if (userData.role) formData.append('role', userData.role);

  const { data } = await apiClient.put(`/users/${userId}/`, formData);
  return data;
};

export const createUser = async (userData) => {
  const { data } = await apiClient.post('/users/', {
    name: userData.name,
    email: userData.email,
    username: userData.username,
    password: userData.password,
    phone: userData.phone ? userData.phone.replace(/\D/g, '') : '',
    address: userData.address || '',
    job_title: userData.job_title || '',
    role: userData.role || 'operator',
  });
  return data;
};

export const listUsers = async ({
  page = 1,
  pageSize = 10,
  ordering = '-id',
  name = '',
  email = '',
  role = '',
  search = '',
} = {}) => {
  const params = { page, page_size: pageSize };
  if (ordering) params.ordering = ordering;
  if (role) params.role = role;
  if (name) params.name = name;
  if (email) params.email = email;
  if (search) params.search = search;

  const { data } = await apiClient.get('/users/', { params });
  return data;
};
