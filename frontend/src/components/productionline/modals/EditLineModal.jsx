import React, { useState, useEffect } from 'react';
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

function EditLineModal({ open, onClose, lineData, onUpdateSubmit, loading }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // UseEffect para preencher os campos quando o modal abre ou lineData muda
  useEffect(() => {
    if (open && lineData) {
      setName(lineData.name || '');
      setLocation(lineData.location || lineData.localizacao || '');
      // Converte o status de exibição ('Operacional', 'Parada') para o formato da API ('active', 'inactive')
      if (lineData.status === 'Operacional') {
        setStatus('active');
      } else if (lineData.status === 'Parada') {
        setStatus('inactive');
      } else if (lineData.status === 'Em Manutenção') {
        setStatus('maintenance');
      } else {
        setStatus(''); // Define um valor padrão ou vazio se desconhecido
      }
    }
  }, [open, lineData]);

  const handleSubmit = () => {
    // Validação básica
    if (!name.trim() || !location.trim() || !status) {
      // Remover alert, apenas não submeter
      return;
    }
    const updatedData = {
      name,
      location,
      status
    };
    onUpdateSubmit(lineData.id, updatedData); // Passa o ID e os dados atualizados
  };

  const commonInputSx = {
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
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#BE3124',
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isMobile ? false : 'sm'}
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
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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
          Editar Linha de Produção
        </DialogTitle>
        <DialogContent sx={{ mt: 2, px: isMobile ? 1 : 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1.5 : 2, pt: isMobile ? 1 : 2 }}>
            <TextField
              fullWidth
              label="Nome da Linha"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={commonInputSx}
              inputProps={{ style: { fontSize: isMobile ? 15 : 16 } }}
            />
            <TextField
              fullWidth
              label="Localização"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              sx={commonInputSx}
              inputProps={{ style: { fontSize: isMobile ? 15 : 16 } }}
            />
            <FormControl fullWidth required sx={commonInputSx}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
                sx={{ fontSize: isMobile ? 15 : 16 }}
              >
                <MenuItem value="active">Ativo</MenuItem>
                <MenuItem value="inactive">Inativo</MenuItem>
                <MenuItem value="maintenance">Em Manutenção</MenuItem>
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
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              backgroundColor: '#BE3124',
              fontSize: isMobile ? 15 : 16,
              py: 1.5,
              px: 2.5,
              borderRadius: 2,
              minWidth: 140,
              width: isMobile ? '100%' : 'auto',
              '&:hover': {
                backgroundColor: '#A6281D'
              }
            }}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditLineModal;