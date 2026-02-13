import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Cell, Tooltip as RechartsTooltip, LabelList } from 'recharts';
import BarChartIcon from '@mui/icons-material/BarChart';
import { chartPaperSx } from './LineStatusChart';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const label = name === 'Produzidos' ? 'Produzidos' : name === 'Defeitos' ? 'Defeitos' : name;
    return (
      <Box sx={{ bgcolor: '#fff', p: 1.2, borderRadius: 2, boxShadow: 2, minWidth: 90 }}>
        <Typography sx={{ fontWeight: 700, color: name === 'Produzidos' ? '#1976d2' : '#D32F2F', fontSize: 15 }}>{label}</Typography>
        <Typography sx={{ color: '#333', fontSize: 14 }}>{value}</Typography>
      </Box>
    );
  }
  return null;
};

const renderLabel = (props) => {
  const { x, y, value, fill } = props;
  return (
    <text x={x} y={y - 8} fill={fill} fontSize={props.isMobile ? 12 : 16} fontWeight={700} textAnchor="middle">{value}</text>
  );
};

const ProductionVsDefectsChart = ({ totalProduced, totalDefects, productionDefectsData }) => {
  const [animatedData, setAnimatedData] = useState([]);

  useEffect(() => {
    setAnimatedData([]);
    const timeout = setTimeout(() => {
      setAnimatedData(productionDefectsData);
    }, 200);
    return () => clearTimeout(timeout);
  }, [productionDefectsData]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper sx={{
      ...chartPaperSx,
      background: '#fff',
      p: isMobile ? '12px 4px 16px 4px' : 4,
      borderRadius: 4,
      minWidth: isMobile ? 'auto' : { xs: 'auto', md: '320px' },
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: isMobile ? 1.5 : 1 }}>
        <BarChartIcon sx={{ color: '#1976d2', fontSize: isMobile ? 24 : 32 }} />
        <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={{ color: '#222', fontWeight: 900, letterSpacing: '-0.5px', fontSize: isMobile ? 17 : undefined }}>
          Produção vs. Defeitos
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height={isMobile ? 180 : 200} minHeight={isMobile ? 150 : 180}>
        <BarChart data={animatedData} margin={{ top: isMobile ? 12 : 20, right: isMobile ? 4 : 30, left: isMobile ? 4 : 20, bottom: isMobile ? 8 : 5 }}>
          <XAxis dataKey="name" tick={{ fontWeight: 700, fontSize: isMobile ? 13 : 15, fill: '#333' }} />
          <YAxis tick={{ fontWeight: 700, fontSize: isMobile ? 13 : 15, fill: '#333' }} />
          <RechartsTooltip content={<CustomTooltip />} />
          <Bar dataKey="value" nameKey="name" isAnimationActive={true} animationDuration={1200} animationBegin={200} barSize={isMobile ? 22 : 28}>
            {animatedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.name === 'Produzidos' ? 'url(#prodGradient)' : 'url(#defGradient)'} />
            ))}
            <LabelList dataKey="value" content={props => renderLabel({ ...props, isMobile })} />
          </Bar>
          <defs>
            <linearGradient id="prodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1976d2" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#1976d2" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="defGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D32F2F" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#D32F2F" stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-around', width: '100%', mt: isMobile ? 2 : 1, gap: isMobile ? 2 : 0 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? 14 : undefined }}>Total Produzido</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: isMobile ? 18 : 20 }}>
            {totalProduced}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? 14 : undefined }}>Total Defeitos</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#D32F2F', fontSize: isMobile ? 18 : 20 }}>
            {totalDefects}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductionVsDefectsChart; 