import React, { useEffect, useState } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { Typography, Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import 'react-circular-progressbar/dist/styles.css';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ErrorIcon from '@mui/icons-material/Error';

const CarouselChart = ({ percentage, meta, produzido, diferenca, defeitos }) => {
  // Log para debug
  console.log('=== CarouselChart recebeu dados ===');
  console.log('Percentage:', percentage, typeof percentage);
  console.log('Meta:', meta, typeof meta);
  console.log('Produzido:', produzido, typeof produzido);
  console.log('Diferença:', diferenca, typeof diferenca);
  console.log('Defeitos:', defeitos, typeof defeitos);
  
  // Validar se os dados são números válidos
  const validPercentage = typeof percentage === 'number' && !isNaN(percentage) ? percentage : 0;
  const validMeta = typeof meta === 'number' && !isNaN(meta) ? meta : 0;
  const validProduzido = typeof produzido === 'number' && !isNaN(produzido) ? produzido : 0;
  const validDiferenca = typeof diferenca === 'number' && !isNaN(diferenca) ? diferenca : 0;
  const validDefeitos = typeof defeitos === 'number' && !isNaN(defeitos) ? defeitos : 0;
  
  console.log('Dados validados:', {
    percentage: validPercentage,
    meta: validMeta,
    produzido: validProduzido,
    diferenca: validDiferenca,
    defeitos: validDefeitos
  });
  
  // Definir as cores do degradê conforme o percentual
  let corInicio = '#BE3124'; // vermelho
  let corFim = '#BE3124';    // vermelho
  if (validPercentage > 65) {
    corInicio = '#43A047';   // verde escuro
    corFim = '#38ef7d';      // verde claro
  } else if (validPercentage > 35) {
    corInicio = '#FFD600';   // amarelo
    corFim = '#FFEA00';      // amarelo claro
  }
  const gradId = `gradientProgress${Math.round(validPercentage)}`;

  // Animação do preenchimento
  const [animatedValue, setAnimatedValue] = useState(0);
  useEffect(() => {
    setAnimatedValue(0);
    if (validPercentage > 0) {
      let start = 0;
      const duration = 900; // ms
      const step = 10; // ms
      const totalSteps = Math.ceil(duration / step);
      const increment = validPercentage / totalSteps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= validPercentage) {
          setAnimatedValue(validPercentage);
          clearInterval(interval);
        } else {
          setAnimatedValue(Math.round(current));
        }
      }, step);
      return () => clearInterval(interval);
    } else {
      setAnimatedValue(0);
    }
  }, [validPercentage]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
      <Grid item xs={12} sx={{ height: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ 
          maxWidth: isMobile ? 340 : 700, 
          mx: 'auto', 
          mb: 0, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          width: '100%',
          minHeight: isMobile ? 400 : 500,
          p: isMobile ? 1 : 0
        }}>
          {/* Gauge Chart */}
          <Box sx={{ 
            width: isMobile ? '100%' : 470, 
            maxWidth: isMobile ? 280 : 470, 
            mx: 'auto',
            mb: isMobile ? 2 : 0
          }}>
            <CircularProgressbarWithChildren
              value={animatedValue}
              circleRatio={0.5}
              strokeWidth={isMobile ? 10 : 11}
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
              <Box sx={{ 
                textAlign: 'center', 
                mt: isMobile ? -1 : -3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%' 
              }}>
                <Typography variant="h1" sx={{ 
                  fontWeight: 900, 
                  color: '#111', 
                  mb: 0, 
                  lineHeight: 1, 
                  fontFamily: 'monospace', 
                  fontSize: isMobile ? '2.2rem' : '5.2rem', 
                  letterSpacing: '-2px' 
                }}>
                  {`${animatedValue}%`}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary', 
                  mt: 0.2, 
                  fontWeight: 500, 
                  fontSize: isMobile ? '0.85rem' : '1.1rem', 
                  letterSpacing: 0.5 
                }}>
                  Completado
                </Typography>
              </Box>
            </CircularProgressbarWithChildren>
          </Box>

          {/* Métricas */}
          <Grid container 
            spacing={isMobile ? 1.5 : 2} 
            justifyContent="center" 
            sx={{ 
              mb: 1, 
              mt: isMobile ? 1 : -15, 
              flexDirection: isMobile ? 'row' : 'row', 
              alignItems: 'center',
              width: '100%',
              maxWidth: isMobile ? 320 : 600
            }}
          >
            {/* META */}
            <Grid item xs={6} sm="auto">
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                gap: 0.5, 
                mb: 0.5 
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5 
                }}>
                  <EmojiEventsIcon sx={{ 
                    color: '#BE3124', 
                    fontSize: isMobile ? 16 : 22 
                  }} />
                  <Typography variant="caption" sx={{ 
                    fontWeight: 600, 
                    color: 'text.secondary', 
                    textAlign: 'center', 
                    fontSize: isMobile ? '0.75rem' : '1rem',
                    textTransform: 'uppercase'
                  }}>
                    Meta
                  </Typography>
                </Box>
                <Box sx={{ 
                  px: isMobile ? 1.5 : 3, 
                  py: isMobile ? 0.6 : 1.2, 
                  borderRadius: 3, 
                  background: '#fff', 
                  color: '#BE3124', 
                  fontWeight: 900, 
                  fontSize: isMobile ? '1.1rem' : '2rem', 
                  fontFamily: 'monospace', 
                  boxShadow: '0 2px 8px rgba(190,49,36,0.07)', 
                  textAlign: 'center', 
                  minWidth: isMobile ? 40 : 70,
                  width: '100%'
                }}>
                  {validMeta}
                </Box>
              </Box>
            </Grid>

            {/* PRODUZIDO */}
            <Grid item xs={6} sm="auto">
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                gap: 0.5, 
                mb: 0.5 
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5 
                }}>
                  <CheckCircleIcon sx={{ 
                    color: '#1976d2', 
                    fontSize: isMobile ? 16 : 22 
                  }} />
                  <Typography variant="caption" sx={{ 
                    fontWeight: 600, 
                    color: 'text.secondary', 
                    textAlign: 'center', 
                    fontSize: isMobile ? '0.75rem' : '1rem',
                    textTransform: 'uppercase'
                  }}>
                    Produzido
                  </Typography>
                </Box>
                <Box sx={{ 
                  px: isMobile ? 1.5 : 3, 
                  py: isMobile ? 0.6 : 1.2, 
                  borderRadius: 3, 
                  background: '#fff', 
                  color: '#1976d2', 
                  fontWeight: 900, 
                  fontSize: isMobile ? '1.1rem' : '2rem', 
                  fontFamily: 'monospace', 
                  boxShadow: '0 2px 8px rgba(25,118,210,0.07)', 
                  textAlign: 'center', 
                  minWidth: isMobile ? 40 : 70,
                  width: '100%'
                }}>
                  {validProduzido}
                </Box>
              </Box>
            </Grid>

            {/* DIFERENÇA */}
            <Grid item xs={6} sm="auto">
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                gap: 0.5, 
                mb: 0.5 
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5 
                }}>
                  <TrendingDownIcon sx={{ 
                    color: '#000', 
                    fontSize: isMobile ? 16 : 22 
                  }} />
                  <Typography variant="caption" sx={{ 
                    fontWeight: 600, 
                    color: 'text.secondary', 
                    textAlign: 'center', 
                    fontSize: isMobile ? '0.75rem' : '1rem',
                    textTransform: 'uppercase'
                  }}>
                    Diferença
                  </Typography>
                </Box>
                <Box sx={{ 
                  px: isMobile ? 1.5 : 3, 
                  py: isMobile ? 0.6 : 1.2, 
                  borderRadius: 3, 
                  background: '#fff', 
                  color: '#000', 
                  fontWeight: 900, 
                  fontSize: isMobile ? '1.1rem' : '2rem', 
                  fontFamily: 'monospace', 
                  boxShadow: '0 2px 8px rgba(190,49,36,0.04)', 
                  textAlign: 'center', 
                  minWidth: isMobile ? 40 : 70,
                  width: '100%'
                }}>
                  {validDiferenca}
                </Box>
              </Box>
            </Grid>

            {/* DEFEITOS */}
            <Grid item xs={6} sm="auto">
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                gap: 0.5, 
                mb: 0.5 
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5 
                }}>
                  <ErrorIcon sx={{ 
                    color: '#D32F2F', 
                    fontSize: isMobile ? 16 : 22 
                  }} />
                  <Typography variant="caption" sx={{ 
                    fontWeight: 600, 
                    color: 'text.secondary', 
                    textAlign: 'center', 
                    fontSize: isMobile ? '0.75rem' : '1rem',
                    textTransform: 'uppercase'
                  }}>
                    Defeitos
                  </Typography>
                </Box>
                <Box sx={{ 
                  px: isMobile ? 1.5 : 3, 
                  py: isMobile ? 0.6 : 1.2, 
                  borderRadius: 3, 
                  background: '#fff', 
                  color: '#D32F2F', 
                  fontWeight: 900, 
                  fontSize: isMobile ? '1.1rem' : '2rem', 
                  fontFamily: 'monospace', 
                  boxShadow: '0 2px 8px rgba(211,47,47,0.07)', 
                  textAlign: 'center', 
                  minWidth: isMobile ? 40 : 70,
                  width: '100%'
                }}>
                  {validDefeitos}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CarouselChart; 