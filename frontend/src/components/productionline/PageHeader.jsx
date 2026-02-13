import React from 'react';
import { Typography, Box, Button } from '@mui/material'; // Importa componentes de UI do Material-UI
import BusinessIcon from '@mui/icons-material/Business'; // Ícone para representar a empresa/negócio
import AddIcon from '@mui/icons-material/Add'; // Ícone para o botão de adicionar
import { useTheme, useMediaQuery } from '@mui/material';

/**
 * PageHeader é um componente de cabeçalho de página reutilizável.
 * Ele exibe um título, um subtítulo opcional e um botão que executa uma ação ao ser clicado.
 * O texto do botão pode ser personalizado.
 *
 * @param {object} props - As propriedades do componente.
 * @param {string} props.title - O título principal a ser exibido no cabeçalho.
 * @param {string} props.subtitle - Um subtítulo opcional para fornecer mais contexto.
 * @param {function} props.onAddClick - Função de callback a ser executada quando o botão é clicado.
 * @param {string} [props.buttonLabel='Nova Linha'] - O texto a ser exibido no botão. Padrão é 'Nova Linha'.
 * @param {React.ComponentType} [props.icon] - Um ícone personalizado para substituir o BusinessIcon.
 */
function PageHeader({ title, subtitle, onAddClick, buttonLabel = 'Nova Linha', icon: IconComponent }) {
  // Se não passar um ícone, usa o BusinessIcon por padrão
  const Icon = IconComponent || BusinessIcon;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box sx={{ mt: 0 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        mb: 3,
        px: isMobile ? 1 : { xs: 1, sm: 2 },
        py: isMobile ? 1.2 : 2,
        borderRadius: isMobile ? 2 : 3,
        background: '#222',
        boxShadow: '0 2px 12px 0 rgba(190,49,36,0.10)',
        mx: 'auto',
        gap: isMobile ? 2 : 0
      }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'flex-start', gap: isMobile ? 1 : 2, mb: isMobile ? 2 : 0, textAlign: isMobile ? 'center' : 'left' }}>
          <Icon sx={{ color: '#BE3124', fontSize: isMobile ? 36 : 64, mt: isMobile ? 0 : 0.5, mb: isMobile ? 1 : 0 }} />
          <Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontSize: isMobile ? 22 : 35, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>
              Linha de Produção
            </Typography>
            {subtitle && (
              <Typography variant="subtitle1" sx={{ color: '#fff', opacity: 0.85, fontWeight: 400, fontSize: isMobile ? 13 : 16, mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        {onAddClick && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            fullWidth={isMobile}
            sx={{ 
              backgroundColor: '#BE3124',
              fontWeight: 700,
              fontSize: isMobile ? '0.95rem' : '1rem',
              px: isMobile ? 2 : 3,
              py: isMobile ? 0.8 : 1.2,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(190,49,36,0.10)',
              width: isMobile ? '100%' : 'auto',
              mt: isMobile ? 1 : 0,
              '&:hover': {
                backgroundColor: '#8B1E1E'
              }
            }}
          >
            {buttonLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default PageHeader;
