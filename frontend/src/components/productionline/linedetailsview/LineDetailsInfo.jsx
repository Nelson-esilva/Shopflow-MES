import React from 'react';
import { Paper, Box, Typography, Chip, Grid, useTheme, useMediaQuery } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TagIcon from '@mui/icons-material/Tag';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const statusColor = (status) => {
  if (status === 'Operacional') return 'success';
  if (status === 'Em Manutenção') return 'warning';
  if (status === 'Parada') return 'error';
  return 'default';
};

const statusLabelColor = (status) => {
  if (status === 'Operacional') return '#43A047';
  if (status === 'Em Manutenção') return '#FFA000';
  if (status === 'Parada') return '#D32F2F';
  return '#888';
};

const LineDetailsInfo = ({ line }) => {
  if (!line) return null;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Paper elevation={8} sx={{
      p: { xs: 2, sm: 4 },
      mb: 3,
      borderRadius: 4,
      border: 'none',
      background: '#fff',
      boxShadow: '0 4px 24px 0 rgba(190,49,36,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      mx: 'auto',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <InfoIcon sx={{ fontSize: isMobile ? 28 : 38, mr: 1, color: '#BE3124' }} />
        <Typography variant={isMobile ? 'h6' : 'h4'} fontWeight={900} color="#BE3124" sx={{ letterSpacing: '-1px', fontSize: isMobile ? 20 : undefined }}>
          Detalhes da Linha
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TagIcon sx={{ color: '#888', fontSize: 22 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              ID:
            </Typography>
            <Typography variant="body1" sx={{ ml: 0.5 }}>{line.id}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiberManualRecordIcon sx={{ color: statusLabelColor(line.status), fontSize: 18 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Status:
            </Typography>
            <Chip
              label={line.status}
              size="small"
              sx={{
                ml: 1,
                fontWeight: 700,
                color: '#fff',
                backgroundColor: statusLabelColor(line.status),
                px: 1.5,
                fontSize: 15,
                letterSpacing: 0.5
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon sx={{ color: '#888', fontSize: 22 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Localização:
            </Typography>
            <Typography variant="body1" sx={{ ml: 0.5 }}>{line.localizacao}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupWorkIcon sx={{ color: '#888', fontSize: 22 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Estações:
            </Typography>
            <Typography variant="body1" sx={{ ml: 0.5 }}>{line.quantidadeDeEstacoes}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LineDetailsInfo; 