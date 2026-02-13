import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Importa componentes locais
import InformationProductionAllLine from '../components/productionline/InformationProductionAllLine';
import LineDetailScreen from '../components/productionline/LineDetailScreen';
import PageHeader from '../components/productionline/PageHeader';
import NewItemModal from '../components/productionline/modals/NewItemModal';
import StationCreateModal from '../components/productionline/linedetailsview/modals/StationCreateModal';

// Importa os serviços
import lineApi from '../components/productionline/service/lineApi';
import stationApi from '../components/productionline/service/stationApi';

// Importa outros componentes do painel
import DesignerLayout from '../layout/DesignerLayout';

function WorkstationPage2() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();
  const location = useLocation();

  const getLineIdFromUrl = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('lineId');
    return id ? parseInt(id, 10) : 0;
  }, [location.search]);

  const [selectedLineId, setSelectedLineId] = useState(getLineIdFromUrl());
  const [currentLineName, setCurrentLineName] = useState('Produção');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatingNewLine, setCreatingNewLine] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  // NOVO ESTADO: Termo de busca para a linha
  const [searchQuery, setSearchQuery] = useState('');
  // Estado para armazenar a linha encontrada pela busca
  const [searchedLine, setSearchedLine] = useState(null);
  // Estado para controle de loading na busca
  const [searchLoading, setSearchLoading] = useState(false);

  // Estados para o diálogo de feedback geral
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackDialogMessage, setFeedbackDialogMessage] = useState('');
  const [feedbackDialogSeverity, setFeedbackDialogSeverity] = useState('success');

  // Estados para o diálogo de confirmação de exclusão de linha
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [lineToDelete, setLineToDelete] = useState(null);
  const [deleteLineLoading, setDeleteLineLoading] = useState(false);

  // Triggers para recarregar dados
  const [refreshAllLines, setRefreshAllLines] = useState(0);
  const [refreshLineDetails, setRefreshLineDetails] = useState(0);

  // Efeito para definir o nome da linha como "Produção" quando nenhuma linha é selecionada
  useEffect(() => {
    if (selectedLineId === 0 && !searchedLine) { // Adicionado !searchedLine
      setCurrentLineName('Produção');
    }
  }, [selectedLineId, searchedLine]);

  // NOVO: Efeito para lidar com a busca
  useEffect(() => {
    const fetchSearchedLine = async () => {
      if (searchQuery.trim() === '') {
        setSearchedLine(null); // Limpa a linha buscada se a query estiver vazia
        // Se a busca é limpa, e não há lineId na URL, volta para a visão geral.
        // Se houver lineId na URL (ex: usuário navegou para uma linha e depois tentou buscar algo),
        // mantemos a linha da URL.
        if (selectedLineId === 0) {
          setCurrentLineName('Produção');
        }
        return;
      }

      const idToSearch = parseInt(searchQuery, 10);
      if (isNaN(idToSearch) || idToSearch <= 0) {
        setSearchedLine(null);
        handleOpenFeedbackDialog('info', 'Por favor, digite um ID de linha válido (número positivo).');
        return;
      }

      setSearchLoading(true);
      setSearchedLine(null); // Limpa a linha anterior da busca
      setCurrentLineName('Buscando...'); // Feedback visual durante a busca

      try {
        const line = await lineApi.getLineById(idToSearch);
        setSearchedLine(line);
        setCurrentLineName(line.name);
        setSelectedLineId(line.id); // Define a linha encontrada como a linha selecionada
        navigate(`${location.pathname}?lineId=${line.id}`, { replace: true }); // Atualiza a URL
      } catch (error) {
        console.error('Erro ao buscar linha:', error);
        setSearchedLine(null);
        setSelectedLineId(0); // Garante que nenhum ID esteja selecionado
        setCurrentLineName('Produção'); // Volta ao título padrão
        navigate(location.pathname, { replace: true }); // Limpa o parâmetro lineId da URL
        const errorMessage = error.response?.data?.detail || error.message || 'Erro desconhecido ao buscar linha.';
        handleOpenFeedbackDialog('error', `Linha com ID "${searchQuery}" não encontrada. Erro: ${errorMessage}`);
      } finally {
        setSearchLoading(false);
      }
    };

    // Pequeno debounce para evitar muitas requisições enquanto o usuário digita
    const handler = setTimeout(() => {
      fetchSearchedLine();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]); // Dependência: searchQuery

  const handleLineSelection = (lineId, lineName) => {
    console.log(`Linha ${lineId} selecionada`);
    setSelectedLineId(lineId);
    if (lineName) {
      setCurrentLineName(lineName);
    }
    // Ao selecionar uma linha pela lista, limpa o termo de busca para evitar conflitos
    setSearchQuery('');
    setSearchedLine(null); // Garante que a linha buscada seja resetada
    if (lineId === 0) {
      navigate(location.pathname, { replace: true });
    } else {
      navigate(`${location.pathname}?lineId=${lineId}`, { replace: true });
    }
  };

  const handleCreateClick = () => {
    setCreatingNewLine(selectedLineId === 0);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenFeedbackDialog = useCallback((severity, message) => {
    setFeedbackDialogSeverity(severity);
    setFeedbackDialogMessage(message);
    setFeedbackDialogOpen(true);
    // Só refresca all lines se não for uma busca que encontrou uma linha
    if (severity === 'success' && searchQuery === '') { // Refresca lista geral apenas se não for busca
      setRefreshAllLines(prev => prev + 1);
    }
  }, [searchQuery]); // Dependência: searchQuery

  const handleCloseFeedbackDialog = () => {
    setFeedbackDialogOpen(false);
    setFeedbackDialogMessage('');
  };

  const handleCreateNewItem = async (itemData) => {
    setIsLoadingModal(true);
    try {
      if (creatingNewLine) {
        console.log('Dados enviados para criar linha:', itemData);
        const newLine = await lineApi.createLine(itemData);
        console.log('Nova linha criada:', newLine);
        handleOpenFeedbackDialog('success', `Linha "${newLine.name}" criada com sucesso!`);
      } else {
        // Lógica para criar uma NOVA ESTAÇÃO
        console.log('Dados enviados para criar estação:', itemData);
        const newStation = await stationApi.createStation({ ...itemData, lineId: selectedLineId });
        console.log('Nova estação criada:', newStation);
        handleOpenFeedbackDialog('success', `Estação "${newStation.name}" criada com sucesso na linha "${currentLineName}"!`);
        setRefreshLineDetails(prev => prev + 1); // Força o recarregamento dos detalhes da linha
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar item:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Erro desconhecido ao criar item.';
      handleOpenFeedbackDialog('error', `Erro: ${errorMessage}`);
    } finally {
      setIsLoadingModal(false);
    }
  };

  const handleRequestDeleteLine = useCallback((line) => {
    setLineToDelete(line);
    setConfirmDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = async () => {
    if (!lineToDelete) return;

    setDeleteLineLoading(true);
    try {
      await lineApi.deleteLine(lineToDelete.id);
      handleOpenFeedbackDialog('success', `Linha "${lineToDelete.name}" deletada com sucesso!`);
      if (selectedLineId === lineToDelete.id) {
        handleLineSelection(0, 'Produção');
      }
      setLineToDelete(null);
      setConfirmDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao deletar linha:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Erro desconhecido ao deletar linha.';
      handleOpenFeedbackDialog('error', `Erro ao deletar linha: ${errorMessage}`);
    } finally {
      setDeleteLineLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteDialogOpen(false);
    setLineToDelete(null);
  };

  const headerButtonLabel = selectedLineId === 0 ? 'Nova Linha' : 'Nova Estação';

  // Determine qual ID de linha usar para exibir os detalhes:
  // Se houver uma linha buscada, use o ID dela.
  // Caso contrário, use o selectedLineId (da navegação normal ou URL).
  const lineIdToDisplay = searchedLine ? searchedLine.id : selectedLineId;
  const lineNameToDisplay = searchedLine ? searchedLine.name : currentLineName;

  return (
    <>
      <DesignerLayout>
        <Box sx={{ p: 3}}>
          {/* Só mostra o cabeçalho e a barra de pesquisa na visão geral */}
          {lineIdToDisplay === 0 && (
            <>
              <PageHeader
                title={lineNameToDisplay}
                subtitle={"Visão geral de produção."}
                onAddClick={handleCreateClick}
                buttonLabel={headerButtonLabel}
              />
            </>
          )}

          {/* Condicional para exibir a lista de linhas ou os detalhes da linha */}
          {lineIdToDisplay === 0 ? (
            <InformationProductionAllLine
              selectedLineId={selectedLineId}
              onLineClick={handleLineSelection}
              refreshTrigger={refreshAllLines}
              onActionComplete={handleOpenFeedbackDialog}
              onDeleteLineRequest={handleRequestDeleteLine}
            />
          ) : (
            <LineDetailScreen
              selectedLineId={lineIdToDisplay} // Passa o ID da linha a ser exibida
              refreshTrigger={refreshLineDetails}
              onAddStationClick={handleCreateClick}
              onBackClick={() => {
                handleLineSelection(0, 'Produção');
                setSearchQuery('');
                setSearchedLine(null);
              }}
            />
          )}
        </Box>
      </DesignerLayout>

      {/* Modais e Diálogos existentes (sem alterações aqui) */}
      <NewItemModal
        open={isModalOpen && creatingNewLine}
        onClose={handleCloseModal}
        isNewLine={true}
        onCreateSubmit={handleCreateNewItem}
        loading={isLoadingModal}
        selectedLineId={selectedLineId}
      />
      <StationCreateModal
        open={isModalOpen && !creatingNewLine}
        onClose={handleCloseModal}
        onCreate={handleCreateNewItem}
        loadingCreate={isLoadingModal}
        selectedLineId={selectedLineId}
      />

      <Dialog
        open={feedbackDialogOpen}
        onClose={handleCloseFeedbackDialog}
        aria-labelledby="feedback-dialog-title"
        aria-describedby="feedback-dialog-description"
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: '10px' } }}
      >
        <DialogTitle
          id="feedback-dialog-title"
          sx={{
            backgroundColor: feedbackDialogSeverity === 'success' ? '#4CAF50' : feedbackDialogSeverity === 'error' ? '#D32F2F' : '#1976d2',
            color: 'white',
            fontWeight: 'bold',
            px: 3, py: 2
          }}
        >
          {feedbackDialogSeverity === 'success' && 'Sucesso!'}
          {feedbackDialogSeverity === 'error' && 'Erro!'}
          {feedbackDialogSeverity === 'info' && 'Informação'}
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Typography id="feedback-dialog-description" variant="body1" sx={{ color: 'text.primary' }}>
            {feedbackDialogMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button
            onClick={handleCloseFeedbackDialog}
            sx={{
              color: '#BE3124',
              '&:hover': {
                backgroundColor: 'rgba(190, 49, 36, 0.08)'
              }
            }}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-delete-dialog-title"
        aria-describedby="confirm-delete-dialog-description"
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: '10px' } }}
      >
        <DialogTitle
          id="confirm-delete-dialog-title"
          sx={{
            backgroundColor: '#FFF5F5',
            borderBottom: '1px solid #E2D9D9',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <DeleteIcon sx={{ color: '#000' }} />
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Typography id="confirm-delete-dialog-description" variant="body1" sx={{ color: 'text.primary' }}>
            Tem certeza de que deseja deletar a linha "<strong>{lineToDelete?.name}</strong>"? Esta ação é irreversível e removerá todas as estações e dados associados a esta linha.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button
            onClick={handleCancelDelete}
            disabled={deleteLineLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={deleteLineLoading}
            startIcon={deleteLineLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLineLoading ? 'Deletando...' : 'Deletar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default WorkstationPage2;