import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: '#fff', p: 1.2, borderRadius: 2, boxShadow: 2, minWidth: 90 }}>
        <Typography sx={{ fontWeight: 700, color: '#BE3124', fontSize: 15 }}>{payload[0].name}</Typography>
        <Typography sx={{ color: '#333', fontSize: 14 }}>{payload[0].value} linha(s)</Typography>
      </Box>
    );
  }
  return null;
};

const LineStatusChart = ({ operationalCount, maintenanceCount, stoppedCount, pieChartData, COLORS }) => {
  const [animatedData, setAnimatedData] = useState([]);

  useEffect(() => {
    setAnimatedData([]);
    const timeout = setTimeout(() => {
      setAnimatedData(pieChartData);
    }, 200);
    return () => clearTimeout(timeout);
  }, [pieChartData]);

  // Calcular o maior percentual para passar ao label
  const total = animatedData.reduce((acc, cur) => acc + cur.value, 0);
  const percents = animatedData.map(d => (total > 0 ? d.value / total : 0));
  const maxPercent = Math.max(...percents, 0);

  // Novo renderCenterLabel recebendo maxPercent
  const renderCenterLabel = ({ cx, cy, percent }) => {
    if (Math.abs(percent - maxPercent) < 0.001 && percent > 0) {
      return (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" style={{ fontSize: isMobile ? 18 : 28, fontWeight: 900, fill: '#000' }}>
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }
    return null;
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper sx={{
      ...chartPaperSx,
      background: '#fff',
      p: isMobile ? 2 : 4,
      borderRadius: 4,
      minWidth: isMobile ? 'auto' : { xs: 'auto', md: '320px' },
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <DonutLargeIcon sx={{ color: '#BE3124', fontSize: isMobile ? 22 : 32 }} />
        <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={{ color: '#222', fontWeight: 900, letterSpacing: '-0.5px', fontSize: isMobile ? 16 : undefined }}>
          Status das Linhas
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height={isMobile ? 160 : 220} minHeight={isMobile ? 140 : 220}>
        <PieChart>
          <Pie
            data={animatedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={isMobile ? 48 : 75}
            fill="#8884d8"
            dataKey="value"
            label={renderCenterLabel}
            isAnimationActive={true}
            animationDuration={1200}
            animationBegin={200}
          >
            {animatedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <RechartsTooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: isMobile ? 12 : '1rem', marginTop: isMobile ? 4 : 10 }} />
        </PieChart>
      </ResponsiveContainer>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-around', width: '100%', mt: 1, gap: isMobile ? 1 : 0 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? 13 : undefined }}>Operacional</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: COLORS['Operacional'], fontSize: isMobile ? 15 : 18 }}>
            {operationalCount}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? 13 : undefined }}>Manutenção</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: COLORS['Em Manutenção'], fontSize: isMobile ? 15 : 18 }}>
            {maintenanceCount}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? 13 : undefined }}>Parada</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: COLORS['Parada'], fontSize: isMobile ? 15 : 18 }}>
            {stoppedCount}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export const chartPaperSx = {
  p: 4,
  borderRadius: 4,
  border: '1.5px solid #F0EAEA',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  minWidth: { xs: 'auto', md: '320px' },
  background: 'linear-gradient(135deg, #f7f7fa 60%, #fff 100%)',
  boxShadow: '0 4px 24px 0 rgba(190,49,36,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.04)'
};

export default LineStatusChart; 