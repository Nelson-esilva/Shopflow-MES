import { Alert, IconButton, Snackbar } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

function SuccessAlert({ open, message, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        severity="success"
        variant="filled"
        sx={{
          width: '100%',
          backgroundColor: '#2E7D32',
          '& .MuiAlert-icon': {
            color: 'white'
          }
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
            sx={{ 
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SuccessAlert; 