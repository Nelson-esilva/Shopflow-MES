import { 
  Box, 
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  TextField,
  IconButton,
  Button,
  InputAdornment,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Devices as DevicesIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { listAllDevices, deleteDevice, createDevice, updateDevice } from '../components/device/deviceService';
import DeleteDeviceDialog from '../components/device/DeleteDeviceDialog';
import EditDeviceDialog from '../components/device/EditDeviceDialog';
import CreateDeviceDialog from '../components/device/CreateDeviceDialog';
import DeviceStatusChip from '../components/device/DeviceStatusChip';
import DeviceTypeChip from '../components/device/DeviceTypeChip';
import ViewDeviceDialog from '../components/device/ViewDeviceDialog';
import DesignerLayout from '../layout/DesignerLayout';

function DevicePage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [successAlert, setSuccessAlert] = useState({ open: false, message: '' });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDeviceView, setSelectedDeviceView] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listAllDevices();
      setDevices(data);
    } catch (err) {
      console.error('Erro na página:', err);
      setError('Erro ao carregar dispositivos: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredDevices = devices.filter(device => {
    const searchLower = searchTerm.toLowerCase();
    const idMatch = device.id.toString().includes(searchLower);
    const nomeMatch = device.nome?.toLowerCase().includes(searchLower) || false;
    return idMatch || nomeMatch;
  });

  const getCurrentPageDevices = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredDevices.slice(startIndex, endIndex);
  };

  const handleDeleteClick = (device) => {
    setSelectedDevice(device);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDevice(selectedDevice.id);
      setDevices(devices.filter(device => device.id !== selectedDevice.id));
      setDeleteDialogOpen(false);
      setSelectedDevice(null);
      setSuccessAlert({ open: true, message: 'Dispositivo excluído com sucesso!' });
    } catch (err) {
      console.error('Erro ao excluir dispositivo:', err);
      setError(err.response?.data?.detail || err.message || 'Erro ao excluir dispositivo');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedDevice(null);
  };

  const handleEditClick = (device) => {
    setSelectedDevice(device);
    setEditDialogOpen(true);
  };

  const handleEditConfirm = async (deviceId, deviceData) => {
    try {
      await updateDevice(deviceId, deviceData);
      await fetchDevices();
      setEditDialogOpen(false);
      setSelectedDevice(null);
      setSuccessAlert({ open: true, message: 'Dispositivo atualizado com sucesso!' });
    } catch (err) {
      throw err;
    }
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateConfirm = async (deviceData) => {
    try {
      await createDevice(deviceData);
      await fetchDevices();
      setCreateDialogOpen(false);
      setSuccessAlert({ open: true, message: 'Dispositivo criado com sucesso!' });
    } catch (err) {
      throw err;
    }
  };

  const handleCloseSuccessAlert = () => {
    setSuccessAlert(prev => ({ ...prev, open: false }));
  };

  const handleViewClick = (device) => {
    setSelectedDeviceView(device);
    setViewDialogOpen(true);
  };

  // Fecha o alerta de sucesso automaticamente após alguns segundos
  useEffect(() => {
    if (successAlert.open) {
      const timer = setTimeout(() => {
        setSuccessAlert({ open: false, message: '' });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successAlert.open]);

  return (
    <>
    <DesignerLayout>
        <Box sx={{ 
          height: 'calc(100vh - 120px)', 
          overflowY: 'auto', 
          pr: 2,
          pb: 8
        }}>            <Paper 
              elevation={3} 
              sx={{ 
                p: 0, // ou ajuste para o padding desejado
                backgroundColor: '#fff',
                borderRadius: 0, // sem borda arredondada para ocupar toda a tela
                boxShadow: 'none', // opcional, para remover sombra
                border: 'none',    // opcional, para remover borda
                mt: 0,
                mx: 0
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                mb: 4,
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 52,
                    height: 52,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(190, 49, 36, 0.08)',
                    color: '#BE3124',
                    boxShadow: '0 2px 8px rgba(190, 49, 36, 0.1)'
                  }}>
                    <DevicesIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h4"
                      component="h1" 
                      sx={{ 
                        color: '#000',
                        fontWeight: 'bold',
                        letterSpacing: '-0.5px',
                        mb: 0.5
                      }}
                    >
                      Dispositivos
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        fontSize: '1rem',
                        fontWeight: 400
                      }}
                    >
                      Gerenciamento de Dispositivos
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateClick}
                  sx={{
                    backgroundColor: '#BE3124',
                    '&:hover': {
                      backgroundColor: '#9C291E'
                    },
                    px: 3,
                    py: 1.2,
                    fontSize: '1rem',
                    fontWeight: 500,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(190, 49, 36, 0.2)'
                  }}
                >
                  Novo Dispositivo
                </Button>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3, fontSize: '1rem' }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Buscar por ID ou nome do dispositivo..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(190, 49, 36, 0.6)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1rem',
                      height: '56px',
                      '& fieldset': {
                        borderColor: 'rgba(190, 49, 36, 0.2)',
                        borderRadius: '8px'
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(190, 49, 36, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#BE3124',
                      },
                    },
                    '& .MuiInputBase-input': {
                      py: 1.5
                    }
                  }}
                />
              </Box>

              {successAlert.open && (
                <Alert 
                  severity="success" 
                  sx={{ mb: 3, fontSize: '1rem' }}
                  onClose={handleCloseSuccessAlert}
                >
                  {successAlert.message}
                </Alert>
              )}

              {filteredDevices.length > 0 ? (
                <>

                  <TableContainer sx={{ 
                    flex: 1,
                    borderRadius: 2,
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    '& .MuiTableCell-root': {
                      fontSize: '1rem',
                      py: 2
                    },
                    '& .MuiTableHead-root .MuiTableCell-root': {
                      fontWeight: 600,
                      color: '#333',
                      backgroundColor: 'rgba(190, 49, 36, 0.03)'
                    }
                  }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                        <TableCell sx={{ 
                        backgroundColor: 'rgba(190, 49, 36, 0.05)',
                        fontWeight: 'bold',
                        color: '#000',
                        borderBottom: '2px solid #E2D9D9',
                        width: '20px'
                      }}>ID</TableCell>
                      <TableCell sx={{ 
                        backgroundColor: 'rgba(190, 49, 36, 0.05)',
                        fontWeight: 'bold',
                        color: '#000',
                        borderBottom: '2px solid #E2D9D9',
                        width: '10px'
                      }}>Nome</TableCell>
                      <TableCell sx={{ 
                        backgroundColor: 'rgba(190, 49, 36, 0.05)',
                        fontWeight: 'bold',
                        color: '#000',
                        borderBottom: '2px solid #E2D9D9',
                        width: '50%'
                      }}>Descrição</TableCell>
                      <TableCell sx={{ 
                        backgroundColor: 'rgba(190, 49, 36, 0.05)',
                        fontWeight: 'bold',
                        color: '#000',
                        borderBottom: '2px solid #E2D9D9',
                        width: '10%'
                      }}>Tipo</TableCell>
                     <TableCell sx={{ 
                        backgroundColor: 'rgba(190, 49, 36, 0.05)',
                        fontWeight: 'bold',
                        color: '#000',
                        borderBottom: '2px solid #E2D9D9',
                        width: '10%'
                      }}>Estado</TableCell>
                    <TableCell align="center" sx={{ 
                        backgroundColor: 'rgba(190, 49, 36, 0.05)',
                        fontWeight: 'bold',
                        color: '#000',
                        borderBottom: '2px solid #E2D9D9',
                        width: '10%'
                      }}>Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getCurrentPageDevices().map((device) => (
                          <TableRow 
                            key={device.id}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(190, 49, 36, 0.02)'
                              }
                            }}
                          >
                            <TableCell>{device.id}</TableCell>
                            <TableCell>{device.nome || '-'}</TableCell>
                            <TableCell sx={{ 
                              maxWidth: '450px',
                              textAlign: 'justify',
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                              lineHeight: 1.5,
                              py: 2,
                              px: 3
                            }}>
                              {device.descricao}
                            </TableCell>
                            <TableCell>
                              <DeviceTypeChip type={device.tipo} />
                            </TableCell>
                            <TableCell>
                              <DeviceStatusChip status={device.estado} />
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Editar">
                                <IconButton
                                  onClick={() => handleEditClick(device)}
                                  sx={{ 
                                    color: '#000', // muda a cor do icone lápis
                                    '&:hover': {
                                      backgroundColor: 'rgba(77, 57, 55, 0.08)'
                                    }
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir">
                                <IconButton
                                  onClick={() => handleDeleteClick(device)}
                                  sx={{ 
                                    color: '#BE3124', // muda a cor do icone lixeira
                                    '&:hover': {
                                      backgroundColor: 'rgba(190, 49, 36, 0.08)'
                                    }
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Visualizar">
                                <IconButton
                                  onClick={() => handleViewClick(device)}
                                  sx={{ 
                                    color: '#1976d2', // muda a cor do icone olho
                                    '&:hover': {
                                      backgroundColor: 'rgba(25, 118, 210, 0.1)'
                                    }
                                  }}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {!loading && filteredDevices.length > 0 && (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 2,
                      px: 2,
                      py: 1,
                      borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        {Math.min((page + 1) * rowsPerPage, filteredDevices.length)} de {filteredDevices.length}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          onClick={() => setPage(page - 1)}
                          disabled={page === 0}
                          sx={{ 
                            color: page === 0 ? 'text.disabled' : '#BE3124',
                            '&:hover': {
                              backgroundColor: page === 0 ? 'transparent' : 'rgba(190, 49, 36, 0.1)'
                            }
                          }}
                        >
                          <KeyboardArrowLeftIcon />
                        </IconButton>
                        <Typography variant="body2" sx={{ mx: 1 }}>
                          Página {page + 1} de {Math.ceil(filteredDevices.length / rowsPerPage)}
                        </Typography>
                        <IconButton
                          onClick={() => setPage(page + 1)}
                          disabled={page >= Math.ceil(filteredDevices.length / rowsPerPage) - 1}
                          sx={{ 
                            color: page >= Math.ceil(filteredDevices.length / rowsPerPage) - 1 ? 'text.disabled' : '#BE3124',
                            '&:hover': {
                              backgroundColor: page >= Math.ceil(filteredDevices.length / rowsPerPage) - 1 ? 'transparent' : 'rgba(190, 49, 36, 0.1)'
                            }
                          }}
                        >
                          <KeyboardArrowRightIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  minHeight: '200px',
                  flex: 1
                }}>
                  <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    Nenhum dispositivo encontrado
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </DesignerLayout>


      {/* Diálogos */}
      <DeleteDeviceDialog
        open={deleteDialogOpen}
        device={selectedDevice}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <EditDeviceDialog
        open={editDialogOpen}
        device={selectedDevice}
        onConfirm={handleEditConfirm}
        onCancel={() => {
          setEditDialogOpen(false);
          setSelectedDevice(null);
        }}
      />

      <CreateDeviceDialog
        open={createDialogOpen}
        onConfirm={handleCreateConfirm}
        onCancel={() => setCreateDialogOpen(false)}
      />

      <ViewDeviceDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        device={selectedDeviceView}
      />
    </>
  );
}

export default DevicePage; 