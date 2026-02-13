import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  // Snackbar, // Removido
  // Alert, // Removido
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Factory as FactoryIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import lineApi from './service/lineApi';
import stationApi from './service/stationApi';
import LineDetailsInfo from './linedetailsview/LineDetailsInfo';
import StationChartsView from './linedetailsview/StationChartsView';
import StationsDetailsList from './linedetailsview/StationsDetailsList';

/**
 * LineDetailScreen exibe informações detalhadas de uma única linha de produção
 * e suas estações, obtendo os dados do backend e exibindo gráficos por estação.
 *
 * @param {object} props - As propriedades do componente.
 * @param {number} props.selectedLineId - O ID da linha de produção a ser detalhada.
 * @param {number} props.refreshTrigger - Um valor que, quando alterado, força a atualização dos dados.
 * @param {function} props.onAddStationClick - Função para abrir o modal de nova estação.
 * @param {function} props.onBackClick - Função para voltar para a lista de linhas.
 */
function LineDetailScreen({ selectedLineId, refreshTrigger, onAddStationClick, onBackClick }) {
  const [line, setLine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stationOperationalCount, setStationOperationalCount] = useState(0);
  const [stationMaintenanceCount, setStationMaintenanceCount] = useState(0);
  const [stationStoppedCount, setStationStoppedCount] = useState(0);
  const [stationPieChartData, setStationPieChartData] = useState([]);

  const [stationTotalProduced, setStationTotalProduced] = useState(0);
  const [stationTotalDefects, setStationTotalDefects] = useState(0);
  const [stationProductionDefectsData, setStationProductionDefectsData] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedStationForModal, setSelectedStationForModal] = useState(null);

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [stationToDelete, setStationToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false); // Novo estado para o loading da exclusão

  const [stations, setStations] = useState([]);

  const STATION_STATUS_COLORS = {
    'Operacional': '#4CAF50',
    'Parada': '#F44336',
    'Em Manutenção': '#FFC107',
    'Desconhecido': '#9E9E9E'
  };

  const STATION_PROD_DEF_COLORS = {
    'Produzidos': '#1976d2',
    'Defeitos': '#D32F2F'
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpenModal = (station) => {
    setSelectedStationForModal(station);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStationForModal(null);
  };

  const handleOnDeleteClick = (stationId) => {
    const station = line?.stations?.find(s => s.id === stationId);
    if (station) {
      setStationToDelete(station);
      setOpenConfirmDeleteDialog(true);
    }
  };

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
    setStationToDelete(null);
  };

  const handleDeleteStationConfirmed = async () => {
    if (!stationToDelete) return;

    setDeleteLoading(true); // Ativa o loading
    try {
      await stationApi.deleteStation(stationToDelete.id);
      handleCloseModal(); // Fecha o modal de detalhes da estação, se estiver aberto
      handleCloseConfirmDeleteDialog(); // Fecha o diálogo de confirmação
      await fetchLineDetailsData(); // Recarrega os dados da linha
    } catch (error) {
      console.error('Erro ao deletar estação:', error);
      const backendErrorMessage = error.response?.data ?
        (typeof error.response.data === 'object' ? JSON.stringify(error.response.data) : error.response.data) :
        error.message || 'Erro desconhecido';
      // handleOpenFeedbackDialog('error', `Erro ao deletar estação: ${backendErrorMessage}`); // Removido
    } finally {
      setDeleteLoading(false); // Desativa o loading
      setStationToDelete(null);
    }
  };

  const fetchLineDetailsData = async () => {
    setLoading(true);
    setError(null);
    setLine(null);

    setStationOperationalCount(0);
    setStationMaintenanceCount(0);
    setStationStoppedCount(0);
    setStationPieChartData([]);
    setStationTotalProduced(0);
    setStationTotalDefects(0);
    setStationProductionDefectsData([]);

    if (!selectedLineId) {
      setLoading(false);
      setError("ID da linha não fornecido. Selecione uma linha para ver os detalhes.");
      return;
    }

    try {
      const data = await lineApi.getLineById(selectedLineId);
      const formattedStations = Array.isArray(data.stations) ? data.stations.map(station => ({
        ...station,
        produzidos: station.produced_items || Math.floor(Math.random() * 500) + 50,
        defeitos: station.defects || Math.floor(Math.random() * 20),
        displayStatus: station.current_status ? 'Operacional' : 'Parada',
        current_status: !!station.current_status
      })) : [];
      setStations(formattedStations);
      const formattedLine = {
        id: data.id,
        name: data.name,
        status: data.status === 'active' ? 'Operacional' :
                data.status === 'maintenance' ? 'Em Manutenção' :
                data.status === 'inactive' ? 'Parada' :
                data.status,
        localizacao: data.location,
        quantidadeDeEstacoes: data.stations_count,
        stations: formattedStations
      };
      setLine(formattedLine);

      if (formattedStations.length > 0) {
        const opCount = formattedStations.filter(s => s.displayStatus === 'Operacional').length;
        const stopCount = formattedStations.filter(s => s.displayStatus === 'Parada').length;
        const maintCount = formattedStations.filter(s => s.displayStatus === 'Em Manutenção').length;

        setStationOperationalCount(opCount);
        setStationStoppedCount(stopCount);
        setStationMaintenanceCount(maintCount);

        const pieData = [];
        if (opCount > 0) pieData.push({ name: 'Operacional', value: opCount });
        if (stopCount > 0) pieData.push({ name: 'Parada', value: stopCount });
        if (maintCount > 0) pieData.push({ name: 'Em Manutenção', value: maintCount });
        setStationPieChartData(pieData);

        const producedSum = formattedStations.reduce((sum, s) => sum + s.produzidos, 0);
        const defectsSum = formattedStations.reduce((sum, s) => sum + s.defeitos, 0);
        setStationTotalProduced(producedSum);
        setStationTotalDefects(defectsSum);

        setStationProductionDefectsData([
          { name: 'Produzidos', value: producedSum, color: STATION_PROD_DEF_COLORS['Produzidos'] },
          { name: 'Defeitos', value: defectsSum, color: STATION_PROD_DEF_COLORS['Defeitos'] }
        ]);
      } else {
        setStationPieChartData([]);
        setStationProductionDefectsData([]);
      }

    } catch (err) {
      console.error(`Erro ao carregar detalhes da linha ${selectedLineId}:`, err);
      let errorMessage = "Não foi possível carregar os detalhes da linha.";
      if (err.response) {
          errorMessage = `Erro do servidor: ${err.response.status} - ${err.response.data?.detail || err.response.data?.message || 'Detalhes desconhecidos.'}`;
          if (err.response.status === 404) {
            errorMessage = `Linha com ID ${selectedLineId} não encontrada.`;
          }
      } else if (err.request) {
          errorMessage = "Erro de conexão: Nenhuma resposta do servidor. Verifique se o backend está ativo.";
      } else {
          errorMessage = `Erro na requisição: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLineDetailsData();
  }, [selectedLineId, refreshTrigger]);

  if (loading) {
    return (
      <Paper sx={{ p: 3, mt: 3, borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress sx={{ mr: 2 }} />
        <Typography>Carregando detalhes da linha...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Paper>
    );
  }

  if (!selectedLineId || !line) {
    return (
      <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }}>
        <Typography variant="h6" color="text.secondary">
          Linha não encontrada ou ID não fornecido. Por favor, volte para a lista de linhas.
        </Typography>
      </Paper>
    );
  }

  const handleStationUpdate = (updatedStation) => {
    setStations(prev =>
      prev.map(station =>
        station.id === updatedStation.id ? { ...station, ...updatedStation } : station
      )
    );
    setLine(prevLine => ({
      ...prevLine,
      stations: prevLine.stations.map(station =>
        station.id === updatedStation.id ? { ...station, ...updatedStation } : station
      )
    }));
  };

  return (
    <Box>
      {/* Cabeçalho responsivo */}
      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        mb: 3,
        px: isMobile ? 1 : 2,
        py: isMobile ? 1.2 : 2,
        borderRadius: 3,
        background: '#222',
        boxShadow: '0 2px 12px 0 rgba(190,49,36,0.10)',
        mx: 'auto',
        gap: isMobile ? 2 : 0
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: isMobile ? 1 : 2, mb: isMobile ? 2 : 0 }}>
          {/* Seta de voltar igual à da DailyProductionView */}
          <IconButton onClick={onBackClick} sx={{
            mr: isMobile ? 1 : 2,
            width: isMobile ? 40 : 54,
            height: isMobile ? 40 : 54,
            background: '#fff',
            color: '#BE3124',
            border: '2px solid #fff',
            boxShadow: '0 2px 8px rgba(190,49,36,0.10)',
            '&:hover': { background: '#222', color: '#BE3124' }
          }}>
            <ArrowBackIcon sx={{ fontSize: isMobile ? 24 : 32 }} />
          </IconButton>
          <FactoryIcon sx={{ color: '#BE3124', fontSize: isMobile ? 36 : 64, mt: isMobile ? 0 : 0.5 }} />
          <Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontSize: isMobile ? 22 : 35, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>
              {line.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#fff', opacity: 0.85, fontWeight: 400, fontSize: isMobile ? 13 : 16, mt: 0.5 }}>
              Detalhes da linha de produção e estações
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddStationClick}
          sx={{
            backgroundColor: '#BE3124',
            fontWeight: 700,
            fontSize: isMobile ? '0.95rem' : '1rem',
            px: isMobile ? 2 : 3,
            py: isMobile ? 0.8 : 1.2,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(190,49,36,0.10)',
            width: isMobile ? '100%' : 'auto',
            mt: isMobile ? 1 : 0,
            '&:hover': {
              backgroundColor: '#8B1E1E'
            }
          }}
          fullWidth={isMobile}
        >
          Nova Estação
        </Button>
      </Box>
      <LineDetailsInfo line={line} />
      <StationsDetailsList
        stations={stations}
        lineName={line.name}
        lineStatus={line.status}
        onStationUpdate={handleStationUpdate}
        onUpdate={fetchLineDetailsData}
      />
      <Divider sx={{ my: 3, borderBottomWidth: 3 }} />

      {/* --- Diálogo de Confirmação de Exclusão com novo Design --- */}
      <Dialog
        open={openConfirmDeleteDialog}
        onClose={handleCloseConfirmDeleteDialog}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '10px'
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: '#FFF5F5',
          borderBottom: '1px solid #E2D9D9',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DeleteIcon sx={{ color: '#000' }} />
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            Você tem certeza que deseja deletar a estação "<strong>{stationToDelete?.name || ''}</strong>" (ID: {stationToDelete?.id})?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmDeleteDialog}
            disabled={deleteLoading} // Desabilita enquanto carrega
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteStationConfirmed}
            color="error"
            disabled={deleteLoading} // Desabilita enquanto carrega
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null} // Ícone de carregamento
          >
            {deleteLoading ? 'Deletando...' : 'Deletar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LineDetailScreen;