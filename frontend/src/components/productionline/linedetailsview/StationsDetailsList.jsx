import React, { useState } from 'react';
import { Box, Typography, Paper, Divider, Button, Modal, IconButton, TextField, CircularProgress, Chip, Grid, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import stationApi from '../service/stationApi';
import StationInfoModal from './modals/StationInfoModal';
import StationEditModal from './modals/StationEditModal';
import StationChartsView from './StationChartsView';
import StationDeleteModal from './modals/StationDeleteModal';
import { toastSuccess, toastError } from '../../notifications/toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const StationsDetailsList = ({ stations, lineName, lineStatus, onUpdate, onStationUpdate }) => {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  // Campos editáveis
  const [editedName, setEditedName] = useState('');
  const [editedFunction, setEditedFunction] = useState('');
  const [editedTools, setEditedTools] = useState('');
  const [editedObservations, setEditedObservations] = useState('');
  const [editedStatus, setEditedStatus] = useState(false);
  const [editedNumEmployees, setEditedNumEmployees] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stationToDelete, setStationToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const handleOpenInfoModal = (station) => {
    setSelectedStation(station);
    setInfoModalOpen(true);
  };

  const handleOpenEditModal = (station) => {
    setSelectedStation(station);
    setEditedName(station.name || '');
    setEditedFunction(station.description?.funcao || '');
    setEditedTools(station.description?.ferramentas || '');
    setEditedObservations(station.description?.observacoes || '');
    setEditedStatus(station.current_status || false);
    setEditedNumEmployees(station.num_employees?.toString() || '');
    setEditModalOpen(true);
  };

  const handleCloseInfoModal = () => {
    setInfoModalOpen(false);
    setSelectedStation(null);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedStation(null);
  };

  const handleSave = async () => {
    if (!selectedStation) return;
    setLoadingUpdate(true);
    try {
      const updatedData = {
        name: editedName,
        description: {
          funcao: editedFunction,
          ferramentas: editedTools,
          observacoes: editedObservations,
        },
        current_status: editedStatus,
        num_employees: parseInt(editedNumEmployees, 10),
        production_line: parseInt(selectedStation.production_line, 10),
      };
      const updatedStation = await stationApi.updateStation(selectedStation.id, updatedData);
      if (onStationUpdate) onStationUpdate(updatedStation || { ...selectedStation, ...updatedData });
      if (onUpdate) await onUpdate();
      await new Promise(res => setTimeout(res, 1200)); // delay de 1.2s para o loading
      handleCloseEditModal();
      toastSuccess('Estação editada com sucesso!');
    } catch (error) {
      toastError('Erro ao editar estação.');
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDeleteClick = (station) => {
    setStationToDelete(station);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setStationToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!stationToDelete) return;
    setDeleteLoading(true);
    try {
      await stationApi.deleteStation(stationToDelete.id);
      if (onStationUpdate) onStationUpdate({ ...stationToDelete, deleted: true });
      if (onUpdate) await onUpdate();
      setDeleteModalOpen(false);
      toastSuccess('Estação excluída com sucesso!');
    } catch (error) {
      toastError('Erro ao excluir estação.');
    } finally {
      setDeleteLoading(false);
      setStationToDelete(null);
    }
  };

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
    <Paper elevation={6} sx={{
      p: { xs: 1, sm: 4 },
      borderRadius: 4,
      background: '#fff',
      boxShadow: '0 4px 24px 0 rgba(190,49,36,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.04)',
      mb: 4,
      mx: 'auto',
      width: '100%',
      // Removido maxWidth para igualar ao LineDetailsInfo
    }}>
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          mb: 1,
          justifyContent: 'space-between',
          gap: isMobile ? 1.5 : 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EngineeringIcon sx={{ fontSize: isMobile ? 28 : 36, mr: isMobile ? 1 : 1.5, color: '#BE3124' }} />
          <Typography variant={isMobile ? 'h6' : 'h4'} fontWeight={900} color="#BE3124" sx={{ letterSpacing: '-1px', fontSize: isMobile ? 20 : undefined }}>
            Detalhes das Estações
          </Typography>
        </Box>
        {showCharts ? (
          <Button
            variant="outlined"
            onClick={() => setShowCharts(false)}
            startIcon={<VisibilityOutlinedIcon sx={{ fontSize: isMobile ? 18 : 22 }} />}
            sx={{
              borderColor: '#1976d2',
              color: '#1976d2',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontSize: isMobile ? 13 : undefined,
              width: isMobile ? '100%' : 'auto',
              mt: isMobile ? 1 : 0,
              py: isMobile ? 1 : undefined,
              px: isMobile ? 1.5 : 2,
            }}
          >
            Voltar para Detalhes
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={() => setShowCharts(true)}
            startIcon={<BarChartIcon sx={{ fontSize: isMobile ? 18 : 22 }} />}
            sx={{
              borderColor: '#1976d2',
              color: '#1976d2',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontSize: isMobile ? 13 : undefined,
              width: isMobile ? '100%' : 'auto',
              mt: isMobile ? 1 : 0,
              py: isMobile ? 1 : undefined,
              px: isMobile ? 1.5 : 2,
            }}
          >
            Visualizar Graficamente
          </Button>
        )}
      </Box>
      <Divider sx={{ mb: 3, borderBottomWidth: 2 }} />
      {showCharts ? (
        stations.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
            <Typography variant="h6" sx={{ color: '#BE3124', fontWeight: 700, mb: 1, textAlign: 'center' }}>
              Nenhuma estação encontrada.
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', textAlign: 'center' }}>
              Cadastre uma nova estação para começar a monitorar sua linha de produção.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ my: 4 }}>
            <StationChartsView stations={stations} />
          </Box>
        )
      ) : (
        stations.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
            <Typography variant="h6" sx={{ color: '#BE3124', fontWeight: 700, mb: 1, textAlign: 'center' }}>
              Nenhuma estação encontrada.
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', textAlign: 'center' }}>
              Cadastre uma nova estação para começar a monitorar sua linha de produção.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 2 : 3 }}>
            {stations.map((station) => {
              const statusText = station.current_status ? 'Operacional' : 'Parada';
              const statusColor = station.current_status ? '#43A047' : '#D32F2F';
              const statusIcon = station.current_status ? <CheckCircleIcon sx={{ color: '#43A047', fontSize: 20, mr: 0.5 }} /> : <ErrorIcon sx={{ color: '#D32F2F', fontSize: 20, mr: 0.5 }} />;
              return (
                <Paper
                  key={station.id}
                  sx={{
                    p: isMobile ? 2 : 3,
                    borderRadius: 3,
                    boxShadow: 4,
                    borderLeft: `7px solid ${statusColor}`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      boxShadow: 8,
                      background: '#f9f9f9'
                    },
                    background: '#fff',
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  {/* Header: nome, status e botões alinhados */}
                  <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : { xs: 'column', sm: 'row' }, alignItems: isMobile ? 'flex-start' : { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: isMobile ? 1.5 : 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                      <BusinessIcon sx={{ color: '#BE3124', fontSize: isMobile ? 22 : 28, mr: 1 }} />
                      <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={900} sx={{ color: '#222', letterSpacing: '-0.5px', mr: 1, fontSize: isMobile ? 17 : undefined }}>
                        {station.name}
                      </Typography>
                      <Tooltip title={statusText} arrow>
                        <Chip
                          icon={statusIcon}
                          label={statusText}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            color: '#fff',
                            backgroundColor: statusColor,
                            px: 1.5,
                            fontSize: isMobile ? 13 : 15,
                            letterSpacing: 0.5
                          }}
                        />
                      </Tooltip>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'flex-end', gap: 1.5, width: isMobile ? '100%' : { xs: '100%', sm: 'auto' }, mt: isMobile ? 1 : 0 }}>
                      <Button
                        variant="outlined"
                        startIcon={<VisibilityOutlinedIcon />}
                        size={isMobile ? 'small' : 'medium'}
                        onClick={e => { e.stopPropagation(); handleOpenInfoModal(station); }}
                        sx={{
                          borderColor: '#1976d2',
                          color: '#1976d2',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          width: isMobile ? '100%' : undefined,
                          fontSize: isMobile ? 13 : undefined,
                          mb: isMobile ? 1 : 0,
                          '&:hover': {
                            borderColor: '#115293',
                            background: 'rgba(25, 118, 210, 0.04)',
                            color: '#115293',
                          },
                        }}
                      >
                        Detalhes
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<EditOutlinedIcon />}
                        size={isMobile ? 'small' : 'medium'}
                        onClick={e => { e.stopPropagation(); handleOpenEditModal(station); }}
                        sx={{
                          background: '#BE3124',
                          color: '#fff',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          boxShadow: 'none',
                          width: isMobile ? '100%' : undefined,
                          fontSize: isMobile ? 13 : undefined,
                          mb: isMobile ? 1 : 0,
                          '&:hover': {
                            background: '#a72a1e',
                            boxShadow: 'none',
                          },
                        }}
                      >
                        Editar
                      </Button>
                      <Tooltip title="Excluir" arrow>
                        <span>
                          <IconButton
                            onClick={e => { e.stopPropagation(); handleDeleteClick(station); }}
                            sx={{
                              color: '#D32F2F',
                              background: 'rgba(211,47,47,0.08)',
                              borderRadius: 2,
                              ml: 0.5,
                              width: isMobile ? '100%' : undefined,
                              mb: isMobile ? 1 : 0,
                              '&:hover': {
                                background: 'rgba(211,47,47,0.18)',
                                color: '#A6281D',
                              },
                            }}
                            size={isMobile ? 'medium' : 'large'}
                          >
                            <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </Box>
                  {/* Detalhes: Produzidos e Defeitos */}
                  <Grid container spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <Grid item xs={6} sm={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Inventory2OutlinedIcon sx={{ color: '#1976d2', fontSize: isMobile ? 16 : 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2', fontSize: isMobile ? 13 : undefined }}>Produzidos:</Typography>
                      <Typography variant="body2" sx={{ ml: 0.5, fontSize: isMobile ? 13 : undefined }}>{station.produzidos ?? 0}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ReportProblemIcon sx={{ color: '#D32F2F', fontSize: isMobile ? 16 : 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#D32F2F', fontSize: isMobile ? 13 : undefined }}>Defeitos:</Typography>
                      <Typography variant="body2" sx={{ ml: 0.5, fontSize: isMobile ? 13 : undefined }}>{station.defeitos ?? 0}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Box>
        )
      )}
      <StationInfoModal
        open={infoModalOpen}
        onClose={handleCloseInfoModal}
        station={selectedStation}
      />
      <StationEditModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        station={selectedStation}
        editedName={editedName}
        setEditedName={setEditedName}
        editedFunction={editedFunction}
        setEditedFunction={setEditedFunction}
        editedTools={editedTools}
        setEditedTools={setEditedTools}
        editedObservations={editedObservations}
        setEditedObservations={setEditedObservations}
        editedStatus={editedStatus}
        setEditedStatus={setEditedStatus}
        editedNumEmployees={editedNumEmployees}
        setEditedNumEmployees={setEditedNumEmployees}
        loadingUpdate={loadingUpdate}
        handleSave={handleSave}
      />
      <StationDeleteModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        station={stationToDelete}
        loading={deleteLoading}
      />
    </Paper>
  );
};

export default StationsDetailsList; 