import React from 'react';
import DesignerLayout from '../layout/DesignerLayout';
import { Typography, Paper, Box } from '@mui/material';

const TemplatePage = () => {
  return (
    <DesignerLayout>
      <Typography variant="h4" gutterBottom>
        Título da Página
      </Typography>
      <Paper sx={{ p: 3, backgroundColor: '#1e1e1e', color: 'white' }}>
        <Box>
          <p>Seu conteúdo vai aqui.</p>
          <p>Você pode adicionar qualquer componente do Material-UI ou HTML padrão.</p>
        </Box>
      </Paper>
    </DesignerLayout>
  );
};

export default TemplatePage; 