import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../styles/Forms.css';
import { Box } from '@mui/material';

const ResetPassword = () => {
    // Usamos useParams para pegar qualquer token ou ID da URL, se necessário para a API
    const { token } = useParams(); 
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        // Adicione validações de senha aqui (e.g., comprimento mínimo, caracteres especiais)
        if (newPassword.length < 6) {
            setError('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            // Aqui será implementada a chamada à API para redefinir a senha
            // Você provavelmente precisará enviar o 'token' junto com a nova senha
            console.log('Token para redefinição:', token); // Apenas para debug
            console.log('Nova senha:', newPassword); // Apenas para debug

            setMessage('Sua senha foi redefinida com sucesso!');
            // Opcional: Redirecionar para a tela de login após o sucesso
            // history.push('/login'); 
        } catch (err) {
            setError('Ocorreu um erro ao redefinir sua senha. Tente novamente.');
        }
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
                <div className="box-logo-login-register">
                    <div className="logo-shopflow-login-register"/>
                </div>
                <div className="separator"></div>
                <h2 className="title-login">Definir Nova Senha</h2>
                
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="newPassword">Nova Senha</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Digite sua nova senha"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirme sua nova senha"
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Redefinir Senha
                    </button>
                </form>

            <div className="divider">
            <span>ou</span>
          </div>

                <div className="links">
                    <Link to="/login">Voltar para o Login</Link>
                </div>
            </div>
        </Box>
    );
};

export default ResetPassword;