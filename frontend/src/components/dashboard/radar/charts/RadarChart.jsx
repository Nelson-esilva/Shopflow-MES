import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import carouselApi from '../../carousel/carouselApi';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <Box sx={{ bgcolor: '#fff', p: 1.5, borderRadius: 2, boxShadow: 3, minWidth: 120 }}>
        <Typography variant="subtitle2" fontWeight={900} color="#222" fontSize={18} mb={0.5}>
          {d.station}
        </Typography>
        <Typography variant="body2" fontWeight={700} sx={{ color: '#43A047' }}>Produção: {d.producao}</Typography>
        <Typography variant="body2" fontWeight={700} sx={{ color: '#D32F2F' }}>Defeitos: {d.defeitos}</Typography>
        <Typography variant="body2" fontWeight={700} sx={{ color: '#1976d2' }}>Eficiência: {d.eficiencia}%</Typography>
      </Box>
    );
  }
  return null;
};

const RadarChartComponent = () => {
  const titleRef = useRef(null);
  const [barWidth, setBarWidth] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useLayoutEffect(() => {
    if (titleRef.current) {
      setBarWidth(titleRef.current.offsetWidth);
    }
  }, []);

  // Função para buscar dados das estações
  const fetchStationData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== Buscando dados das estações para Radar Chart ===');
      
      // Buscar dados de todas as estações (workstations 1, 2, 3)
      const stationsData = [];
      
      for (let workstationId = 1; workstationId <= 3; workstationId++) {
        try {
          console.log(`Buscando dados da estação ${workstationId}...`);
          
          const response = await carouselApi.getDailyWorkstationData(workstationId, {
            registered_at: new Date().toISOString().split('T')[0] // Data atual
          });
          
          console.log(`Dados da estação ${workstationId}:`, response);
          
          if (response && Array.isArray(response) && response.length > 0) {
            // Pegar o último item que contém o resumo
            const summary = response[response.length - 1];
            
            if (summary && summary["total produced"] !== undefined) {
              const producao = summary["total produced"] || 0;
              const defeitos = summary["total defective units"] || 0;
              const fpy = summary["FPY"] || 0;
              
              stationsData.push({
                station: `Estação ${workstationId}`,
                producao: producao,
                defeitos: defeitos,
                eficiencia: Math.round(fpy)
              });
              
              console.log(`✅ Estação ${workstationId} processada:`, {
                station: `Estação ${workstationId}`,
                producao,
                defeitos,
                eficiencia: Math.round(fpy)
              });
            }
          }
        } catch (error) {
          console.error(`Erro ao buscar dados da estação ${workstationId}:`, error);
          // Adicionar dados padrão em caso de erro
          stationsData.push({
            station: `Estação ${workstationId}`,
            producao: 0,
            defeitos: 0,
            eficiencia: 0
          });
        }
      }
      
      console.log('=== Dados finais das estações ===');
      console.log('Dados processados:', stationsData);
      
      setData(stationsData);
    } catch (error) {
      console.error('Erro ao buscar dados das estações:', error);
      setError('Erro ao carregar dados das estações');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchStationData();
  }, []);

  return (
    <Box sx={{
      width: '100%',
      maxWidth: isMobile ? 340 : 600,
      minWidth: 0,
      height: isMobile ? 320 : { xs: 400, sm: 480, md: 540 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      borderRadius: 4,
      boxShadow: '0 2px 12px 0 rgba(190,49,36,0.10)',
      p: isMobile ? 1.2 : 3,
      mx: 'auto',
    }}>
      <Typography
        ref={titleRef}
        variant={isMobile ? 'h6' : 'h5'}
        fontWeight={900}
        color="#BE3124"
        mb={1}
        sx={{
          letterSpacing: 2,
          textTransform: 'uppercase',
          textShadow: '0 2px 12px rgba(190,49,36,0.10)',
          fontFamily: 'monospace',
          lineHeight: 1.1,
          background: '#000',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
          px: isMobile ? 1 : 2,
          py: isMobile ? 0.5 : 1,
          borderRadius: 2,
          fontSize: isMobile ? 18 : undefined
        }}
      >
        Desempenho das Estações de Produção
      </Typography>
      <Box sx={{ width: barWidth, height: 5, borderBottom: '5px solid #BE3124', mb: 2, mx: 'auto', transition: 'width 0.2s' }} />
      
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: isMobile ? 180 : '80%',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={40} sx={{ color: '#BE3124' }} />
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
            Carregando dados das estações...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: isMobile ? 180 : '80%',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="body2" sx={{ color: '#D32F2F', fontWeight: 600, textAlign: 'center' }}>
            {error}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666', 
              cursor: 'pointer',
              textDecoration: 'underline',
              '&:hover': { color: '#BE3124' }
            }}
            onClick={fetchStationData}
          >
            Tentar novamente
          </Typography>
        </Box>
      ) : data.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: isMobile ? 180 : '80%',
          color: '#666'
        }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Nenhum dado disponível
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 180 : '80%'}>
          <RadarChart cx="50%" cy="50%" outerRadius={isMobile ? '65%' : '80%'} data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="station" tick={{ fontSize: isMobile ? 11 : 15, fontWeight: 700, wordBreak: 'break-word' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tickCount={6} tick={{ fontSize: isMobile ? 10 : 13 }} />
            <Radar name="Produção" dataKey="producao" stroke="#43A047" fill="#43A047" fillOpacity={0.5} />
            <Radar name="Defeitos" dataKey="defeitos" stroke="#D32F2F" fill="#D32F2F" fillOpacity={0.3} />
            <Radar name="Eficiência" dataKey="eficiencia" stroke="#1976d2" fill="#1976d2" fillOpacity={0.2} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      )}
      
      <Box sx={{ mt: isMobile ? 1.5 : 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: isMobile ? 13 : 18, height: isMobile ? 7 : 10, bgcolor: '#43A047', borderRadius: 1, mr: 1 }} />
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: isMobile ? 12 : 16 }}>Produção</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: isMobile ? 13 : 18, height: isMobile ? 7 : 10, bgcolor: '#D32F2F', borderRadius: 1, mr: 1 }} />
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: isMobile ? 12 : 16 }}>Defeitos</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: isMobile ? 13 : 18, height: isMobile ? 7 : 10, bgcolor: '#1976d2', borderRadius: 1, mr: 1 }} />
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: isMobile ? 12 : 16 }}>Eficiência (%)</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RadarChartComponent; 