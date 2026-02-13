import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const EditProductDialog = ({
  open,
  onClose,
  onConfirm,
  form,
  onChange,
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
        Editar Produto
      </DialogTitle>
      <DialogContent sx={{ mt: 2, px: isMobile ? 2 : 3, py: isMobile ? 1.5 : 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1.2 : 2, pt: isMobile ? 1 : 2 }}>
          <TextField
            fullWidth
            label="Nome"
            name="name"
            value={form.name}
            onChange={onChange}
            required
            size={isMobile ? 'small' : 'medium'}
            sx={{ fontSize: isMobile ? 15 : 16 }}
          />
          <TextField
            fullWidth
            label="Modelo"
            name="model"
            value={form.model}
            onChange={onChange}
            required
            size={isMobile ? 'small' : 'medium'}
            sx={{ fontSize: isMobile ? 15 : 16 }}
          />
          <TextField
            fullWidth
            label="Código"
            name="code"
            value={form.code}
            onChange={onChange}
            required
            size={isMobile ? 'small' : 'medium'}
            sx={{ fontSize: isMobile ? 15 : 16 }}
          />
          <FormControl fullWidth required size={isMobile ? 'small' : 'medium'}>
            <InputLabel sx={{ fontSize: isMobile ? 15 : 16 }}>Tipo</InputLabel>
            <Select
              name="product_type"
              value={form.product_type}
              onChange={onChange}
              label="Tipo"
              sx={{ fontSize: isMobile ? 15 : 16 }}
            >
              <MenuItem value="raw_material" sx={{ fontSize: isMobile ? 15 : 16 }}>Matéria Prima</MenuItem>
              <MenuItem value="semi_finished" sx={{ fontSize: isMobile ? 15 : 16 }}>Semi-Acabado</MenuItem>
              <MenuItem value="finished" sx={{ fontSize: isMobile ? 15 : 16 }}>Produto Final</MenuItem>
            </Select>
          </FormControl>
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

export default EditProductDialog; 