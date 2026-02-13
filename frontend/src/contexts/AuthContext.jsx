import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Configuração da URL base da API
const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Configuração do axios para interceptar requisições
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Verifica se é um erro 401 (Não Autorizado) e não é uma requisição de retry ou para refresh token
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('token/refresh')) {
          originalRequest._retry = true; // Marca a requisição como retry para evitar loops infinitos
          
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
              throw new Error('Sem refresh token'); // Sem refresh token, não há como renovar
            }

            // Tenta renovar o token de acesso
            const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
              refresh: refreshToken
            });

            const { access } = response.data;
            localStorage.setItem('access_token', access); // Salva o novo access token
            originalRequest.headers.Authorization = `Bearer ${access}`; // Atualiza o header da requisição original
            return axios(originalRequest); // Repete a requisição original com o novo token
          } catch (refreshError) {
            console.error('Erro ao renovar token:', refreshError);
            // Se falhar a renovação, remove os tokens e desautentica
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setIsAuthenticated(false);
            setUser(null);
            navigate('/login'); // Redireciona para a página de login
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error); // Rejeita outros erros
      }
    );

    // Limpeza: remove os interceptors quando o componente for desmontado
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]); // navigate como dependência para garantir que o interceptor tenha a função mais recente

  // Função para buscar o perfil completo do usuário
  // Agora pode receber um userId, que é o ideal para buscar de /api/users/{id}/
  const fetchUserProfile = async (userIdFromAuth = null) => {
    try {
      let currentUserId = userIdFromAuth;

      // Se o ID não foi fornecido via parâmetro (e.g., após login/refresh),
      // tenta obter do endpoint básico de perfil para pegar o ID.
      // ISTO É UM FALLBACK. O IDEAL É TER O ID DO USER NA RESPOSTA DE LOGIN/REFRESH.
      if (!currentUserId) {
        try {
          const basicProfileResponse = await axios.get(`${API_URL}/api/auth/profile/`);
          currentUserId = basicProfileResponse.data.id;
        } catch (basicProfileError) {
          console.warn("Não foi possível obter o ID do usuário de /api/auth/profile/. Verifique se o backend retorna o ID no endpoint de login/refresh ou no /api/auth/profile/.");
          // Se o erro aqui for 401, o interceptor de resposta ou o useEffect principal tratarão.
          // Não re-lança para não bloquear a próxima tentativa com ID, se houver.
        }
      }
      
      // Se ainda não temos um userId, não podemos buscar o perfil completo
      if (!currentUserId) {
        console.error("ID do usuário não disponível para buscar perfil completo.");
        throw new Error("ID do usuário não disponível");
      }

      // **NOVO CAMINHO**: Faz a requisição para o endpoint de perfil completo usando o ID
      const response = await axios.get(`${API_URL}/api/users/${currentUserId}/`);
      
      // Define os dados completos do usuário no estado do contexto
      setUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil completo do usuário:", error);
      // Re-lança o erro para ser tratado pelo `useEffect` ou `login` que chamou
      throw error;
    }
  };


  // Verifica se há token ao iniciar a aplicação (ao montar o AuthProvider)
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true); // Indica que a autenticação está sendo verificada
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Chama fetchUserProfile para obter os dados completos do usuário.
          // Se o seu JWT contém o ID do usuário (ex: 'sub' ou 'user_id' claim),
          // você pode decodificá-lo aqui e passar o ID diretamente para fetchUserProfile(userId).
          // Por enquanto, confiamos que fetchUserProfile irá lidar com a obtenção do ID.
          await fetchUserProfile();
        } catch (error) {
          console.error('Erro na verificação inicial de autenticação:', error);
          
          // Se o erro for 401 e tiver refresh token, tenta renovar (redundante com interceptor, mas seguro)
          if (error.response?.status === 401 && refreshToken) {
            try {
              const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
                refresh: refreshToken
              });

              const { access, user_id } = response.data; // Assumindo que refresh token retorna 'user_id'
              localStorage.setItem('access_token', access);
              axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
              
              await fetchUserProfile(user_id); // Tenta buscar o perfil com o ID obtido do refresh
              return; // Sai da função após o sucesso da renovação e busca de perfil
            } catch (refreshError) {
              console.error('Erro ao renovar token durante verificação inicial:', refreshError);
            }
          }
          
          // Se chegou aqui (token inválido, ou falha na renovação), desautentica
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          delete axios.defaults.headers.common['Authorization']; // Remove o token do axios
          setIsAuthenticated(false);
          setUser(null);
          navigate('/login'); // Redireciona para o login
        }
      }
      setLoading(false); // Finaliza o carregamento, independentemente do sucesso ou falha
    };

    checkAuth();
  }, []); // Array de dependências vazio para rodar apenas uma vez ao montar o componente

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true); // Inicia carregamento para o login

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await axios.post(`${API_URL}/api/auth/login/`, formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Resposta do login:', response.data);

      // Verificando a estrutura da resposta e se há tokens
      if (response.data.tokens) {
        const { access, refresh } = response.data.tokens;
        const userId = response.data.user_id; // **Assumindo que o ID do usuário vem na resposta do login**
        
        if (access) {
          localStorage.setItem('access_token', access);
          if (refresh) {
            localStorage.setItem('refresh_token', refresh);
          }

          axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

          // Chama fetchUserProfile com o ID do usuário obtido na resposta do login
          await fetchUserProfile(userId); 
          
          navigate('/dashboard'); // Redireciona para o dashboard após o login e busca de perfil
          return { success: true };
        }
      }

      return {
        success: false,
        error: "Formato de resposta de login não reconhecido pelo servidor"
      };

    } catch (error) {
      console.error("Erro no login:", error);
      
      let errorMessage = "Erro ao fazer login";
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = "Email ou senha incorretos";
            break;
          case 400:
            errorMessage = error.response.data.detail || "Dados de login inválidos";
            break;
          case 500:
            errorMessage = "Erro no servidor. Tente novamente mais tarde";
            break;
          default:
            errorMessage = error.response.data.detail || `Erro (${error.response.status}): ${error.response.statusText}`;
        }
      } else if (error.request) {
        errorMessage = "Nenhuma resposta do servidor. Verifique sua conexão.";
      } else {
        errorMessage = "Erro desconhecido. Por favor, tente novamente.";
      }

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        // Envia requisição de logout para o backend, se houver um refresh token
        await axios.post(`${API_URL}/api/auth/logout/`, {
          refresh: refreshToken
        });
      }
    } catch (error) {
      console.error('Erro no logout do backend:', error);
      // Continua com o logout do frontend mesmo que o backend falhe
    } finally {
      // Remove todos os tokens e limpa o estado de autenticação no frontend
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      delete axios.defaults.headers.common['Authorization']; // Remove o token dos headers padrão do axios
      setUser(null);
      setError(null);
      setIsAuthenticated(false);
      navigate('/login'); // Redireciona para a página de login
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/api/auth/register/`, {
        username,
        email,
        password
      });
      return { success: true };
    } catch (error) {
      console.error("Erro no registro:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Erro ao registrar usuário"
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      register,
      isAuthenticated,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}