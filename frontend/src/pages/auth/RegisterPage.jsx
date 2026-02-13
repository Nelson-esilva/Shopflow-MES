import { useState } from "react";
import RegisterForm from "../../components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";
import '../../styles/img.css';
import '../../styles/Forms.css';
import { Box } from "@mui/material";


function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <div className="login-container">
        <div className="logo-shopflow-login-register"></div>
        <div className="separator"></div>
        <div className="title-login">CADASTRO</div>
        <RegisterForm onRegister={handleRegister} />
      </div>
    </Box>
  );
}

export default RegisterPage;
