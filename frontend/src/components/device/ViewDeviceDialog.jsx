import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { ESTADO_CHOICES, TIPO_CHOICES } from './deviceService';

function getLabel(choices, value) {
  const found = choices.find(opt => opt.value === value);
  return found ? found.label : value;
}

function ViewDeviceDialog({ open, device, onClose }) {
  if (!device) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#f5f5f5',
          borderRadius: '25px',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#BE3124' }}>
        <VisibilityIcon />
        Visualizar Dispositivo
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">ID</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{device.id}</Typography>
          <Typography variant="subtitle2" color="text.secondary">Nome</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{device.nome}</Typography>
          <Typography variant="subtitle2" color="text.secondary">Descrição</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{device.descricao}</Typography>
          <Typography variant="subtitle2" color="text.secondary">Tipo</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{getLabel(TIPO_CHOICES, device.tipo)}</Typography>
          <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{getLabel(ESTADO_CHOICES, device.estado)}</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{ 
            backgroundColor: '#BE3124',
            '&:hover': {
              backgroundColor: '#a3291f'
            }
          }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewDeviceDialog; 