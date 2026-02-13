import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useGoogleAuth } from "../../contexts/GoogleAuthContext";
import { Login as LoginIcon } from '@mui/icons-material';
import { GoogleLogin } from '@react-oauth/google';
import { Google as GoogleIcon } from '@mui/icons-material';

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { login } = useAuth();
  const { loginWithGoogle, loading: googleLoading, error: googleError } = useGoogleAuth();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || "Erro ao fazer login. Verifique suas credenciais.");
      }
    } catch (error) {
      setError("Ocorreu um erro ao fazer login. Tente novamente.");
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      console.log('Resposta do Google:', credentialResponse);
      
      if (!credentialResponse.credential) {
        throw new Error('Credencial do Google não recebida');
      }

      const result = await loginWithGoogle(credentialResponse.credential);
      console.log('Resultado do login com Google:', result);
      
      if (result.success) {
        console.log('Login com Google bem sucedido, redirecionando...');
        // O redirecionamento será feito pelo GoogleAuthContext
      } else {
        console.error('Erro no login com Google:', result.error);
        setError(result.error || "Erro ao fazer login com Google.");
      }
    } catch (error) {
      console.error("Erro no login com Google:", error);
      setError("Ocorreu um erro ao fazer login com Google. Tente novamente.");
    }
  };

  const handleGoogleError = () => {
    console.error("Erro no componente do Google");
    setError("Erro ao fazer login com Google. Tente novamente.");
  };

  // Atualiza o erro se houver erro do Google
  useState(() => {
    if (googleError) {
      setError(googleError);
    }
  }, [googleError]);

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="input-group email-group">
        <label htmlFor="email">
          <i className="bi bi-person" style={{ fontSize: '23px' }}></i> E-mail:
        </label>
        <input
          type="email"
          placeholder="Digite seu e-mail..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading || googleLoading}
        />
      </div>

      <div className="input-group password-group">
        <label htmlFor="password">
          <i className="bi bi-lock-fill" style={{ fontSize: '23px' }}></i> Senha:
        </label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Digite sua senha..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading || googleLoading}
        />
        <i
          className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-password`}
          style={{ fontSize: '23px' }}
          onClick={togglePasswordVisibility}
        ></i>
      </div>

      <center>
        <button 
          type="submit" 
          className="login-button"
          disabled={loading || googleLoading}
        >
          {loading ? "ENTRANDO..." : "ENTRAR"} <LoginIcon style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
        </button>
      </center>

      <div className="divider">
        <span>ou</span>
      </div>

      {/* <div className="google-login-container">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="filled_black"
          shape="rectangular"
          text="signin_with"
          locale="pt-BR"
          width="300"
          disabled={loading || googleLoading}
          flow="implicit"
        />
      </div> */} 

     <div className="links">
        <Link to="/forgot-password" className="forgot-password">Esqueceu a senha?</Link>
        <Link to="/register" className="signup-link">Não tem conta? Cadastre-se</Link>
      </div>
    </form>
  );
}

export default LoginForm;
