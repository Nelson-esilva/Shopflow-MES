import React from 'react';
import { Box, Button } from '@mui/material';
import dayjs from 'dayjs';

const tabs = [
  { label: 'LINHAS', value: 'linhas' },
  { label: 'ESTAÇÕES', value: 'estacoes' },
  { label: 'DEFEITOS', value: 'defeitos' },
  { label: 'VISUALIZAR NO GRAFANA', value: 'grafana' },
];

const MenuTabs = ({ selected, onChange, selectedDate }) => {
  const isMobile = window.matchMedia('(max-width:600px)').matches;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'center',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 2 },
        mb: 3,
        px: { xs: 0.5, md: 3 },
        py: { xs: 1, md: 2 },
        background: 'linear-gradient(90deg, #fff 60%, #f7f7fa 100%)',
        borderRadius: 5,
        boxShadow: '0 4px 24px 0 rgba(190,49,36,0.07), 0 1.5px 6px 0 rgba(0,0,0,0.04)',
        border: '1.5px solid #F0EAEA',
        flexWrap: 'wrap',
        maxWidth: 1200,
        mt: 8,
        mx: 'auto',
        width: '100%',
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, md: 2 },
        flexWrap: 'wrap',
        width: { xs: '100%', sm: 'auto' },
      }}>
        {tabs.map(tab => (
          <Button
            key={tab.value}
            variant={selected === tab.value ? 'contained' : 'outlined'}
            color={selected === tab.value ? 'error' : 'inherit'}
            onClick={() => onChange(tab.value)}
            sx={{
              fontWeight: 900,
              minWidth: { xs: 100, sm: 150 },
              borderRadius: 4,
              textTransform: 'uppercase',
              fontSize: { xs: '0.90rem', md: '1.08rem' },
              letterSpacing: 1,
              boxShadow: selected === tab.value ? '0 2px 8px rgba(190,49,36,0.10)' : 'none',
              background: selected === tab.value ? 'linear-gradient(90deg, #BE3124 80%, #D32F2F 100%)' : 'none',
              color: selected === tab.value ? '#fff' : '#222',
              border: selected === tab.value ? 'none' : '1.5px solid #E0E0E0',
              transition: 'all 0.18s',
              width: { xs: '100%', sm: 'auto' },
              mb: { xs: 1, sm: 0 },
              '&:hover': {
                background: selected === tab.value
                  ? 'linear-gradient(90deg, #BE3124 80%, #D32F2F 100%)'
                  : 'rgba(190,49,36,0.07)',
                color: selected === tab.value ? '#fff' : '#BE3124',
                border: selected === tab.value ? 'none' : '1.5px solid #BE3124',
                boxShadow: '0 2px 8px rgba(190,49,36,0.10)',
              },
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 1, sm: 2 },
        ml: { xs: 0, sm: 2 },
        mt: { xs: 2, sm: 0 },
        width: { xs: '100%', sm: 'auto' },
      }}>
        <Box sx={{ 
          minWidth: { xs: 90, sm: 120 }, 
          px: 2, 
          py: 1, 
          borderRadius: 2, 
          background: '#f7f7fa', 
          fontWeight: 700, 
          color: '#BE3124', 
          fontSize: { xs: 15, sm: 18 }, 
          letterSpacing: 1, 
          border: '1.5px solid #F0EAEA', 
          textAlign: 'center', 
          width: { xs: '100%', sm: 'auto' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {selectedDate ? dayjs(selectedDate).format('DD/MM/YYYY') : 'Hoje'}
        </Box>
      </Box>
    </Box>
  );
};

export default MenuTabs; 