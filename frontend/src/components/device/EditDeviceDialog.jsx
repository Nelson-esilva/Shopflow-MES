import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert
} from '@mui/material';
import { ESTADO_CHOICES, TIPO_CHOICES } from './deviceService';

function EditDeviceDialog({ open, device, onConfirm, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo: '',
    estado: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (device) {
      setFormData({
        nome: device.nome || '',
        descricao: device.descricao || '',
        tipo: device.tipo || '',
        estado: device.estado || ''
      });
    }
  }, [device]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validação básica
    if (!formData.descricao.trim()) {
      setError('A descrição é obrigatória');
      return;
    }

    try {
      await onConfirm(device.id, formData);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Erro ao atualizar dispositivo');
    }
  };

  if (!device) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Editar Dispositivo</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="nome"
              label="Nome"
              value={formData.nome}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(190, 49, 36, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(190, 49, 36, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#BE3124',
                  },
                },
              }}
            />

            <TextField
              name="descricao"
              label="Descrição"
              value={formData.descricao}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(190, 49, 36, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(190, 49, 36, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#BE3124',
                  },
                },
              }}
            />

            <TextField
              name="tipo"
              label="Tipo"
              value={formData.tipo}
              onChange={handleChange}
              select
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(190, 49, 36, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(190, 49, 36, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#BE3124',
                  },
                },
              }}
            >
              {TIPO_CHOICES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="estado"
              label="Estado"
              value={formData.estado}
              onChange={handleChange}
              select
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(190, 49, 36, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(190, 49, 36, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#BE3124',
                  },
                },
              }}
            >
              {ESTADO_CHOICES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{
              backgroundColor: '#BE3124',
              '&:hover': {
                backgroundColor: '#9C291E'
              }
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditDeviceDialog; 