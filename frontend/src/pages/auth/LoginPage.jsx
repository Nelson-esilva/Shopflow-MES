import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import '../../styles/Forms.css';
import '../../styles/img.css';
import { Box } from "@mui/material";

function LoginPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5', // Um fundo suave para a página
      }}
    >
      <div className="login-container">
        <div className="box-logo-login-register">
          <div className="logo-shopflow-login-register"/>
        </div>
        <div className="separator"></div>
        <div className="title-login">LOGIN</div>
        <LoginForm />
      </div>
    </Box>
  );
}

export default LoginPage;
