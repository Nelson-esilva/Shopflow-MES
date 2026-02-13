import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const DeleteOrderDialog = ({
  open,
  onClose,
  onConfirm,
  order,
  loading
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
          background: '#fff',
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
        <DeleteIcon sx={{ color: '#000', fontSize: isMobile ? 22 : 26 }} />
        Confirmar Exclusão
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: isMobile ? 15 : 17 }}>
          Tem certeza que deseja excluir a ordem "{order?.order_code || order?.id}"?<br/>
          Esta ação não pode ser desfeita.
        </Typography>
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
          color="error"
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
          {loading ? 'Excluindo...' : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteOrderDialog; 