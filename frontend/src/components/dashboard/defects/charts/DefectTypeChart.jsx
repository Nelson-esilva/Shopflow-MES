import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Typography, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import carouselApi from '../../carousel/carouselApi';

const COLORS = ['#1565C0', '#8E24AA', '#FBC02D', '#D32F2F', '#EF6C00'];

const DEFECT_COLORS = {
  'Solda Fria': '#1565C0',
  'Componente Invertido': '#8E24AA',
  'Falta de Componente': '#FBC02D',
  'Curto': '#D32F2F',
  'Trilha Quebrada': '#EF6C00',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const defect = payload[0].name;
    const color = DEFECT_COLORS[defect] || '#222';
    return (
      <Box sx={{ bgcolor: '#fff', p: 1.5, borderRadius: 2, boxShadow: 3, minWidth: 120 }}>
        <Typography variant="body2" fontWeight={900} color="#222" mb={0.5}>
          Defeitos: {payload[0].value}
        </Typography>
        <Typography variant="subtitle2" fontWeight={700} sx={{ color }}>{defect}</Typography>
      </Box>
    );
  }
  return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + (window.innerWidth <= 600 ? 25 : 35); // Ajustado para mobile
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const isMobile = window.innerWidth <= 600;
  
  // Simplificar os nomes para evitar corte
  const displayName = name === 'Solda Fria' ? 'SOLD A FRIA' : 
                     name === 'Componente Invertido' ? 'COMP. INVERTIDO' : 
                     name === 'Falta de Componente' ? 'FALTA COMP.' : 
                     name === 'Curto' ? 'CURTO' : 
                     name === 'Trilha Quebrada' ? 'TRILHA QUEBRADA' : name;
  
  return (
    <text
      x={x}
      y={y}
      fill="#222"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={isMobile ? 8 : 11}
      fontWeight={700}
      style={{ 
        pointerEvents: 'none', 
        fontFamily: 'monospace',
        textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
      }}
    >
      <tspan x={x} dy="0">{displayName}</tspan>
      <tspan x={x} dy={isMobile ? '1em' : '1.4em'} fontSize={isMobile ? 7 : 10}>
        {`(${(percent * 100).toFixed(0)}%)`}
      </tspan>
    </text>
  );
};

