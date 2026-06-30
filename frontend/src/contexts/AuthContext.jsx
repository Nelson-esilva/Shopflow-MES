import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { setSessionExpiredHandler } from '../services/apiClient';

const AuthContext = createContext({});

async function loadUserProfile() {
  const { data: profile } = await apiClient.get('/auth/profile/');
  if (profile?.id) {
    try {
      const { data: full } = await apiClient.get(`/users/${profile.id}/`);
      return full;
    } catch {
      return profile;
    }
  }
  return profile;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const clearSession = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      clearSession();
      navigate('/login');
    });
    return () => setSessionExpiredHandler(null);
  }, [clearSession, navigate]);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await loadUserProfile();
        setUser(profile);
        setIsAuthenticated(true);
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [clearSession]);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const { data } = await apiClient.post('/auth/login/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!data?.tokens?.access) {
        return { success: false, error: 'Resposta de login invalida.' };
      }

      localStorage.setItem('access_token', data.tokens.access);
      if (data.tokens.refresh) {
        localStorage.setItem('refresh_token', data.tokens.refresh);
      }

      const profile = await loadUserProfile();
      setUser(profile);
      setIsAuthenticated(true);
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      let message = 'Erro ao fazer login';
      if (err.response?.status === 401) message = 'Email ou senha incorretos';
      else if (err.response?.data?.detail) message = err.response.data.detail;
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await apiClient.post('/auth/google/', { access_token: credential });

      if (!data?.key) {
        return { success: false, error: 'Erro ao processar autenticacao com Google.' };
      }

      localStorage.setItem('access_token', data.key);
      const profile = await loadUserProfile();
      setUser(profile);
      setIsAuthenticated(true);
      navigate('/dashboard', { replace: true });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Erro ao fazer login com Google';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        await apiClient.post('/auth/logout/', { refresh });
      }
    } catch {
      // segue com logout local
    } finally {
      clearSession();
      navigate('/login');
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      await apiClient.post('/auth/register/', { username, email, password });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Erro ao registrar usuario';
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginWithGoogle,
      logout,
      register,
      isAuthenticated,
      error,
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
