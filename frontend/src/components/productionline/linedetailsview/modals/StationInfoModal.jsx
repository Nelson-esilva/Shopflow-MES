import React from 'react';
import { Box, Typography, Divider, Button, Modal, Chip, useTheme, useMediaQuery } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600, md: 700 },
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  overflowY: 'auto',
};

const StationDetailsModal = ({
  open,
  onClose,
  station,
}) => {
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="station-details-modal-title"
      aria-describedby="station-details-modal-description"
      sx={{
        zIndex: theme.zIndex.modal,
      }}
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
        {/* Header com nome, status, ID e data */}
        <Box
          id="station-details-modal-title"
          sx={{
            backgroundColor: '#FFF5F5',
            borderBottom: '1px solid #E2D9D9',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            px: isMobile ? 2 : 4,
            py: isMobile ? 1.2 : 2.5,
            borderTopLeftRadius: isMobile ? 0 : '10px',
            borderTopRightRadius: isMobile ? 0 : '10px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BusinessIcon sx={{ color: '#BE3124', fontSize: isMobile ? 24 : 32 }} />
            <Box>
              <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={900} sx={{ color: '#000', letterSpacing: '-1px', mb: 0.2, fontSize: isMobile ? 20 : undefined }}>
                {station?.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: isMobile ? 13 : undefined }}>
                  <strong>ID:</strong> {station?.id}
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#E2D9D9' }} />
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: isMobile ? 13 : undefined }}>
                  <strong>Status:</strong>
                  <Chip label={station?.current_status ? 'Operacional' : 'Parada'} color={station?.current_status ? 'success' : 'error'} size="small" />
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: isMobile ? 2 : 4 }}>
          {/* Seção de detalhes */}
          <Divider sx={{ mb: 3 }} />
          {station && (
            <>
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : { xs: 'column', sm: 'row' }, gap: isMobile ? 2 : 4, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#BE3124', fontWeight: 700, mb: 0.5, fontSize: isMobile ? 14 : undefined }}>
                    Função
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, color: 'text.primary', fontSize: isMobile ? 15 : undefined }}>
                    {station.description?.funcao || '-'}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: '#BE3124', fontWeight: 700, mb: 0.5, fontSize: isMobile ? 14 : undefined }}>
                    Ferramentas
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, color: 'text.primary', fontSize: isMobile ? 15 : undefined }}>
                    {station.description?.ferramentas || '-'}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#BE3124', fontWeight: 700, mb: 0.5, fontSize: isMobile ? 14 : undefined }}>
                    Observações
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, color: 'text.primary', whiteSpace: 'pre-line', fontSize: isMobile ? 15 : undefined }}>
                    {station.description?.observacoes || '-'}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: '#BE3124', fontWeight: 700, mb: 0.5, fontSize: isMobile ? 14 : undefined }}>
                    Nº de Funcionários
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary', fontSize: isMobile ? 15 : undefined }}>
                    {station.num_employees ?? '-'}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2, borderTop: '1px solid #ccc' }} />
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#BE3124',
                    color: '#fff',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    boxShadow: 'none',
                    width: isMobile ? '100%' : undefined,
                    '&:hover': {
                      backgroundColor: '#A6281D',
                      boxShadow: 'none',
                    },
                  }}
                  onClick={onClose}
                >
                  Fechar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default StationDetailsModal; 