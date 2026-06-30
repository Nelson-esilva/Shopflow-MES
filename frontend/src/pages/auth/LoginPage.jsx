import LoginForm from "../../components/auth/LoginForm";
import '../../styles/Forms.css';
import './LoginPage.css';
import { Box, Typography } from "@mui/material";
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';

function LoginPage() {
  return (
    <Box className="login-page">
      <Box className="login-brand-panel">
        <Box className="login-brand-content">
          <FactoryOutlinedIcon className="login-brand-icon" />
          <Typography component="h1" className="login-brand-title">
            SHOPFLOW
          </Typography>
          <Typography component="span" className="login-brand-subtitle">
            MES
          </Typography>
          <Typography className="login-brand-tagline">
            Manufacturing Execution System
          </Typography>
          <Box className="login-brand-divider" />
          <Typography className="login-brand-description">
            Gestão inteligente da produção em tempo real
          </Typography>
        </Box>
      </Box>

      <Box className="login-form-panel">
        <Box className="login-form-wrapper">
          <Box className="login-form-mobile-brand">
            <Typography className="login-mobile-title">SHOPFLOW</Typography>
            <Typography className="login-mobile-subtitle">MES</Typography>
          </Box>

          <Typography component="h2" className="login-form-title">
            Acesse sua conta
          </Typography>
          <Typography className="login-form-subtitle">
            Entre com seu e-mail e senha para continuar
          </Typography>
          <LoginForm />
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
