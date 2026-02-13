import React from 'react';
import { Box, Typography, Divider, Button, Modal, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 420 },
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  overflowY: 'auto',
};

const StationDeleteModal = ({ open, onClose, onConfirm, station, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-station-modal-title"
      aria-describedby="delete-station-modal-description"
      sx={{ zIndex: theme.zIndex.modal }}
    >
      <Box
        sx={{
          ...modalStyle,
          width: isMobile ? '100vw' : modalStyle.width,
          minHeight: isMobile ? '100vh' : undefined,
          maxHeight: isMobile ? '100vh' : modalStyle.maxHeight,
          p: 0,
          borderRadius: isMobile ? 0 : 2,
          m: isMobile ? 0 : undefined,
        }}
      >
        <Box
          sx={{
            backgroundColor: '#FFF5F5',
            borderBottom: '1px solid #E2D9D9',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            px: isMobile ? 2 : 4,
            py: isMobile ? 1.2 : 2,
            borderTopLeftRadius: isMobile ? 0 : '10px',
            borderTopRightRadius: isMobile ? 0 : '10px',
          }}
        >
          <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={900} sx={{ color: '#000', display: 'flex', alignItems: 'center', gap: 1, fontSize: isMobile ? 20 : undefined }}>
            <DeleteIcon sx={{ color: '#D32F2F', fontSize: isMobile ? 22 : 28 }} />
            Excluir Estação
          </Typography>
        </Box>
        <Box sx={{ p: isMobile ? 2 : 4 }}>
          <Typography id="delete-station-modal-description" variant="body1" sx={{ mb: 2, color: '#222', fontSize: isMobile ? 15 : undefined }}>
            Tem certeza que deseja excluir a estação <strong>{station?.name}</strong> (ID: {station?.id})?
            <br />Esta ação é irreversível.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onClose} disabled={loading} sx={{ color: '#666', fontWeight: 700, textTransform: 'uppercase', width: isMobile ? '100%' : undefined, mb: isMobile ? 1 : 0 }}>
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              color="error"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
              sx={{ fontWeight: 700, textTransform: 'uppercase', backgroundColor: '#D32F2F', width: isMobile ? '100%' : undefined, '&:hover': { backgroundColor: '#A6281D' } }}
              disabled={loading}
            >
              {loading ? 'Excluindo...' : 'Excluir'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default StationDeleteModal; 