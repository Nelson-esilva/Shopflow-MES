import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, InfoOutlined as InfoOutlinedIcon, Assignment as AssignmentIcon } from '@mui/icons-material';

// Funções utilitárias para status (igual tabela)
import {
  CheckCircle as CheckCircleIcon,
  PauseCircle as PauseCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
  PlayCircle as PlayCircleIcon
} from '@mui/icons-material';

const getStatusProps = (status) => {
  switch (status) {
    case 'empty':
      return {
        icon: <HourglassEmptyIcon sx={{ mr: 1, color: '#1976d2' }} />, // azul
        sx: { background: '#e3f2fd', color: '#1976d2', fontWeight: 700 }
      };
    case 'in_progress':
      return {
        icon: <PlayCircleIcon sx={{ mr: 1, color: '#ff9800' }} />, // laranja
        sx: { background: '#fff3e0', color: '#ff9800', fontWeight: 700 }
      };
    case 'paused':
      return {
        icon: <PauseCircleIcon sx={{ mr: 1, color: '#757575' }} />, // cinza
        sx: { background: '#f5f5f5', color: '#757575', fontWeight: 700 }
      };
    case 'completed':
      return {
        icon: <CheckCircleIcon sx={{ mr: 1, color: '#388e3c' }} />, // verde
        sx: { background: '#e8f5e9', color: '#388e3c', fontWeight: 700 }
      };
    case 'canceled':
      return {
        icon: <CancelIcon sx={{ mr: 1, color: '#d32f2f' }} />, // vermelho
        sx: { background: '#ffebee', color: '#d32f2f', fontWeight: 700 }
      };
    case 'planned':
      return {
        icon: <HourglassEmptyIcon sx={{ mr: 1, color: '#1976d2' }} />,
        sx: { background: '#e3f2fd', color: '#1976d2', fontWeight: 700 }
      };
    default:
      return {
        icon: <HourglassEmptyIcon sx={{ mr: 1, color: '#1976d2' }} />,
        sx: { background: '#e3f2fd', color: '#1976d2', fontWeight: 700 }
      };
  }
};

const getStatusLabel = (status) => {
  const statusLabels = {
    'empty': 'Planejado',
    'planned': 'Planejado',
    'in_progress': 'Em Andamento...',
    'paused': 'Pausado',
    'completed': 'Concluído',
    'canceled': 'Cancelado'
  };
  return statusLabels[status] || status;
};

const formatDate = (dateString) => {
  if (!dateString) return '--';
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  return d.toLocaleDateString('pt-BR');
};

const shiftLabels = {
  'Morning': 'Manhã',
  'Afternoon': 'Tarde',
  'Evening': 'Noite'
};

