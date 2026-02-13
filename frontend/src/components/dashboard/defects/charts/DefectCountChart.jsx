import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, Cell } from 'recharts';
import { Box, Typography, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import carouselApi from '../../carousel/carouselApi';

const BAR_GRADIENT = 'url(#barGradient)';
const BAR_COLORS = ['#1565C0', '#8E24AA', '#FBC02D', '#D32F2F', '#EF6C00'];

const DEFECT_COLORS = {
  'Solda Fria': '#1565C0',
  'Componente Invertido': '#8E24AA',
  'Falta de Componente': '#FBC02D',
  'Curto': '#D32F2F',
  'Trilha Quebrada': '#EF6C00',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const defect = payload[0].payload.defect;
    const color = DEFECT_COLORS[defect] || '#222';
    return (
      <Box sx={{ bgcolor: '#fff', p: 1, borderRadius: 2, boxShadow: 2, minWidth: 90 }}>
        <Typography variant="body2" fontWeight={900} color="#222" mb={0.5}>
          Quantidade: {payload[0].value}
        </Typography>
        <Typography variant="subtitle2" fontWeight={700} sx={{ color }}>{defect}</Typography>
      </Box>
    );
  }
  return null;
};

// Componente customizado para o tick do eixo X (quebra em até 2 linhas)
const CustomXAxisTick = (props) => {
  const { x, y, payload } = props;
  const isMobile = window.innerWidth <= 600;
  const words = payload.value.split(' ');
  let line1 = words[0];
  let line2 = words.slice(1).join(' ');
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={isMobile ? 7 : 10} textAnchor="middle" fontWeight={700} fontSize={isMobile ? 10 : 12} fill="#222">
        {line1}
        {line2 && (
          <tspan x={0} dy={isMobile ? 11 : 14}>{line2}</tspan>
        )}
      </text>
    </g>
  );
};

const DefectCountChart = () => {
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
      
      console.log('=== Buscando dados de defeitos para DefectCountChart ===');
      
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
          defect,
          qtd: count
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
          fontSize: isMobile ? 16 : undefined
        }}
      >
        Quantidade de Defeitos por Tipo
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
            Carregando dados de defeitos...
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
          height: isMobile ? 180 : '80%',
          color: '#666'
        }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Nenhum dado disponível
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 180 : '80%'}>
          <BarChart data={data} layout="horizontal" margin={{ top: isMobile ? 20 : 40, right: isMobile ? 10 : 30, left: isMobile ? 10 : 30, bottom: isMobile ? 18 : 30 }} barCategoryGap={isMobile ? 16 : 48}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#BE3124" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#FFD600" stopOpacity={0.85} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#f0eaea" />
            <XAxis dataKey="defect" type="category" tick={<CustomXAxisTick />} axisLine={false} tickLine={false} interval={0} />
            <YAxis type="number" allowDecimals={false} tick={{ fontWeight: 700, fontSize: isMobile ? 12 : 18 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f7f7fa' }} />
            <Bar dataKey="qtd" radius={[6, 6, 0, 0]} barSize={isMobile ? 22 : 48} isAnimationActive={true} animationDuration={1200}>
              <LabelList dataKey="qtd" position="top" fontWeight={900} fontSize={isMobile ? 13 : 20} fill="#222" />
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default DefectCountChart; 