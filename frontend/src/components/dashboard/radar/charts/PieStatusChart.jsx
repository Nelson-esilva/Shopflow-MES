import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import carouselApi from '../../carousel/carouselApi';

const COLORS = ['#43A047', '#FFD600', '#BE3124'];

const STATUS_COLORS = {
  'Disponível': '#43A047',
  'Manutenção': '#FFD600',
  'Parada': '#BE3124',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const status = payload[0].name;
    const color = STATUS_COLORS[status] || '#222';
    return (
      <Box sx={{ bgcolor: '#fff', p: 1.5, borderRadius: 2, boxShadow: 3, minWidth: 120 }}>
        <Typography variant="body2" fontWeight={900} color="#222" mb={0.5}>
          Estações: {payload[0].value}
        </Typography>
        <Typography variant="subtitle2" fontWeight={700} sx={{ color }}>{status}</Typography>
      </Box>
    );
  }
  return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 35; // Aumentado de 24 para 35 para dar mais espaço
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const isMobile = window.innerWidth <= 600;
  
  // Simplificar os nomes para evitar corte
  const displayName = name === 'Disponível' ? 'DISPONÍVEL' : 
                     name === 'Manutenção' ? 'MANUTENÇÃO' : 
                     name === 'Parada' ? 'PARADA' : name;
  
  return (
    <text
      x={x}
      y={y}
      fill="#222"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={isMobile ? 10 : 13}
      fontWeight={700}
      style={{ 
        pointerEvents: 'none', 
        fontFamily: 'monospace',
        textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
      }}
    >
      <tspan x={x} dy="0">{displayName}</tspan>
      <tspan x={x} dy={isMobile ? '1.2em' : '1.4em'} fontSize={isMobile ? 9 : 11}>
        {`(${(percent * 100).toFixed(0)}%)`}
      </tspan>
    </text>
  );
};

const PieStatusChart = () => {
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

  // Função para buscar dados de status das estações
  const fetchStationStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== Buscando status das estações para Pie Chart ===');
      
      // Buscar dados de todas as estações (workstations 1, 2, 3)
      const statusCounts = {
        'Disponível': 0,
        'Manutenção': 0,
        'Parada': 0
      };
      
      for (let workstationId = 1; workstationId <= 3; workstationId++) {
        try {
          console.log(`Verificando status da estação ${workstationId}...`);
          
          const response = await carouselApi.getDailyWorkstationData(workstationId, {
            registered_at: new Date().toISOString().split('T')[0] // Data atual
          });
          
          console.log(`Dados da estação ${workstationId}:`, response);
          
          if (response && Array.isArray(response) && response.length > 0) {
            // Pegar o último item que contém o resumo
            const summary = response[response.length - 1];
            
            if (summary && summary["total produced"] !== undefined) {
              const fpy = summary["FPY"] || 0;
              
              // Determinar status baseado no FPY
              let status;
              if (fpy >= 80) {
                status = 'Disponível';
              } else if (fpy >= 50) {
                status = 'Manutenção';
              } else {
                status = 'Parada';
              }
              
              statusCounts[status]++;
              
              console.log(`✅ Estação ${workstationId} - FPY: ${fpy}% - Status: ${status}`);
            } else {
              // Se não há dados, considerar como parada
              statusCounts['Parada']++;
              console.log(`⚠️ Estação ${workstationId} - Sem dados - Status: Parada`);
            }
          } else {
            // Se não há resposta, considerar como parada
            statusCounts['Parada']++;
            console.log(`❌ Estação ${workstationId} - Sem resposta - Status: Parada`);
          }
        } catch (error) {
          console.error(`Erro ao verificar estação ${workstationId}:`, error);
          // Em caso de erro, considerar como parada
          statusCounts['Parada']++;
        }
      }
      
      // Converter para formato do gráfico
      const chartData = Object.entries(statusCounts)
        .filter(([status, count]) => count > 0)
        .map(([status, count]) => ({
          name: status,
          value: count
        }));
      
      console.log('=== Status das estações ===');
      console.log('Contadores:', statusCounts);
      console.log('Dados do gráfico:', chartData);
      
      setData(chartData);
    } catch (error) {
      console.error('Erro ao buscar status das estações:', error);
      setError('Erro ao carregar status das estações');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchStationStatus();
  }, []);

  return (
    <Box sx={{
      width: '100%',
      maxWidth: isMobile ? 340 : 600,
      minWidth: 0,
      height: isMobile ? 450 : { xs: 450, sm: 520, md: 580 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      borderRadius: 4,
      boxShadow: '0 2px 12px 0 rgba(190,49,36,0.10)',
      p: isMobile ? 1.2 : 3,
      mx: 'auto',
      overflowY: isMobile ? 'auto' : 'visible',
      pb: isMobile ? 2.5 : undefined,
    }}>
      <Typography
        ref={titleRef}
        variant={isMobile ? 'h6' : 'h4'}
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
          fontSize: isMobile ? 16 : undefined
        }}
      >
        STATUS DAS ESTAÇÕES
      </Typography>
      <Box sx={{ width: barWidth, height: 5, borderBottom: '5px solid #BE3124', mb: 2, mx: 'auto', transition: 'width 0.2s' }} />
      
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: isMobile ? 250 : '80%',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={40} sx={{ color: '#BE3124' }} />
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
            Carregando status das estações...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: isMobile ? 250 : '80%',
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
            onClick={fetchStationStatus}
          >
            Tentar novamente
          </Typography>
        </Box>
      ) : data.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: isMobile ? 250 : '80%',
          color: '#666'
        }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Nenhum dado disponível
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 250 : '80%'}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 20 : 40}
              outerRadius={isMobile ? 40 : 80}
              fill="#8884d8"
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
              isAnimationActive={true}
              animationDuration={1200}
              stroke="#fff"
              strokeWidth={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      )}
      
      <Box sx={{ mt: isMobile ? 1.5 : 3, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1.5 : 4, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: isMobile ? 13 : 22, height: isMobile ? 7 : 12, bgcolor: '#43A047', borderRadius: 1, mr: 1 }} />
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: isMobile ? 11 : 16 }}>Disponível</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: isMobile ? 13 : 22, height: isMobile ? 7 : 12, bgcolor: '#FFD600', borderRadius: 1, mr: 1 }} />
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: isMobile ? 11 : 16 }}>Manutenção</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: isMobile ? 13 : 22, height: isMobile ? 7 : 12, bgcolor: '#BE3124', borderRadius: 1, mr: 1 }} />
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: isMobile ? 11 : 16 }}>Parada</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PieStatusChart; 