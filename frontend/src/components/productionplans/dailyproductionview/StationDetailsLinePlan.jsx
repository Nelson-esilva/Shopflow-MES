import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Chip, Tooltip } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import stationApi from '../../productionline/service/stationApi';

const StationDetailsLinePlan = ({ plan }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Extrai o id da linha do plano
  const lineId = plan?.production_line?.id || plan?.production_line;

  // Filtra manualmente as estações para garantir que só as da linha correta sejam exibidas
  const filteredStations = stations.filter(
    s => (s.production_line?.id || s.production_line) === lineId
  );

  // Resumo de status
  const total = filteredStations.length;
  const operacionais = filteredStations.filter(s => s.current_status).length;
  const paradas = total - operacionais;

  useEffect(() => {
    if (!lineId) return;
    setLoading(true);
    setError('');
    stationApi.getAllStations(lineId)
      .then(setStations)
      .catch(() => setError('Erro ao buscar estações da linha.'))
      .finally(() => setLoading(false));
  }, [lineId]);

  if (!lineId) return null;

  // Cabeçalho melhorado
  return (
    <>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: isMobile ? 1.2 : { xs: 2, sm: 3 },
          borderRadius: isMobile ? 2 : 4,
          background: '#fff',
          boxShadow: isMobile ? 'none' : '0 2px 8px 0 rgba(0, 0, 0, 0.07)',
          border: '1px solid #E0E0E0',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'center',
            gap: isMobile ? 1.2 : 2.5,
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'space-between',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2 }}>
            {/* Ícone de status geral: verde (todas operacionais), vermelho (todas paradas), amarelo (misto) */}
            <CircleIcon
              sx={{
                color:
                  operacionais === total && total > 0
                    ? '#43A047' // verde
                    : paradas === total && total > 0
                    ? '#D32F2F' // vermelho
                    : '#FFA000', // amarelo
                fontSize: isMobile ? 26 : 40,
                mr: isMobile ? 0.7 : 1,
              }}
            />
            <Typography
              variant={isMobile ? 'subtitle1' : 'h5'}
              fontWeight={900}
              color="#BE3124"
              sx={{
                letterSpacing: '-1px',
                textShadow: '0 2px 8px #fff',
                mr: isMobile ? 0 : 2,
                fontSize: isMobile ? 18 : 26,
              }}
            >
              Estações da Linha
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: isMobile ? 0.7 : 1.5, justifyContent: isMobile ? 'center' : 'flex-end', mt: isMobile ? 1 : 0 }}>
            <Chip
              label={`Operacionais: ${operacionais}`}
              color="success"
              size={isMobile ? 'small' : 'medium'}
              sx={{
                fontWeight: 700,
                fontSize: isMobile ? 13 : 16,
                boxShadow: '0 1px 4px rgba(67,160,71,0.10)',
                px: isMobile ? 1.2 : 2,
              }}
            />
            <Chip
              label={`Paradas: ${paradas}`}
              color="error"
              size={isMobile ? 'small' : 'medium'}
              sx={{
                fontWeight: 700,
                fontSize: isMobile ? 13 : 16,
                boxShadow: '0 1px 4px rgba(211,47,47,0.10)',
                px: isMobile ? 1.2 : 2,
              }}
            />
          </Box>
        </Box>
      </Paper>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={32} sx={{ color: '#BE3124' }} />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
      ) : filteredStations.length === 0 ? (
        <Typography sx={{ p: 2, color: '#888' }}>Nenhuma estação cadastrada para esta linha.</Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 2,
          }}
        >
          {filteredStations.map(station => {
            // Garante que current_status seja interpretado corretamente
            const isOperational = String(station.current_status) === 'true' || station.current_status === true;
            const statusText = isOperational ? 'Operacional' : 'Parada';
            const statusColor = isOperational ? '#43A047' : '#D32F2F';
            const statusIcon = isOperational
              ? <CheckCircleIcon sx={{ color: '#43A047', fontSize: 38 }} />
              : <ErrorIcon sx={{ color: '#D32F2F', fontSize: 38 }} />;
            return (
              <Paper
                key={station.id}
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  boxShadow: 0,
                  borderLeft: `10px solid ${statusColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  background: '#fff',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 56 }}>
                  {statusIcon}
                  <Chip
                    label={statusText}
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: statusColor,
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#222', mb: 0.5 }}>
                    {station.name}
                  </Typography>
                  {station.description?.funcao && (
                    <Typography variant="body2" sx={{ color: '#555', mb: 0.5 }}>
                      <b>Função:</b> {station.description.funcao}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      label={`Funcionários: ${station.num_employees ?? '-'}`}
                      size="small"
                      sx={{ background: '#F5F5F5', color: '#BE3124', fontWeight: 700, fontSize: 13 }}
                    />
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}
    </>
  );
};

export default StationDetailsLinePlan; 