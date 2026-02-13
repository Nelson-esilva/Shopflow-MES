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
import { useTheme, useMediaQuery } from '@mui/material';
import { toastSuccess, toastError } from '../../notifications/toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NewItemModal({ open, onClose, onCreateSubmit, loading }) {
  const [lineName, setLineName] = React.useState('');
  const [lineLocation, setLineLocation] = React.useState('');
  const [lineStatus, setLineStatus] = React.useState('active');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Efeito para limpar os campos sempre que o modal for aberto
  React.useEffect(() => {
    if (open) {
      setLineName('');
      setLineLocation('');
      setLineStatus('active');
    }
  }, [open]);

  // Função de submissão do formulário
  const handleSubmit = async () => {
    if (!lineName.trim() || !lineLocation.trim()) {
      // Remover alert, apenas não submeter
      return;
    }
    const dataToSend = {
      name: lineName,
      location: lineLocation,
      status: lineStatus,
    };
    try {
      await onCreateSubmit(dataToSend);
      toastSuccess('Linha criada com sucesso!');
    } catch (error) {
      toastError('Erro ao criar linha.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      // Recomendo manter a forma correta de usar formulários com Dialog para evitar bugs
      PaperProps={{
        component: 'form',
        onSubmit: (e) => {
          e.preventDefault();
          handleSubmit();
        },
      }}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isMobile ? 0 : '10px',
          m: isMobile ? 0 : undefined,
        },
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="custom-toast-container"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
      <DialogTitle sx={{
        backgroundColor: '#FFF5F5',
        borderBottom: '1px solid #E2D9D9',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontSize: isMobile ? '1.25rem' : '1.5rem', // 20px / 24px
        py: 2, // Padding vertical consistente
      }}>
        <AddIcon sx={{ color: '#000' }} />
        Criar Nova Linha
      </DialogTitle>

      <DialogContent sx={{ px: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {/* A principal mudança está aqui: usando a prop 'size' */}
          <TextField
            fullWidth
            label="Nome da Linha"
            name="lineName"
            value={lineName}
            onChange={(e) => setLineName(e.target.value)}
            required
            size={isMobile ? 'medium' : 'small'}
          />
          <TextField
            fullWidth
            label="Localização"
            name="lineLocation"
            value={lineLocation}
            onChange={(e) => setLineLocation(e.target.value)}
            required
            size={isMobile ? 'medium' : 'small'}
          />
          <FormControl fullWidth required size={isMobile ? 'medium' : 'small'}>
            <InputLabel id="line-status-label">Status</InputLabel>
            <Select
              labelId="line-status-label"
              name="lineStatus"
              value={lineStatus}
              onChange={(e) => setLineStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="active">Ativo</MenuItem>
              <MenuItem value="inactive">Inativo</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      
      {/* Esta seção foi copiada exatamente do seu exemplo funcional */}
      <DialogActions sx={{
        p: 2,
        borderTop: '1px solid #E2D9D9',
        flexDirection: isMobile ? 'column' : 'row', // Empilha no mobile
        gap: isMobile ? 1 : 0
      }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          fullWidth={isMobile}
          sx={{ 
            color: '#666',
            fontSize: isMobile ? '1rem' : '0.875rem', // 16px / 14px
            py: isMobile ? 1.5 : 1,
            '&:hover': { backgroundColor: '#F5F5F5' }
          }}
        >
          Cancelar
        </Button>
        <Button
          type="submit" // O botão agora submete o formulário
          variant="contained"
          disabled={loading}
          fullWidth={isMobile}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{
            backgroundColor: '#BE3124',
            fontSize: isMobile ? '1rem' : '0.875rem',
            py: isMobile ? 1.5 : 1,
            '&:hover': { backgroundColor: '#A6281D' }
          }}
        >
          {loading ? 'Criando...' : 'Criar Linha'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewItemModal;