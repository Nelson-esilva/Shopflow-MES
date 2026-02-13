import React from 'react';
import { Paper, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip as RechartsTooltip, Legend, LabelList, CartesianGrid, Cell } from 'recharts';
import BarChartIcon from '@mui/icons-material/BarChart';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 2, boxShadow: 3, minWidth: 120 }}>
        <Typography sx={{ fontWeight: 900, color: '#BE3124', fontSize: 16, mb: 0.5 }}>{label}</Typography>
        {payload.map((entry, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 14, height: 14, borderRadius: 1, background: entry.color }} />
            <Typography sx={{ fontWeight: 700, color: entry.color, fontSize: 15 }}>{entry.name}:</Typography>
            <Typography sx={{ color: '#333', fontWeight: 700, fontSize: 15 }}>{entry.value}</Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

const renderLabel = (props) => {
  const { x, y, value, fill } = props;
  return (
    <text x={x} y={y - 12} fill={fill} fontSize={16} fontWeight={900} textAnchor="middle" style={{ textShadow: '0 1px 4px #fff' }}>{value}</text>
  );
};

const prodGradient = 'url(#prodGradient)';
const defGradient = 'url(#defGradient)';

const StationChartsView = ({ stations }) => {
  const data = (stations || []).map(station => ({
    name: station.name,
    Produzidos: station.produzidos ?? Math.floor(Math.random() * 200 + 50),
    Defeitos: station.defeitos ?? Math.floor(Math.random() * 30),
  }));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper sx={{
      p: { xs: 2, sm: 4 },
      borderRadius: 5,
      boxShadow: '0 4px 32px 0 rgba(190,49,36,0.06), 0 1.5px 6px 0 rgba(255,255,255,0.7)',
      background: '#fff',
      width: '100%'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <BarChartIcon sx={{ color: '#BE3124', fontSize: isMobile ? 26 : 38 }} />
        <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: '#BE3124', fontWeight: 900, letterSpacing: '-1px', textShadow: '0 2px 8px #fff', fontSize: isMobile ? 18 : undefined }}>
          Produção vs Defeitos por Estação
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" minHeight={isMobile ? 220 : 320} height={isMobile ? 260 : 420}>
        <BarChart data={data} margin={{ top: isMobile ? 10 : 30, right: isMobile ? 10 : 40, left: isMobile ? 0 : 10, bottom: isMobile ? 10 : 30 }} barCategoryGap={isMobile ? 12 : 32}>
          <defs>
            <linearGradient id="prodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1976d2" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#1976d2" stopOpacity={0.65} />
            </linearGradient>
            <linearGradient id="defGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D32F2F" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#D32F2F" stopOpacity={0.65} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
          <XAxis dataKey="name" tick={{ fontWeight: 900, fontSize: isMobile ? 12 : 16, fill: '#222' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontWeight: 900, fontSize: isMobile ? 12 : 16, fill: '#222' }} axisLine={false} tickLine={false} />
          <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#ccc' }} />
          <Legend verticalAlign="top" height={isMobile ? 30 : 40} iconType="rect" wrapperStyle={{ fontWeight: 900, fontSize: isMobile ? 12 : 16, color: '#222' }} />
          <Bar dataKey="Produzidos" fill={prodGradient} radius={[12, 12, 0, 0]} isAnimationActive animationDuration={1200} barSize={isMobile ? 16 : 32} >
            <LabelList dataKey="Produzidos" content={renderLabel} />
            {data.map((entry, idx) => <Cell key={idx} fill={prodGradient} />)}
          </Bar>
          <Bar dataKey="Defeitos" fill={defGradient} radius={[12, 12, 0, 0]} isAnimationActive animationDuration={1200} barSize={isMobile ? 16 : 32} >
            <LabelList dataKey="Defeitos" content={renderLabel} />
            {data.map((entry, idx) => <Cell key={idx} fill={defGradient} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default StationChartsView; 