const OrderMainDetails = ({ order, onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Cabeçalho responsivo */}
      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        mb: isMobile ? 2 : 4,
        px: isMobile ? 1 : { xs: 2, sm: 4 },
        py: isMobile ? 1.2 : 2.5,
        borderRadius: isMobile ? 2 : 4, // borderRadius 2 no mobile, 4 no desktop
        background: '#222',
        boxShadow: '0 2px 12px 0 rgba(190,49,36,0.10)',
        gap: isMobile ? 1.5 : 3
      }}>
        <IconButton onClick={onBack} sx={{
          mr: isMobile ? 0 : 2,
          mb: isMobile ? 1 : 0,
          width: isMobile ? 40 : 54,
          height: isMobile ? 40 : 54,
          background: '#fff',
          color: '#BE3124',
          border: '2px solid #fff',
          boxShadow: '0 2px 8px rgba(190,49,36,0.10)',
          alignSelf: isMobile ? 'flex-start' : 'center',
          '&:hover': { background: '#222', color: '#BE3124' }
        }}>
          <ArrowBackIcon sx={{ fontSize: isMobile ? 22 : 32 }} />
        </IconButton>
        <Box sx={{ textAlign: isMobile ? 'center' : 'left', width: '100%' }}>
          <Typography variant={isMobile ? 'h6' : 'h4'} sx={{ fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', mb: isMobile ? 1 : 0.5, fontSize: isMobile ? 20 : undefined }}>
            Detalhes da Ordem de Produção
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'center' : 'center',
              justifyContent: isMobile ? 'center' : 'flex-start',
              gap: isMobile ? 1 : 2,
              mt: isMobile ? 0.5 : 0
            }}
          >
            <InfoOutlinedIcon sx={{ color: '#fff', fontSize: isMobile ? 18 : 24, mb: isMobile ? 0.5 : 0, mr: isMobile ? 0 : 0.5 }} />
            {(() => {
              const statusProps = getStatusProps(order.status);
              return (
                <Chip
                  icon={statusProps.icon}
                  label={getStatusLabel(order.status)}
                  sx={{ ...statusProps.sx, minWidth: isMobile ? 90 : 140, fontSize: isMobile ? 13 : 15, borderRadius: 2, px: isMobile ? 1 : 2, py: isMobile ? 0.5 : 1, fontWeight: 900, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)', mb: isMobile ? 0.5 : 0 }}
                />
              );
            })()}
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 400, fontSize: isMobile ? 13 : 16, textAlign: isMobile ? 'center' : 'left', mt: isMobile ? 0.5 : 0 }}>
              Criado: {formatDate(order.created)} | Atualizado: {formatDate(order.updated)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Resumo da Ordem */}
      <Paper sx={{
        p: isMobile ? 2 : 3,
        mb: 4,
        borderRadius: isMobile ? 3 : 3,
        background: '#fff',
        border: '1px solid #eee',
        boxShadow: '0 2px 8px 0 rgba(190,49,36,0.04)'
      }}>
        <Grid container spacing={isMobile ? 1.5 : 2}>
          <Grid item xs={6} sm={2}>
            <Typography variant="subtitle2" fontWeight={900} color="#BE3124" sx={{ fontSize: isMobile ? 13 : 15, mb: isMobile ? 0.2 : 0.5 }}>ID</Typography>
            <Typography variant="h6" sx={{ fontSize: isMobile ? 15 : 20, fontWeight: 700 }}>{order.id}</Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="subtitle2" fontWeight={900} color="#BE3124" sx={{ fontSize: isMobile ? 13 : 15, mb: isMobile ? 0.2 : 0.5 }}>Meta</Typography>
            <Typography variant="h6" sx={{ fontSize: isMobile ? 15 : 20, fontWeight: 700 }}>{order.quantity_meta}</Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="subtitle2" fontWeight={900} color="#BE3124" sx={{ fontSize: isMobile ? 13 : 15, mb: isMobile ? 0.2 : 0.5 }}>Planejado</Typography>
            <Typography variant="h6" sx={{ fontSize: isMobile ? 15 : 20, fontWeight: 700 }}>{order.quantity_planned}</Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="subtitle2" fontWeight={900} color="#BE3124" sx={{ fontSize: isMobile ? 13 : 15, mb: isMobile ? 0.2 : 0.5 }}>Produzido</Typography>
            <Typography variant="h6" sx={{ fontSize: isMobile ? 15 : 20, fontWeight: 700 }}>{order.quantity_completed}</Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="subtitle2" fontWeight={900} color="#BE3124" sx={{ fontSize: isMobile ? 13 : 15, mb: isMobile ? 0.2 : 0.5 }}>Início</Typography>
            <Typography variant="h6" sx={{ fontSize: isMobile ? 15 : 20, fontWeight: 700 }}>{formatDate(order.start_date)}</Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="subtitle2" fontWeight={900} color="#BE3124" sx={{ fontSize: isMobile ? 13 : 15, mb: isMobile ? 0.2 : 0.5 }}>Fim</Typography>
            <Typography variant="h6" sx={{ fontSize: isMobile ? 15 : 20, fontWeight: 700 }}>{formatDate(order.end_date)}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Planos Relacionados */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 2, justifyContent: isMobile ? 'center' : 'flex-start' }}>
        <AssignmentIcon sx={{ color: '#BE3124', fontSize: isMobile ? 22 : 28 }} />
        <Typography
          variant={isMobile ? 'subtitle1' : 'h6'}
          sx={{
            fontWeight: 900,
            color: '#BE3124',
            letterSpacing: '-0.5px',
            fontSize: isMobile ? 17 : 22,
            textAlign: isMobile ? 'center' : 'left',
            mb: 0
          }}
        >
          Planos Relacionados
        </Typography>
      </Box>
      {order.plans && order.plans.length > 0 ? (
        isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {order.plans.map((plan) => (
              <Box key={plan.id} sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(190,49,36,0.07)', border: '1px solid #E0E0E0', p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 700, color: '#BE3124', fontSize: 15 }}>#{plan.id}</Typography>
                  {(() => {
                    const statusProps = getStatusProps(plan.status);
                    return (
                      <Chip
                        icon={statusProps.icon}
                        label={getStatusLabel(plan.status)}
                        sx={{ ...statusProps.sx, minWidth: 80, fontSize: 12, borderRadius: 2, px: 1, py: 0.2, fontWeight: 900 }}
                      />
                    );
                  })()}
                </Box>
                <Typography sx={{ fontWeight: 600, color: '#222', fontSize: 15, mb: 0.5 }}>Dia: {plan.production_day}</Typography>
                <Typography sx={{ color: '#666', fontSize: 14 }}><b>Meta:</b> {plan.total_quantity}</Typography>
                <Typography sx={{ color: '#666', fontSize: 14 }}><b>Produto:</b> {plan.product}</Typography>
                <Typography sx={{ color: '#666', fontSize: 14 }}><b>Linha:</b> {plan.production_line}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography sx={{ fontWeight: 700, color: '#BE3124', fontSize: 13, mb: 0.5 }}>Turnos:</Typography>
                  {plan.shifts && Object.keys(plan.shifts).length > 0 ? (
                    Object.entries(plan.shifts).map(([shiftName, shiftData]) => (
                      <Box key={shiftName} sx={{ mb: 0.3 }}>
                        <Typography variant="caption" fontWeight={900} color="#BE3124">{shiftLabels[shiftName] || shiftName}:</Typography>{' '}
                        {shiftData.quantity !== undefined && (
                          <Typography variant="caption">Qtd: {shiftData.quantity} </Typography>
                        )}
                        <Typography variant="caption">({shiftData.init_time} - {shiftData.stop_time})</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="caption" color="text.secondary">--</Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #f7f7fa 60%, #fff 100%)', boxShadow: '0 4px 24px 0 rgba(190,49,36,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.04)', mt: 2 }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#BE3124' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>ID</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Dia</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Status</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Meta</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Produto</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Linha</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Turnos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell><Typography fontWeight={700} fontSize={15}>{plan.id}</Typography></TableCell>
                  <TableCell><Typography fontWeight={700} fontSize={15}>{plan.production_day}</Typography></TableCell>
                  <TableCell>
                    {(() => {
                      const statusProps = getStatusProps(plan.status);
                      return (
                        <Chip
                          icon={statusProps.icon}
                          label={getStatusLabel(plan.status)}
                          sx={{ ...statusProps.sx, minWidth: 110, fontSize: 14, borderRadius: 2, px: 1, py: 0.2, fontWeight: 900 }}
                        />
                      );
                    })()}
                  </TableCell>
                  <TableCell><Typography fontWeight={700} fontSize={15}>{plan.total_quantity}</Typography></TableCell>
                  <TableCell><Typography fontWeight={700} fontSize={15}>{plan.product}</Typography></TableCell>
                  <TableCell><Typography fontWeight={700} fontSize={15}>{plan.production_line}</Typography></TableCell>
                  <TableCell>
                    {plan.shifts && Object.keys(plan.shifts).length > 0 ? (
                      <Box>
                        {Object.entries(plan.shifts).map(([shiftName, shiftData]) => (
                          <Box key={shiftName} sx={{ mb: 0.5 }}>
                            <Typography variant="caption" fontWeight={900} color="#BE3124">{shiftLabels[shiftName] || shiftName}:</Typography>{' '}
                            {shiftData.quantity !== undefined && (
                              <Typography variant="caption">Qtd: {shiftData.quantity} </Typography>
                            )}
                            <Typography variant="caption">({shiftData.init_time} - {shiftData.stop_time})</Typography>
                          </Box>
                        ))}
                      </Box>
                    ) : '--'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )
      ) : (
        <Typography color="text.secondary">Nenhum plano relacionado.</Typography>
      )}
    </Box>
  );
};

export default OrderMainDetails; 