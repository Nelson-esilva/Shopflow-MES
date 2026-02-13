import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

function DeleteDeviceDialog({ open, device, onConfirm, onCancel }) {
  if (!device) return null;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        Confirmar Exclusão
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Tem certeza que deseja excluir o dispositivo:
        </DialogContentText>
        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
          {device.descricao}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {device.id}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          autoFocus
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDeviceDialog; 