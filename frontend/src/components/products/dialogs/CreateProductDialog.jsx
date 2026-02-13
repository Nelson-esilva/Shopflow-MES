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
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { createProduct } from '../productsApi';
import { toastSuccess, toastError } from '../../notifications/toast';

const CreateProductDialog = ({
  open,
  onClose,
  onConfirm,
  form,
  onChange,
  loading,
  isMobile = false,
  onProductCreated // nova prop opcional
}) => {
  const [error, setError] = React.useState('');

  const validateForm = () => {
    if (!form.name || !form.model || !form.code || !form.product_type) {
      setError('Preencha todos os campos obrigatórios.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;
    try {
      await createProduct(form);
      toastSuccess('Produto criado com sucesso!');
      if (onProductCreated) await onProductCreated();
      if (onClose) onClose();
    } catch (err) {
      toastError('Erro ao criar produto!');
      console.error('Erro da API:', err);
    }
  };

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
      <form onSubmit={handleSubmit}>
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
          Novo Produto
        </DialogTitle>
        <DialogContent sx={{ mt: 2, px: isMobile ? 1 : 3, py: isMobile ? 1 : 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Nome"
              name="name"
              value={form.name}
              onChange={onChange}
              required
              size={isMobile ? 'medium' : 'small'}
            />
            <TextField
              fullWidth
              label="Modelo"
              name="model"
              value={form.model}
              onChange={onChange}
              required
              size={isMobile ? 'medium' : 'small'}
            />
            <TextField
              fullWidth
              label="Código"
              name="code"
              value={form.code}
              onChange={onChange}
              required
              size={isMobile ? 'medium' : 'small'}
            />
            <FormControl fullWidth required size={isMobile ? 'medium' : 'small'}>
              <InputLabel>Tipo</InputLabel>
              <Select
                name="product_type"
                value={form.product_type}
                onChange={onChange}
                label="Tipo"
              >
                <MenuItem value="raw_material">Matéria Prima</MenuItem>
                <MenuItem value="semi_finished">Semi-Acabado</MenuItem>
                <MenuItem value="finished">Produto Final</MenuItem>
              </Select>
            </FormControl>
            {error && (
              <Box sx={{ color: '#BE3124', fontWeight: 600, fontSize: 15, mt: 1 }}>{error}</Box>
            )}
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
            type="submit"
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
      </form>
    </Dialog>
  );
};

export default CreateProductDialog; 