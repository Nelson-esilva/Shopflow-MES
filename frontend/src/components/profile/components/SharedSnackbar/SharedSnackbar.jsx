// This component provides a reusable Material-UI Snackbar for displaying temporary messages to the user.
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const SharedSnackbar = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SharedSnackbar;