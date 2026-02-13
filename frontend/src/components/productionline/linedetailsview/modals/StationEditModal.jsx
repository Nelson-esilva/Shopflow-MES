import React from 'react';
import { Box, Typography, Divider, Button, Modal, IconButton, TextField, CircularProgress, FormControlLabel, Switch, useTheme, useMediaQuery } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

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

const StationEditModal = ({
  open,
  onClose,
  station,
  editedName,
  setEditedName,
  editedFunction,
  setEditedFunction,
  editedTools,
  setEditedTools,
  editedObservations,
  setEditedObservations,
  editedStatus,
  setEditedStatus,
  editedNumEmployees,
  setEditedNumEmployees,
  loadingUpdate,
  handleSave
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
      aria-labelledby="station-edit-modal-title"
      aria-describedby="station-edit-modal-description"
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
        <Box
          id="station-edit-modal-title"
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
          <Typography variant={isMobile ? 'h6' : 'h5'} component="h2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', fontSize: isMobile ? 20 : undefined }}>
            <BusinessIcon sx={{ mr: 1, color: '#BE3124', fontSize: isMobile ? 24 : undefined }} />
            Editar Estação: {station?.name}
          </Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: isMobile ? 2 : 4 }}>
          <Divider sx={{ mb: 2 }} />
          {station && (
            <>
              <TextField
                fullWidth
                label="Nome da Estação"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                sx={commonInputSx}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Função"
                value={editedFunction}
                onChange={(e) => setEditedFunction(e.target.value)}
                sx={commonInputSx}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Ferramentas"
                value={editedTools}
                onChange={(e) => setEditedTools(e.target.value)}
                sx={commonInputSx}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Observações"
                value={editedObservations}
                onChange={(e) => setEditedObservations(e.target.value)}
                sx={commonInputSx}
                margin="dense"
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Nº de Funcionários"
                value={editedNumEmployees}
                onChange={e => {
                  const value = e.target.value;
                  setEditedNumEmployees(value);
                }}
                sx={commonInputSx}
                margin="dense"
                type="number"
                inputProps={{ min: 0 }}
              />
              {editedNumEmployees !== '' && Number(editedNumEmployees) < 0 && (
                <Typography variant="caption" sx={{ color: '#BE3124', ml: 0.5, mb: 1 }}>
                  Apenas números positivos são permitidos.
                </Typography>
              )}
              <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Switch
                  checked={editedStatus}
                  onChange={e => setEditedStatus(e.target.checked)}
                  color="primary"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#BE3124',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#BE3124',
                    },
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 700, color: editedStatus ? '#43A047' : '#D32F2F' }}>
                  {editedStatus ? 'Estação Ativa' : 'Estação Desativada'}
                </Typography>
              </Box>
              <Divider sx={{ my: 3, borderTop: '1px solid #ccc' }} />
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  onClick={onClose}
                  disabled={loadingUpdate}
                  sx={{
                    color: '#666',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    width: isMobile ? '100%' : undefined,
                    mb: isMobile ? 1 : 0,
                    '&:hover': {
                      backgroundColor: '#F5F5F5'
                    }
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  startIcon={loadingUpdate ? <CircularProgress size={20} /> : <SaveIcon />}
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
                    }
                  }}
                  disabled={loadingUpdate}
                >
                  {loadingUpdate ? 'Salvando...' : 'Salvar'}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default StationEditModal; 