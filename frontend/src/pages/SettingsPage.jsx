// src/config/ConfigurationPage.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, Divider, Switch, FormControlLabel } from '@mui/material';
// Assumindo que DesignerLayout está disponível no caminho especificado
import DesignerLayout from '../layout/DesignerLayout';

function ConfigurationPage() {
  // Estado para controlar o modo escuro/claro
  const [isDarkMode, setIsDarkMode] = useState(false); // false = modo claro, true = modo noturno

  // Cores de fundo para os modos claro e noturno
  const lightModeBg = '#f5f5f5';
  const darkModeBg = '#333333'; // Um cinza escuro para o modo noturno
  const lightModeText = '#000000';
  const darkModeText = '#ffffff';

  // Função para alternar o tema
  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Define as cores de fundo e texto dinamicamente
  const currentBgColor = isDarkMode ? darkModeBg : lightModeBg;
  const currentTextColor = isDarkMode ? darkModeText : lightModeText;
  const currentSecondaryTextColor = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';
  const currentBoxBgColor = isDarkMode ? '#424242' : '#f5f5f5'; // Cor de fundo das caixas internas

  return (
    // O DesignerLayout é usado para manter a estrutura de layout existente
    <DesignerLayout>
      <Box sx={{ p: 2, bgcolor: currentBgColor, transition: 'background-color 0.5s ease-in-out', minHeight: '100vh' }}>
        {/* Título da página de configuração */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: currentTextColor,
            fontWeight: 'bold',
            letterSpacing: '-0.5px',
            mb: 3,
          }}
        >
          Configurações do Sistema
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            color: currentSecondaryTextColor,
            fontSize: '1rem',
            fontWeight: 400,
            mb: 4,
          }}
        >
          Gerencie as configurações gerais do seu aplicativo.
        </Typography>

        {/* Seção de Configurações Gerais */}
        <Box sx={{
          p: 3,
          bgcolor: currentBoxBgColor,
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          mb: 4,
          transition: 'background-color 0.5s ease-in-out'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: currentTextColor }}>
            Geral
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium', color: currentTextColor }}>
              Idioma Padrão
            </Typography>
            <Typography variant="body2" color={currentSecondaryTextColor}>
              Defina o idioma padrão da interface.
            </Typography>
            {/* Botão estático e não funcional */}
            <Button variant="outlined" sx={{ mt: 1, borderRadius: 2, color: currentTextColor, borderColor: currentSecondaryTextColor }}>
              Alterar Idioma
            </Button>
          </Box>
          <Divider sx={{ my: 2, bgcolor: currentSecondaryTextColor }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium', color: currentTextColor }}>
              Fuso Horário
            </Typography>
            <Typography variant="body2" color={currentSecondaryTextColor}>
              Ajuste o fuso horário para exibição de datas e horas.
            </Typography>
            {/* Botão estático e não funcional */}
            <Button variant="outlined" sx={{ mt: 1, borderRadius: 2, color: currentTextColor, borderColor: currentSecondaryTextColor }}>
              Definir Fuso Horário
            </Button>
          </Box>
        </Box>

        {/* Nova Seção de Aparência */}
        <Box sx={{
          p: 3,
          bgcolor: currentBoxBgColor,
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          mb: 4,
          transition: 'background-color 0.5s ease-in-out'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: currentTextColor }}>
            Aparência
          </Typography>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'medium', color: currentTextColor }}>
                Tema do Aplicativo
              </Typography>
              <Typography variant="body2" color={currentSecondaryTextColor}>
                Mude a aparência visual do aplicativo para claro ou noturno.
              </Typography>
            </Box>
            {/* Switch para alternar o tema com emojis */}
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={handleThemeToggle}
                  name="themeToggle"
                  color="primary"
                />
              }
              // Emojis de lua e sol
              label={isDarkMode ? "Noturno 🌙" : "Claro ☀️"}
              sx={{ color: currentTextColor, ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}
            />
          </Box>
        </Box>

        {/* Seção de Configurações de Notificações */}
        <Box sx={{
          p: 3,
          bgcolor: currentBoxBgColor,
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          mb: 4,
          transition: 'background-color 0.5s ease-in-out'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: currentTextColor }}>
            Notificações
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium', color: currentTextColor }}>
              Preferências de Email
            </Typography>
            <Typography variant="body2" color={currentSecondaryTextColor}>
              Configure quais notificações você recebe por email.
            </Typography>
            {/* Botão estático e não funcional */}
            <Button variant="outlined" sx={{ mt: 1, borderRadius: 2, color: currentTextColor, borderColor: currentSecondaryTextColor }}>
              Gerenciar Emails
            </Button>
          </Box>
          <Divider sx={{ my: 2, bgcolor: currentSecondaryTextColor }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium', color: currentTextColor }}>
              Alertas no Aplicativo
            </Typography>
            <Typography variant="body2" color={currentSecondaryTextColor}>
              Ative ou desative alertas e pop-ups dentro do aplicativo.
            </Typography>
            {/* Botão estático e não funcional */}
            <Button variant="outlined" sx={{ mt: 1, borderRadius: 2, color: currentTextColor, borderColor: currentSecondaryTextColor }}>
              Configurar Alertas
            </Button>
          </Box>
        </Box>

        {/* Seção de Configurações de Segurança */}
        <Box sx={{
          p: 3,
          bgcolor: currentBoxBgColor,
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          mb: 4,
          transition: 'background-color 0.5s ease-in-out'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: currentTextColor }}>
            Segurança
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium', color: currentTextColor }}>
              Autenticação de Dois Fatores
            </Typography>
            <Typography variant="body2" color={currentSecondaryTextColor}>
              Adicione uma camada extra de segurança à sua conta.
            </Typography>
            {/* Botão estático e não funcional */}
            <Button variant="outlined" sx={{ mt: 1, borderRadius: 2, color: currentTextColor, borderColor: currentSecondaryTextColor }}>
              Ativar 2FA
            </Button>
          </Box>
          <Divider sx={{ my: 2, bgcolor: currentSecondaryTextColor }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium', color: currentTextColor }}>
              Histórico de Login
            </Typography>
            <Typography variant="body2" color={currentSecondaryTextColor}>
              Visualize os últimos acessos à sua conta.
            </Typography>
            {/* Botão estático e não funcional */}
            <Button variant="outlined" sx={{ mt: 1, borderRadius: 2, color: currentTextColor, borderColor: currentSecondaryTextColor }}>
              Ver Histórico
            </Button>
          </Box>
        </Box>
      </Box>
    </DesignerLayout>
  );
}

export default ConfigurationPage;
