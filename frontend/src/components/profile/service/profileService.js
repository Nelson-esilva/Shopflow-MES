import apiClient from '../../../services/apiClient';

const profileApi = {
  getMe: async () => {
    const { data } = await apiClient.get('/auth/profile/');
    return data;
  },

  updateMe: async (userData) => {
    const { data } = await apiClient.put('/auth/profile/', userData);
    return data;
  },

  changePassword: async (passwordData) => {
    const { data } = await apiClient.post('/auth/change-password/', passwordData);
    return data;
  },
};

export default profileApi;
