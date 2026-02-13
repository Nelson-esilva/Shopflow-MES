import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, Button, Modal, IconButton, TextField, CircularProgress, Switch, useTheme, useMediaQuery } from '@mui/material';
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

const StationCreateModal = ({
  open,
  onClose,
  onCreate,
  loadingCreate,
  selectedLineId
}) => {
  // Estados locais para os campos do formulário
  const [name, setName] = useState('');
  const [funcao, setFuncao] = useState('');
  const [ferramentas, setFerramentas] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [currentStatus, setCurrentStatus] = useState(true);
  const [numEmployees, setNumEmployees] = useState('');
  const [errorNumEmployees, setErrorNumEmployees] = useState(false);

  useEffect(() => {
    if (open) {
      setName('');
      setFuncao('');
      setFerramentas('');
      setObservacoes('');
      setCurrentStatus(true);
      setNumEmployees('');
      setErrorNumEmployees(false);
    }
  }, [open]);

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

  const handleNumEmployeesChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // Apenas dígitos
    // Remove zeros à esquerda
    value = value.replace(/^0+(?!$)/, '');
    setNumEmployees(value);
    if (value === '' || Number(value) < 0) {
      setErrorNumEmployees(true);
    } else {
      setErrorNumEmployees(false);
    }
  };

  const handleSave = () => {
    if (!name.trim() || numEmployees === '' || Number(numEmployees) < 0) {
      setErrorNumEmployees(true);
      return;
    }
    setErrorNumEmployees(false);
    const data = {
      production_line: selectedLineId,
      name,
      description: {
        funcao,
        ferramentas,
        observacoes
      },
      current_status: currentStatus,
      num_employees: parseInt(numEmployees, 10)
    };
    onCreate(data);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="station-create-modal-title"
      aria-describedby="station-create-modal-description"
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
          id="station-create-modal-title"
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
            Nova Estação
          </Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: isMobile ? 2 : 4 }}>
          <Divider sx={{ mb: 2 }} />
          <TextField
            fullWidth
            label="Nome da Estação"
            value={name}
            onChange={e => setName(e.target.value)}
            sx={commonInputSx}
            margin="dense"
            required
          />
          <TextField
            fullWidth
            label="Função"
            value={funcao}
            onChange={e => setFuncao(e.target.value)}
            sx={commonInputSx}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Ferramentas"
            value={ferramentas}
            onChange={e => setFerramentas(e.target.value)}
            sx={commonInputSx}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Observações"
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)}
            sx={commonInputSx}
            margin="dense"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Nº de Funcionários"
            value={numEmployees}
            onChange={handleNumEmployeesChange}
            sx={commonInputSx}
            margin="dense"
            type="number"
            inputProps={{ min: 0 }}
            required
            error={errorNumEmployees}
          />
          {errorNumEmployees && (
            <Typography variant="caption" sx={{ color: '#BE3124', ml: 0.5, mb: 1 }}>
              Apenas números positivos são permitidos.
            </Typography>
          )}
          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Switch
              checked={currentStatus}
              onChange={e => setCurrentStatus(e.target.checked)}
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
            <Typography variant="body2" sx={{ fontWeight: 700, color: currentStatus ? '#43A047' : '#D32F2F' }}>
              {currentStatus ? 'Estação Ativa' : 'Estação Desativada'}
            </Typography>
          </Box>
          <Divider sx={{ my: 3, borderTop: '1px solid #ccc' }} />
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              onClick={onClose}
              disabled={loadingCreate}
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
              startIcon={loadingCreate ? <CircularProgress size={20} /> : <SaveIcon />}
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
              disabled={loadingCreate}
            >
              {loadingCreate ? 'Salvando...' : 'Salvar'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default StationCreateModal; 