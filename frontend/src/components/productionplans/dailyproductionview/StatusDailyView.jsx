import React, { useState } from 'react';
import { Box, Chip, Typography, Paper, IconButton, Tooltip, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import BlockIcon from '@mui/icons-material/Block';
import { updatePlan, getPlanById } from '../plansApi';

const STATUS_LABELS = {
  empty: 'Planejado',
  planned: 'Planejado',
  in_progress: 'Em Andamento...',
  paused: 'Pausado',
  completed: 'Concluído',
  canceled: 'Cancelado'
};

const STATUS_SEQUENCE = ['planned', 'in_progress', 'paused', 'completed', 'canceled'];

const getStatusProps = (status) => {
  switch (status) {
    case 'empty':
    case 'planned':
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
    default:
      return {
        icon: <HourglassEmptyIcon sx={{ mr: 1, color: '#1976d2' }} />, // fallback azul
        sx: { background: '#e3f2fd', color: '#1976d2', fontWeight: 700 }
      };
  }
};

const StatusDailyView = ({ status: initialStatus, planId, onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const statusProps = getStatusProps(status);
  const label = STATUS_LABELS[status] || status || '--';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // DEBUG: log planId e status
  console.log('StatusDailyView planId:', planId, 'status:', status);

  // Função para atualizar status
  const handleUpdateStatus = async (newStatus) => {
    console.log('Tentando atualizar plano', planId, 'para', newStatus);
    if (!planId) return;
    setLoading(true);
    try {
      // Buscar o plano atual
      const planoAtual = await getPlanById(planId);
      if (!planoAtual) throw new Error('Plano não encontrado');
      // Montar objeto com todos os campos obrigatórios, alterando apenas o status
      const payload = {
        ...planoAtual,
        status: newStatus
      };
      await updatePlan(planId, payload);
      setStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus);
    } catch (e) {
      alert('Erro ao atualizar status do plano!');
    } finally {
      setLoading(false);
    }
  };

  // Função para obter o próximo status na sequência
  const getNextStatus = (current) => {
    const idx = STATUS_SEQUENCE.indexOf(current);
    if (idx === -1 || idx === STATUS_SEQUENCE.length - 1) return STATUS_SEQUENCE[0];
    return STATUS_SEQUENCE[idx + 1];
  };

  // Handler para clique no Paper (troca automática de status)
  const handlePaperClick = (e) => {
    // Evita conflito se clicar em um botão de ação
    if (e.target.closest('button')) return;
    const nextStatus = getNextStatus(status);
    handleUpdateStatus(nextStatus);
  };

  // Botões de ação para todos os status (exceto planned/empty)
  const allActions = [
    { icon: <PlayArrowIcon />, label: 'Iniciar', color: '#1976d2', next: 'in_progress' },
    { icon: <PauseIcon />, label: 'Pausar', color: '#757575', next: 'paused' },
    { icon: <DoneAllIcon />, label: 'Completar', color: '#388e3c', next: 'completed' },
    { icon: <BlockIcon />, label: 'Cancelar', color: '#d32f2f', next: 'canceled' }
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        p: { xs: isMobile ? 1.2 : 2, sm: isMobile ? 1.5 : 3 },
        borderRadius: isMobile ? 2 : 4,
        background: '#fff',
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)',
        border: '1px solid #E0E0E0',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? 1.5 : 2,
        width: '100%',
        maxWidth: '100%',
        justifyContent: isMobile ? 'center' : 'space-between',
        cursor: 'pointer',
        textAlign: isMobile ? 'center' : 'left'
      }}
      onClick={handlePaperClick}
    >
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: isMobile ? 1 : 2, justifyContent: isMobile ? 'center' : 'flex-start', width: isMobile ? '100%' : 'auto' }}>
        {React.cloneElement(statusProps.icon, { sx: { ...statusProps.icon.props.sx, fontSize: isMobile ? 22 : 32, mr: isMobile ? 0 : 1, mb: isMobile ? 0.5 : 0 } })}
        <Typography
          variant={isMobile ? 'subtitle2' : 'h6'}
          fontWeight={900}
          sx={{ color: statusProps.sx.color, letterSpacing: '-0.5px', mr: isMobile ? 0 : 2, fontSize: isMobile ? 15 : 20, mb: isMobile ? 0.5 : 0 }}
        >
          Status do Plano:
        </Typography>
        <Chip
          label={label}
          sx={{
            ...statusProps.sx,
            fontWeight: 700,
            fontSize: isMobile ? 13 : 18,
            px: isMobile ? 1.2 : 2,
            height: isMobile ? 28 : 36,
            mb: isMobile ? 0.5 : 0
          }}
          size={isMobile ? 'small' : 'medium'}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'row' : 'row', gap: isMobile ? 0.7 : 1, justifyContent: isMobile ? 'center' : 'flex-end', width: isMobile ? '100%' : 'auto', mt: isMobile ? 1 : 0 }}>
        {allActions.map((action) => (
          <Tooltip title={action.label} key={action.label}>
            <span>
              <IconButton
                onClick={() => {
                  console.log('Clicou no botão', action.next, 'planId:', planId);
                  handleUpdateStatus(action.next);
                }}
                sx={{ color: action.color, background: '#f5f5f5', borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', width: isMobile ? 32 : 44, height: isMobile ? 32 : 44, fontSize: isMobile ? 18 : 22, p: isMobile ? 0.7 : 1.2 }}
                disabled={loading || status === action.next}
              >
                {status === action.next && !loading ? action.icon : loading ? <CircularProgress size={isMobile ? 18 : 24} /> : action.icon}
              </IconButton>
            </span>
          </Tooltip>
        ))}
      </Box>
    </Paper>
  );
};

export default StatusDailyView;
