import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useGoogleAuth } from "../contexts/GoogleAuthContext";

function PrivateRoute({ children }) {
  const { isAuthenticated: isJwtAuthenticated, loading: jwtLoading } = useAuth();
  const { isAuthenticated: isGoogleAuthenticated, loading: googleLoading } = useGoogleAuth();
  
  // Verifica se está autenticado em qualquer um dos contextos
  const isAuthenticated = isJwtAuthenticated || isGoogleAuthenticated;
  const isLoading = jwtLoading || googleLoading;
  
  // Se estiver carregando, não redirecionar para login
  if (isLoading) {
    return null;
  }
  
  if (!isAuthenticated) {
    console.log('Usuário não autenticado, redirecionando para login...');
    console.log('JWT Auth:', isJwtAuthenticated);
    console.log('Google Auth:', isGoogleAuthenticated);
    return <Navigate to="/login" replace />;
  }

  console.log('Usuário autenticado, permitindo acesso ao dashboard...');
  return children;
}

export default PrivateRoute;
