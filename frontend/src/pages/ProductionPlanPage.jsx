import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery, Paper, Button, Typography } from '@mui/material';
import { CalendarMonth as CalendarMonthIcon, Add as AddIcon } from '@mui/icons-material';
import DesignerLayout from '../layout/DesignerLayout';
import Calendar from '../components/productionplans/Calendar';

const ProductionPlanPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentView, setCurrentView] = useState('calendar');
  const [openPlanModal, setOpenPlanModal] = useState(false);

  return (
    <>
        <DesignerLayout>
        <Box sx={{ p: 3 }}>
          {currentView !== 'dailyProduction' && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: 'space-between',
              mb: 3,
              px: isMobile ? 1 : { xs: 1, sm: 2 },
              py: isMobile ? 1.2 : 2,
              borderRadius: 3,
              background: '#222',
              boxShadow: '0 2px 12px 0 rgba(190,49,36,0.10)',
              mx: 'auto',
              gap: isMobile ? 2 : 0
            }}>
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'flex-start', gap: 2, mb: isMobile ? 2 : 0, textAlign: isMobile ? 'center' : 'left' }}>
                <CalendarMonthIcon sx={{ color: '#BE3124', fontSize: isMobile ? 36 : 64, mt: isMobile ? 0 : 0.5, mb: isMobile ? 1 : 0 }} />
                <Box>
                  <Typography variant="h5" sx={{ fontSize: isMobile ? 22 : 35, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>
                    Planos de Produção
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#fff', opacity: 0.85, fontWeight: 400, fontSize: isMobile ? 13 : 16, mt: 0.5 }}>
                    Gerencie aqui todos os planos de produção cadastrados no sistema.
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenPlanModal(true)}
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
                fullWidth={isMobile}
              >
                Novo Plano
              </Button>
            </Box>
          )}
          <Calendar currentView={currentView} setCurrentView={setCurrentView} openPlanModal={openPlanModal} setOpenPlanModal={setOpenPlanModal} />
        </Box>
        </DesignerLayout>
    </>
  );
};

export default ProductionPlanPage; 