// This service handles API interactions related to user authentication and profile management, including fetching user data and updating profile information, with integrated token handling and detailed logging.
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
    throw new Error('Token de autenticação não encontrado');
  }

  const options = {
    method,
    url: `${API_URL}/api${endpoint}`,
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

const userApi = {
  getMe: async () => {
    try {
      console.log('Iniciando busca das informações do usuário logado...');
      const options = createAxiosOptions('GET', '/auth/profile/');
      console.log('Options da requisição (getMe):', options);
      const response = await axios.request(options);
      console.log('Dados do usuário logado recebidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar informações do usuário logado:', {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  updateMe: async (userData) => {
    try {
      console.log('Atualizando informações do usuário logado:', userData);
      const options = createAxiosOptions('PUT', '/auth/profile/', userData);
      console.log('Options da requisição (updateMe):', options);

      const response = await axios.request(options);
      console.log('Resposta de atualização do usuário:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar informações do usuário:', {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  // Novo serviço para mudança de senha
  changePassword: async (passwordData) => {
    try {
      console.log('Iniciando mudança de senha...');
      // passwordData deve conter old_password, new_password, confirm_password
      const options = createAxiosOptions('POST', '/auth/change-password/', passwordData);
      console.log('Options da requisição (changePassword):', options);
      const response = await axios.request(options);
      console.log('Resposta de mudança de senha:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao mudar a senha:', {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }
};

export default userApi;
