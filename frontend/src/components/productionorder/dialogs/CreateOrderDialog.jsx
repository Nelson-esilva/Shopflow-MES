import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const CreateOrderDialog = ({
  open,
  onClose,
  onConfirm,
  form,
  onChange,
  loading,
  errors = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const hasGeneralError = Object.values(errors).some(Boolean);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isMobile ? 0 : '10px',
          m: isMobile ? 0 : undefined
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#FFF5F5',
        borderBottom: '1px solid #E2D9D9',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontSize: isMobile ? 20 : 24,
        py: isMobile ? 2 : 2
      }}>
        <AddIcon sx={{ color: '#000' }} />
        Nova Ordem de Produção
      </DialogTitle>
      <DialogContent sx={{ mt: 2, px: isMobile ? 1 : 3, py: isMobile ? 1 : 2 }}>
        {hasGeneralError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Corrija os erros abaixo para continuar. Não é permitido criar uma ordem com meta negativa ou data de fim anterior à data de início.
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            fullWidth
            label="Código da Ordem"
            name="order_code"
            value={form.order_code}
            onChange={onChange}
            required
            size={isMobile ? 'medium' : 'small'}
          />
          <TextField
            fullWidth
            label="Meta"
            name="quantity_meta"
            type="number"
            value={form.quantity_meta}
            onChange={onChange}
            required
            size={isMobile ? 'medium' : 'small'}
          />
          <TextField
            fullWidth
            label="Data de Início"
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={onChange}
            required
            InputLabelProps={{ shrink: true }}
            size={isMobile ? 'medium' : 'small'}
            sx={isMobile ? {
              fontSize: 17,
              '& .MuiInputBase-root': {
                height: 56,
                fontSize: 17,
                borderRadius: 2,
                px: 1.2
              },
              '& input': {
                fontSize: 17,
                py: 2
              }
            } : {}}
          />
          <TextField
            fullWidth
            label="Data de Fim"
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={onChange}
            required
            InputLabelProps={{ shrink: true }}
            size={isMobile ? 'medium' : 'small'}
            sx={isMobile ? {
              fontSize: 17,
              '& .MuiInputBase-root': {
                height: 56,
                fontSize: 17,
                borderRadius: 2,
                px: 1.2
              },
              '& input': {
                fontSize: 17,
                py: 2
              }
            } : {}}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: isMobile ? 2 : 2, borderTop: '1px solid #E2D9D9', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          fullWidth={isMobile}
          sx={{ 
            color: '#666',
            fontSize: isMobile ? 18 : 16,
            py: isMobile ? 1.5 : 1,
            '&:hover': {
              backgroundColor: '#F5F5F5'
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          fullWidth={isMobile}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{
            backgroundColor: '#BE3124',
            fontSize: isMobile ? 18 : 16,
            py: isMobile ? 1.5 : 1,
            '&:hover': {
              backgroundColor: '#A6281D'
            }
          }}
        >
          {loading ? 'Criando...' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrderDialog; 