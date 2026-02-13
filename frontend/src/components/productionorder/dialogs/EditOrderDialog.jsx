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
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const EditOrderDialog = ({
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
        fontSize: isMobile ? 18 : 22,
        py: isMobile ? 1.2 : 2,
        px: isMobile ? 2 : 3
      }}>
        <EditIcon sx={{ color: '#000', fontSize: isMobile ? 22 : 26 }} />
        Editar Ordem de Produção
      </DialogTitle>
      <DialogContent sx={{ mt: 2, px: isMobile ? 2 : 3, py: isMobile ? 1.5 : 2 }}>
        {hasGeneralError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Corrija os erros abaixo para continuar. Não é permitido salvar uma ordem com meta negativa ou data de fim anterior à data de início.
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1.2 : 2, pt: isMobile ? 1 : 2 }}>
          <TextField
            fullWidth
            label="Código da Ordem"
            name="order_code"
            value={form.order_code}
            onChange={onChange}
            required
            error={!!errors.order_code}
            helperText={errors.order_code}
            size={isMobile ? 'small' : 'medium'}
            sx={{ fontSize: isMobile ? 15 : 16 }}
          />
          <TextField
            fullWidth
            label="Meta"
            name="quantity_meta"
            type="number"
            value={form.quantity_meta}
            onChange={onChange}
            required
            error={!!errors.quantity_meta}
            helperText={errors.quantity_meta}
            size={isMobile ? 'small' : 'medium'}
            sx={{ fontSize: isMobile ? 15 : 16 }}
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
            error={!!errors.start_date}
            helperText={errors.start_date}
            size={isMobile ? 'small' : 'medium'}
            sx={{ fontSize: isMobile ? 15 : 16 }}
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
            error={!!errors.end_date}
            helperText={errors.end_date}
            size={isMobile ? 'small' : 'medium'}
            sx={{ fontSize: isMobile ? 15 : 16 }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: isMobile ? 1.5 : 2, borderTop: '1px solid #E2D9D9', gap: 2 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          sx={{ 
            color: '#666',
            fontSize: isMobile ? 15 : 16,
            py: 1.5,
            px: 2.5,
            borderRadius: 2,
            minWidth: 120,
            width: isMobile ? '100%' : 'auto',
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
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{
            backgroundColor: '#BE3124',
            fontSize: isMobile ? 15 : 16,
            py: 1.5,
            px: 2.5,
            borderRadius: 2,
            minWidth: 140,
            width: isMobile ? '100%' : 'auto',
            '&:hover': {
              backgroundColor: '#a3291f'
            }
          }}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOrderDialog; 