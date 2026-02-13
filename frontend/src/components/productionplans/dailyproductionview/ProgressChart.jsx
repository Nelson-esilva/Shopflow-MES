import React, { useEffect, useState } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { Typography, Box, Paper, Grid } from '@mui/material';
import 'react-circular-progressbar/dist/styles.css';

const ProgressChart = ({ percentage, meta, produzido, diferenca, mensagem }) => {
  // Definir as cores do degradê conforme o percentual
  let corInicio = '#BE3124'; // vermelho
  let corFim = '#FFD600';    // amarelo
  if (percentage >= 70) {
    corInicio = '#43A047';   // verde
    corFim = '#A5D6A7';      // verde claro
  } else if (percentage >= 40) {
    corInicio = '#FFD600';   // amarelo
    corFim = '#43A047';      // verde
  }
  // ID único para o gradiente (caso haja mais de um gráfico na tela)
  const gradId = `gradientProgress${Math.round(percentage)}`;

  // Animação do preenchimento
  const [animatedValue, setAnimatedValue] = useState(0);
  useEffect(() => {
    setAnimatedValue(0);
    if (percentage > 0) {
      let start = 0;
      const duration = 900; // ms
      const step = 10; // ms
      const totalSteps = Math.ceil(duration / step);
      const increment = percentage / totalSteps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= percentage) {
          setAnimatedValue(percentage);
          clearInterval(interval);
        } else {
          setAnimatedValue(Math.round(current));
        }
      }, step);
      return () => clearInterval(interval);
    } else {
      setAnimatedValue(0);
    }
  }, [percentage]);

  return (
    <Grid container justifyContent="center" alignItems="stretch">
      <Grid item xs={12} md={6} sx={{ height: '100%' }}>
      <Paper
        elevation={8}
        sx={{
          p: 4,
          textAlign: 'center',
          height: '100%',
          borderRadius: 6, 
          boxShadow: 'none',
          background: 'none',
          mx: 'auto'
        }}
      >
        <Box sx={{ mx: 'auto', mb: 0 }}>
          <CircularProgressbarWithChildren
            value={animatedValue}
            circleRatio={0.5}
            strokeWidth={14}
            styles={buildStyles({
              rotation: 0.75,
              strokeLinecap: 'round',
              trailColor: '#e0e0e0',
              pathColor: `url(#${gradId})`,
              backgroundColor: '#fff',
            })}
          >
              {/* Gradiente SVG dinâmico */}
            <svg style={{ height: 0 }}>
              <defs>
                  <linearGradient id={gradId} gradientTransform="rotate(90)">
                    <stop offset="0%" stopColor={corInicio} />
                    <stop offset="100%" stopColor={corFim} />
                </linearGradient>
              </defs>
            </svg>
            <Box sx={{ textAlign: 'center', mt: -2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="h1" sx={{ fontWeight: 900, color: '#000', mb: 0, lineHeight: 1, fontFamily: 'monospace', fontSize: '3.2rem', letterSpacing: '-2px' }}>
                {`${animatedValue}%`}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.2, fontWeight: 500, fontSize: '1.1rem', letterSpacing: 0.5 }}>
                Completado
              </Typography>
            </Box>
          </CircularProgressbarWithChildren>
        </Box>
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 1, mt: -7 }}>
          <Grid item>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', textAlign: 'center', fontSize: '1rem', mb: 0.5 }}>
              Meta
            </Typography>
            <Box sx={{ px: 3, py: 1.2, borderRadius: 3, background: '#fff', color: '#BE3124', fontWeight: 900, fontSize: '2rem', fontFamily: 'monospace', boxShadow: '0 2px 8px rgba(190,49,36,0.07)', textAlign: 'center', minWidth: 70 }}>
              {meta}
            </Box>
          </Grid>
          <Grid item>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', textAlign: 'center', fontSize: '1rem', mb: 0.5 }}>
              Produzido
            </Typography>
            <Box sx={{ px: 3, py: 1.2, borderRadius: 3, background: '#fff', color: '#1976d2', fontWeight: 900, fontSize: '2rem', fontFamily: 'monospace', boxShadow: '0 2px 8px rgba(25,118,210,0.07)', textAlign: 'center', minWidth: 70 }}>
              {produzido}
            </Box>
          </Grid>
          <Grid item>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', textAlign: 'center', fontSize: '1rem', mb: 0.5 }}>
              Diferença
            </Typography>
              <Box sx={{ px: 3, py: 1.2, borderRadius: 3, background: '#fff', color: '#000', fontWeight: 900, fontSize: '2rem', fontFamily: 'monospace', boxShadow: '0 2px 8px rgba(190,49,36,0.04)', textAlign: 'center', minWidth: 70 }}>
              {diferenca}
            </Box>
          </Grid>
        </Grid>
        {mensagem && (
          <Typography variant="subtitle1" sx={{ color: '#888', mt: 2 }}>
            {mensagem}
          </Typography>
        )}
      </Paper>
    </Grid>
  </Grid>
);
};

export default ProgressChart; 