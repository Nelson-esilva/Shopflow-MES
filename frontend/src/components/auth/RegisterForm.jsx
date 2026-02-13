import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { PersonAdd as RegisterIcon } from '@mui/icons-material';

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const result = await register(username, email, password);
      if (result.success) {
        setSuccess("Cadastro realizado com sucesso! Redirecionando para o login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(result.error || "Erro ao registrar usuário");
      }
    } catch (error) {
      setError("Ocorreu um erro ao registrar. Tente novamente.");
      console.error("Erro no registro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      <div className="input-group">
        <label htmlFor="username">
          <i className="bi bi-person" style={{ fontSize: '23px' }}></i> Nome de usuário:
        </label>
        <input
          type="text"
          placeholder="Digite seu nome de usuário..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="input-group">
        <label htmlFor="email">
          <i className="bi bi-envelope" style={{ fontSize: '23px' }}></i> E-mail:
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

      <div className="input-group">
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
      </div>

      <div className="input-group">
        <label htmlFor="confirmPassword">
          <i className="bi bi-lock-fill" style={{ fontSize: '23px' }}></i> Confirmar senha:
        </label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirme sua senha..."
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
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
          disabled={loading}
        >
          {loading ? "CADASTRANDO..." : "CADASTRAR"} <RegisterIcon style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
        </button>
      </center>

      <div className="divider">
        <span>ou</span>
      </div>

      <div className="links">
        <Link to="/login" className="signup-link">Já tem uma conta? Faça login</Link>
      </div>
    </form>
  );
}

export default RegisterForm;
