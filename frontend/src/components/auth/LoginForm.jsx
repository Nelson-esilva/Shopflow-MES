import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Login as LoginIcon } from '@mui/icons-material';

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || "Erro ao fazer login. Verifique suas credenciais.");
      }
    } catch {
      setError("Ocorreu um erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

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
          disabled={loading}
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
          disabled={loading}
        />
        <i
          className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-password`}
          style={{ fontSize: '23px' }}
          onClick={() => setShowPassword((prev) => !prev)}
        ></i>
      </div>

      <center>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "ENTRANDO..." : "ENTRAR"} <LoginIcon style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
        </button>
      </center>

      <div className="links">
        <Link to="/forgot-password" className="forgot-password">Esqueceu a senha?</Link>
        <Link to="/register" className="signup-link">Nao tem conta? Cadastre-se</Link>
      </div>
    </form>
  );
}

export default LoginForm;
