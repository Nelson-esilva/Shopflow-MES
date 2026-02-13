import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ViewOrderDialog = ({ open, onClose, order }) => {
  if (!order) return null;

  const getStatusColor = (status) => {
    const statusColors = {
      'planned': 'info',
      'in_progress': 'warning',
      'paused': 'default',
      'completed': 'success',
      'canceled': 'error'
    };
    return statusColors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'planned': 'Planejada',
      'in_progress': 'Em Produção',
      'paused': 'Pausada',
      'completed': 'Concluída',
      'canceled': 'Cancelada'
    };
    return statusLabels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#FFF5F5',
        borderBottom: '1px solid #E2D9D9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 500, color: '#333' }}>
          Detalhes da Ordem de Produção
        </Typography>
        <Button
          onClick={onClose}
          sx={{ 
            minWidth: 'auto',
            p: 0.5,
            color: '#666'
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Informações Básicas */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                Informações Básicas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">ID</Typography>
                  <Typography variant="body1">{order.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip 
                    label={getStatusLabel(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Detalhes da Produção */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
              Detalhes da Produção
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Produto</Typography>
                <Typography variant="body1">{order.product?.name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Linha de Produção</Typography>
                <Typography variant="body1">{order.production_line?.name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Plano</Typography>
                <Typography variant="body1">{order.plan?.plan_code || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Quantidades */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
              Quantidades
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Quantidade Planejada</Typography>
                <Typography variant="body1">{order.quantity_planned}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Quantidade Concluída</Typography>
                <Typography variant="body1">{order.quantity_completed}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Quantidade Total</Typography>
                <Typography variant="body1">{order.quantity}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Datas */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
              Datas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Data de Início</Typography>
                <Typography variant="body1">{formatDate(order.start_date)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Data de Fim</Typography>
                <Typography variant="body1">{formatDate(order.end_date)}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #E2D9D9' }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderColor: '#BE3124',
            color: '#BE3124',
            '&:hover': {
              borderColor: '#8B1E1E',
              backgroundColor: 'rgba(190, 49, 36, 0.04)'
            }
          }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewOrderDialog; 