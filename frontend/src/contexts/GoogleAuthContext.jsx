import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// Configuração da URL base da API
const API_URL = import.meta.env.VITE_API_URL;

const GoogleAuthContext = createContext({});

export function GoogleAuthProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica se há token ao iniciar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('google_access_token');
      if (token) {
        try {
          setLoading(true);
          setIsAuthenticated(true);
          // Tenta buscar o perfil do usuário
          await fetchUserProfile(token);
        } catch (error) {
          console.error('Erro ao verificar autenticação Google:', error);
          localStorage.removeItem('google_access_token');
          setIsAuthenticated(false);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      console.log('Buscando perfil do usuário com token:', token);
      const response = await axios.get(`${API_URL}/api/auth/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Resposta completa do perfil:', response);
      console.log('Dados do perfil recebidos:', response.data);
      
      // Garantindo que temos os dados necessários
      const userData = {
        ...response.data,
        name: response.data.name || response.data.username || response.data.email?.split('@')[0],
        email: response.data.email,
        picture: response.data.picture || response.data.avatar
      };
      
      console.log('Dados do usuário processados:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Erro detalhado ao carregar perfil do usuário:', {
        mensagem: error.message,
        status: error.response?.status,
        dados: error.response?.data,
        headers: error.response?.headers
      });
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      setError(null);
      setLoading(true);

      console.log('Iniciando login com Google, credential:', credential);

      // Autenticação com Google
      const response = await axios.post(`${API_URL}/api/auth/google/`, {
        access_token: credential
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Resposta completa do login Google:', response);
      console.log('Dados recebidos do login:', response.data);

      if (response.data.key) {
        // Salva o token do Google como access_token
        localStorage.setItem('access_token', response.data.key);
        localStorage.setItem('google_access_token', response.data.key);
        
        // Configura o token no axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.key}`;

        // Busca o perfil do usuário
        try {
          const profileResponse = await axios.get(`${API_URL}/api/auth/profile/`, {
            headers: {
              'Authorization': `Bearer ${response.data.key}`
            }
          });
          
          console.log('Resposta completa do perfil:', profileResponse);
          console.log('Dados do perfil recebidos:', profileResponse.data);
          
          // Processando os dados do usuário
          const userData = {
            ...profileResponse.data,
            name: profileResponse.data.name || profileResponse.data.username || profileResponse.data.email?.split('@')[0],
            email: profileResponse.data.email,
            picture: profileResponse.data.picture || profileResponse.data.avatar
          };
          
          console.log('Dados do usuário processados:', userData);
          setUser(userData);
          
          // Marca como autenticado
          setIsAuthenticated(true);

          // Força o redirecionamento para o dashboard
          console.log('Redirecionando para o dashboard...');
          navigate('/dashboard', { replace: true });
          return { success: true };
        } catch (profileError) {
          console.error('Erro detalhado ao buscar perfil:', {
            mensagem: profileError.message,
            status: profileError.response?.status,
            dados: profileError.response?.data,
            headers: profileError.response?.headers
          });
          // Mesmo com erro no perfil, consideramos o login bem sucedido
          // pois o token foi recebido e salvo
          setIsAuthenticated(true);
          console.log('Redirecionando para o dashboard (após erro no perfil)...');
          navigate('/dashboard', { replace: true });
          return { success: true };
        }
      }

      return {
        success: false,
        error: "Erro ao processar autenticação com Google"
      };
    } catch (error) {
      console.error("Erro detalhado no login com Google:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      
      let errorMessage = "Erro ao fazer login com Google";
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = "Falha na autenticação com Google";
            break;
          case 400:
            errorMessage = error.response.data.detail || "Dados inválidos";
            break;
          case 500:
            errorMessage = "Erro no servidor. Tente novamente mais tarde";
            break;
          default:
            errorMessage = error.response.data.detail || "Erro ao fazer login com Google";
        }
      }

      setIsAuthenticated(false);
      setUser(null);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const logoutGoogle = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('google_access_token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <GoogleAuthContext.Provider value={{
      loading,
      error,
      isAuthenticated,
      user,
      loginWithGoogle,
      logoutGoogle
    }}>
      {children}
    </GoogleAuthContext.Provider>
  );
}

export function useGoogleAuth() {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error('useGoogleAuth deve ser usado dentro de um GoogleAuthProvider');
  }
  return context;
} 