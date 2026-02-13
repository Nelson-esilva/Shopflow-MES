import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importe useNavigate
import '../../styles/Forms.css';
import { Box } from '@mui/material';
// import ResetPassword from './ResetPassword'; // Não é necessário importar o componente diretamente aqui

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Inicialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            // Aqui será implementada a chamada à API quando estiver pronta
            // Supondo que a API retornou sucesso, então redirecionamos:
            // Por enquanto, vamos simular um sucesso imediato para o redirecionamento
            console.log('Simulando envio de instruções para:', email);
            setMessage('Se as instruções existirem, elas foram enviadas para o seu e-mail.');
            
            // Redireciona para a tela de reset de senha após um pequeno atraso ou sucesso da API
            setTimeout(() => {
                navigate('/reset-password'); // Use navigate para redirecionar para a rota de reset de senha
            }, 5000); // Atraso de 1 segundo para o usuário ver a mensagem
            
        } catch (err) {
            setError('Ocorreu um erro ao processar sua solicitação. Tente novamente.');
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
                <h2 className="title-login">Recuperar Senha</h2>
                
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu e-mail"
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Enviar Instruções
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

export default ForgotPassword;