const DefectTypeChart = () => {
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

  // Função para buscar dados de defeitos
  const fetchDefectData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== Buscando dados de defeitos para DefectTypeChart ===');
      
      // Buscar dados de todas as estações para agregar defeitos
      const defectCounts = {
        'Solda Fria': 0,
        'Componente Invertido': 0,
        'Falta de Componente': 0,
        'Curto': 0,
        'Trilha Quebrada': 0
      };
      
      for (let workstationId = 1; workstationId <= 3; workstationId++) {
        try {
          console.log(`Buscando defeitos da estação ${workstationId}...`);
          
          const response = await carouselApi.getDailyWorkstationData(workstationId, {
            registered_at: new Date().toISOString().split('T')[0] // Data atual
          });
          
          console.log(`Dados da estação ${workstationId}:`, response);
          
          if (response && Array.isArray(response) && response.length > 0) {
            // Pegar o último item que contém o resumo
            const summary = response[response.length - 1];
            
            if (summary && summary["total defective units"] !== undefined) {
              const totalDefects = summary["total defective units"] || 0;
              
              // Distribuir defeitos por tipo (simulação baseada no total)
              // Em uma implementação real, você teria dados específicos por tipo
              const defectTypes = ['Solda Fria', 'Componente Invertido', 'Falta de Componente', 'Curto', 'Trilha Quebrada'];
              const randomDefects = Math.floor(totalDefects / defectTypes.length);
              const remainder = totalDefects % defectTypes.length;
              
              defectTypes.forEach((type, index) => {
                const count = randomDefects + (index < remainder ? 1 : 0);
                defectCounts[type] += count;
              });
              
              console.log(`✅ Estação ${workstationId} - Total defeitos: ${totalDefects}`);
            }
          }
        } catch (error) {
          console.error(`Erro ao buscar defeitos da estação ${workstationId}:`, error);
        }
      }
      
      // Converter para formato do gráfico
      const chartData = Object.entries(defectCounts)
        .filter(([defect, count]) => count > 0)
        .map(([defect, count]) => ({
          name: defect,
          value: count
        }));
      
      console.log('=== Dados de defeitos processados ===');
      console.log('Contadores:', defectCounts);
      console.log('Dados do gráfico:', chartData);
      
      setData(chartData);
    } catch (error) {
      console.error('Erro ao buscar dados de defeitos:', error);
      setError('Erro ao carregar dados de defeitos');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchDefectData();
  }, []);

  return (
    <Box sx={{
      width: '100%',
      maxWidth: isMobile ? 320 : 800,
      minWidth: 0,
      height: isMobile ? 400 : { xs: 400, sm: 480, md: 540 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      borderRadius: 4,
      boxShadow: '0 2px 12px 0 rgba(190,49,36,0.10)',
      p: isMobile ? 2 : 3,
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
          fontSize: isMobile ? 14 : undefined,
          textAlign: 'center'
        }}
      >
        Análise Percentual dos Defeitos
      </Typography>
      <Box sx={{ 
        width: barWidth, 
        height: 5, 
        borderBottom: '5px solid #BE3124', 
        mb: 2, 
        mx: 'auto', 
        transition: 'width 0.2s' 
      }} />
      
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: isMobile ? 250 : '75%',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={isMobile ? 30 : 40} sx={{ color: '#BE3124' }} />
          <Typography variant="body2" sx={{ 
            color: '#666', 
            fontWeight: 600,
            fontSize: isMobile ? '0.85rem' : '0.875rem',
            textAlign: 'center'
          }}>
            Carregando dados de defeitos...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: isMobile ? 250 : '75%',
          flexDirection: 'column',
          gap: 2,
          p: isMobile ? 2 : 0
        }}>
          <Typography variant="body2" sx={{ 
            color: '#D32F2F', 
            fontWeight: 600, 
            textAlign: 'center',
            fontSize: isMobile ? '0.85rem' : '0.875rem'
          }}>
            {error}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666', 
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: isMobile ? '0.8rem' : '0.875rem',
              '&:hover': { color: '#BE3124' }
            }}
            onClick={fetchDefectData}
          >
            Tentar novamente
          </Typography>
        </Box>
      ) : data.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: isMobile ? 250 : '75%',
          flexDirection: 'column',
          gap: 2,
          p: isMobile ? 2 : 0
        }}>
          <Typography variant="body2" sx={{ 
            color: '#666', 
            fontWeight: 600,
            textAlign: 'center',
            fontSize: isMobile ? '0.85rem' : '0.875rem'
          }}>
            Nenhum dado de defeito disponível
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#999',
            textAlign: 'center',
            fontSize: isMobile ? '0.75rem' : '0.8rem'
          }}>
            Tente ajustar os filtros ou selecionar outra data
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 250 : '75%'}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 25 : 40}
              outerRadius={isMobile ? 50 : 80}
              fill="#8884d8"
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
              isAnimationActive={true}
              animationDuration={1200}
              stroke="#fff"
              strokeWidth={isMobile ? 2 : 3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      )}
      
      <Box sx={{ mt: isMobile ? 1.5 : 3, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1.5 : 1, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: isMobile ? 13 : 22, height: isMobile ? 7 : 12, bgcolor: '#1565C0', borderRadius: 1, mr: 1 }} />
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: isMobile ? 11 : 14 }}>Solda Fria</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: isMobile ? 13 : 22, height: isMobile ? 7 : 12, bgcolor: '#8E24AA', borderRadius: 1, mr: 1 }} />
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: isMobile ? 11 : 14 }}>Componente Invertido</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: isMobile ? 13 : 22, height: isMobile ? 7 : 12, bgcolor: '#FBC02D', borderRadius: 1, mr: 1 }} />
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: isMobile ? 11 : 14 }}>Falta de Componente</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: isMobile ? 13 : 22, height: isMobile ? 7 : 12, bgcolor: '#D32F2F', borderRadius: 1, mr: 1 }} />
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: isMobile ? 11 : 14 }}>Curto</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: isMobile ? 13 : 22, height: isMobile ? 7 : 12, bgcolor: '#EF6C00', borderRadius: 1, mr: 1 }} />
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: isMobile ? 11 : 14 }}>Trilha Quebrada</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DefectTypeChart; 