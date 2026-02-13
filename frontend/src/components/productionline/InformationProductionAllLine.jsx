import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip, // Import the Chip component
  useTheme,
  useMediaQuery,
  FormControl, // Import FormControl
  InputLabel, // Import InputLabel
  Select, // Import Select
  MenuItem, // Import MenuItem
  Button // Import Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import BuildIcon from '@mui/icons-material/Build';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LineFilterDialog from './modals/LineFilterDialog';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import lineApi from '../../components/productionline/service/lineApi';
import EditLineModal from '../../components/productionline/modals/EditLineModal';
import LineSearchBar from './search/LineSearchBar';
import LineStatusChart from './charts/LineStatusChart';
import ProductionVsDefectsChart from './charts/ProductionVsDefectsChart';
import LinePagination from './pagination/LinePagination';
import DeleteLineDialog from './modals/DeleteLineDialog';
import { toastSuccess, toastError } from '../notifications/toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Adicione refreshTrigger, onActionComplete e onDeleteLineRequest como props
function InformationProductionAllLine({ selectedLineId, onLineClick, refreshTrigger, onActionComplete, onDeleteLineRequest }) {
  // --- Estado do Componente ---
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalProduced, setTotalProduced] = useState(0);
  const [totalDefects, setTotalDefects] = useState(0);

  const [operationalCount, setOperationalCount] = useState(0);
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [stoppedCount, setStoppedCount] = useState(0);

  // Estados para o modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [lineToEdit, setLineToEdit] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('-id');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filters, setFilters] = useState({ status: [], name: '', location: '' });

  const [totalCount, setTotalCount] = useState(0); // Novo estado para total de itens
  const [searchTrigger, setSearchTrigger] = useState(0); // Força atualização ao clicar na lupa

  // Adicione estado para controlar o modal de exclusão de linha
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lineToDelete, setLineToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estados para paginação
  const [page, setPage] = useState(0); // começa em 0 para TablePagination
  const [pageSize, setPageSize] = useState(10);

  // --- Efeito de Busca de Dados ---
  const fetchLines = async () => {
    setLoading(true);
    setError(null);
    try {
      // Monta os parâmetros para a API
      const params = {
        ordering,
        status: filters.status.length > 0 ? filters.status.join(',') : undefined,
        name: filters.name && filters.name.trim() !== '' ? filters.name : undefined,
        location: filters.location && filters.location.trim() !== '' ? filters.location : undefined,
        page: page + 1, // 1-based para backend
        page_size: pageSize,
        search: searchTerm && searchTerm.trim() !== '' ? searchTerm : undefined,
      };
      const data = await lineApi.getAllLines(params);

      // Se a resposta for um objeto paginado (DRF style)
      let linesResponse = [];
      let count = 0;
      if (Array.isArray(data)) {
        linesResponse = data;
        count = data.length;
      } else if (data && Array.isArray(data.results)) {
        linesResponse = data.results;
        count = data.count || data.results.length;
      }

      const formattedLines = linesResponse.map(line => {
        let lineStatus = 'Desconhecido';
        if (line.status === 'active') {
          lineStatus = 'Operacional';
        } else if (line.status === 'inactive') {
          lineStatus = 'Parada';
        } else if (line.status === 'maintenance') {
          lineStatus = 'Em Manutenção';
        }

        return {
          id: line.id,
          name: line.name,
          location: line.location,
          status: lineStatus,
          stations_count: line.stations_count,
          produced_items: line.produced_items || Math.floor(Math.random() * 1000) + 100, // Fallback para dados de exemplo
          defects: line.defects || Math.floor(Math.random() * 50) // Fallback para dados de exemplo
        };
      });

      setLines(formattedLines);
      setTotalCount(count);

      const producedSum = formattedLines.reduce((sum, line) => sum + line.produced_items, 0);
      const defectsSum = formattedLines.reduce((sum, line) => sum + line.defects, 0);
      setTotalProduced(producedSum);
      setTotalDefects(defectsSum);

      const opCount = formattedLines.filter(line => line.status === 'Operacional').length;
      const maintCount = formattedLines.filter(line => line.status === 'Em Manutenção').length;
      const stopCount = formattedLines.filter(line => line.status === 'Parada').length;

      setOperationalCount(opCount);
      setMaintenanceCount(maintCount);
      setStoppedCount(stopCount);

    } catch (err) {
      console.error('Erro ao carregar linhas de produção:', err);
      let errorMessage = "Não foi possível carregar a lista de linhas de produção.";
      if (err.response) {
          errorMessage = `Erro do servidor: ${err.response.status} - ${err.response.data.detail || err.response.data.message || 'Detalhes desconhecidos.'}`;
          if (err.response.status === 404) {
            errorMessage = "Endpoint de linhas não encontrado. Verifique a URL da API do backend.";
          } else if (err.response.status === 401) {
            errorMessage = "Não autorizado. Faça login novamente ou verifique o token.";
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
    fetchLines();
  }, [refreshTrigger, filters, ordering, page, pageSize, searchTerm, searchTrigger]); // Inclui searchTerm e searchTrigger

  // Atualizar página ao filtrar
  useEffect(() => {
    setPage(0);
  }, [searchTerm, selectedLineId, filters, ordering]);

  const handleEditLine = (lineId) => {
    const line = lines.find(l => l.id === lineId);
    if (line) {
      setLineToEdit(line);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateLineSubmit = async (lineId, updatedData) => {
    setLoadingEdit(true);
    try {
      await lineApi.updateLine(lineId, updatedData);
      setIsEditModalOpen(false);
      fetchLines();
      toastSuccess('Linha editada com sucesso!');
    } catch (err) {
      console.error(`Erro ao atualizar linha ${lineId}:`, err);
      toastError('Erro ao editar linha.');
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDeleteLineClick = (event, line) => {
    event.stopPropagation();
    setLineToDelete(line);
    setIsDeleteModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setLineToEdit(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setLineToDelete(null);
  };

  const handleConfirmDeleteLine = async () => {
    if (!lineToDelete) return;
    setLoadingDelete(true);
    try {
      await lineApi.deleteLine(lineToDelete.id);
      setIsDeleteModalOpen(false);
      setLineToDelete(null);
      fetchLines();
      toastSuccess('Linha excluída com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir linha:', err);
      toastError('Erro ao excluir linha.');
    } finally {
      setLoadingDelete(false);
    }
  };

  // Não faz mais slice nem filtro local, pois backend já retorna filtrado e paginado
  const linesToDisplay = selectedLineId === 0
    ? lines
    : lines.filter(line => line.id === selectedLineId);

  // Não faz mais slice para paginação
  // const paginatedLines = filteredLines.slice(page * pageSize, page * pageSize + pageSize);

  // Não faz mais filtro local de busca

  // Handlers de paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChipProps = (status) => {
    let color = '#9E9E9E';
    let backgroundColor = '#F5F5F5';

    switch (status) {
      case 'Operacional':
        color = '#1B5E20';
        backgroundColor = '#E8F5E9';
        break;
      case 'Parada':
        color = '#B71C1C';
        backgroundColor = '#FFEBEE';
        break;
      case 'Em Manutenção':
        color = '#FF6F00';
        backgroundColor = '#FFF3E0';
        break;
      default:
        break;
    }
    return { color, backgroundColor };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Operacional':
        return <CheckCircleIcon sx={{ color: 'success.main', fontSize: '1.2rem', mr: 0.5 }} />;
      case 'Parada':
        return <PauseCircleFilledIcon sx={{ color: 'error.main', fontSize: '1.2rem', mr: 0.5 }} />;
      case 'Em Manutenção':
        return <BuildIcon sx={{ color: 'warning.dark', fontSize: '1.2rem', mr: 0.5 }} />;
      default:
        return null;
    }
  };

  const getPieChartData = () => {
    const statusCounts = lines.reduce((acc, line) => {
      acc[line.status] = (acc[line.status] || 0) + 1;
      return acc;
    }, {});

    const data = Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status],
    }));
    return data;
  };

  const pieChartData = getPieChartData();

  const COLORS = {
    'Operacional': '#4CAF50',
    'Parada': '#F44336',
    'Em Manutenção': '#FFC107',
    'Desconhecido': '#9E9E9E'
  };

  const productionDefectsData = [
    { name: 'Produzidos', value: totalProduced, color: '#1976d2' },
    { name: 'Defeitos', value: totalDefects, color: '#D32F2F' }
  ];

  if (loading && lines.length === 0) {
    return (
      <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          width: '100%',
          height: '200px',
        }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando linhas...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          width: '100%',
          height: '200px',
          p: 2,
          border: '1px solid #D32F2F',
          borderRadius: '8px',
          backgroundColor: '#FFEBEE',
        }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'transparent' }}>
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
      <Box sx={{mx: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {selectedLineId === 0 && (
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            width: '100%',
            flexShrink: 0,
          }}>
            <LineStatusChart
              operationalCount={operationalCount}
              maintenanceCount={maintenanceCount}
              stoppedCount={stoppedCount}
              pieChartData={pieChartData}
              COLORS={COLORS}
            />
            <ProductionVsDefectsChart
              totalProduced={totalProduced}
              totalDefects={totalDefects}
              productionDefectsData={productionDefectsData}
            />
          </Box>
        )}

<Box sx={{ mb: 3, mt: 3, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1.5 : 3, alignItems: isMobile ? 'stretch' : 'center' }}>
        <FormControl
          fullWidth={isMobile}
          size="small"
          sx={{
            minWidth: isMobile ? '100%' : 140,
            backgroundColor: '#fff',
            borderRadius: 1,
            boxShadow: 'none',
            height: 45,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              backgroundColor: '#fff',
              fontSize: 17,
              height: 45,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#E0E0E0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#BE3124',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#000',
              fontWeight: 400,
              fontSize: 16,
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#000',
            },
            '& .MuiSelect-select': {
              color: '#333',
              fontWeight: 500,
              padding: '10px 14px',
              minHeight: 'unset',
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          <InputLabel id="order-direction-label">Ordenação</InputLabel>
          <Select
            labelId="order-direction-label"
            value={ordering}
            label="Ordenação"
            onChange={e => setOrdering(e.target.value)}
            inputProps={{
              sx: {
                backgroundColor: '#fff',
                borderRadius: 1,
                fontSize: 17,
                height: 45,
                color: '#333',
                fontWeight: 500,
              }
            }}
          >
            <MenuItem value="-id">Mais recente</MenuItem>
            <MenuItem value="id">Mais antigo</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 1, width: isMobile ? '100%' : 'auto', alignItems: isMobile ? 'stretch' : 'center' }}>
        <Button
            variant="outlined"
            startIcon={<FilterListIcon sx={{ color: '#BE3124', fontSize: 22 }} />}
            sx={{
              minWidth: isMobile ? '100%' : 140,
              height: 45,
              backgroundColor: '#fff',
              border: '1.5px solid #E0E0E0',
              borderRadius: 1,
              color: '#000',
              fontWeight: 500,
              fontSize: 17,
              px: 2,
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'none',
              width: isMobile ? '100%' : 'auto',
              '&:hover': {
                background: '#efefef',
                borderColor: '#000',
              },
            }}
            onClick={e => setFilterAnchorEl(e.currentTarget)}
            fullWidth={isMobile}
          >
            Filtros
          </Button>
          <LineSearchBar
            searchQuery={searchTerm}
            onSearch={value => {
              setSearchTerm(value);
              setSearchTrigger(t => t + 1);
            }}
            onClear={() => {
              setSearchTerm('');
              setSearchTrigger(t => t + 1);
            }}
            placeholder="Buscar por nome ou localização da linha..."
          />
        </Box>
        </Box>
        <LineFilterDialog
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={() => setFilterAnchorEl(null)}
          onApply={f => { setFilters(f); setFilterAnchorEl(null); setPage(0); }}
          onClear={() => { setFilters({ status: [], name: '', location: '' }); setFilterAnchorEl(null); setPage(0); }}
          initialFilters={filters}
        />

        {/* Tabela de Linhas de Produção */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.1)',
            flexGrow: 1,
            maxHeight: selectedLineId === 0 ? 'auto' : '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            '& .MuiTableCell-root': {
              fontSize: '1rem',
              py: 2,
            },
            '& .MuiTableHead-root': {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: 'background.paper',
            },
          }}
        >
          {linesToDisplay.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3, color: 'text.secondary' }}>
              <SearchOffIcon sx={{ fontSize: 54, mb: 1, color: '#BE3124', opacity: 0.7 }} />
              <Typography variant="h6" color="text.secondary">
                Nenhuma linha encontrada
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Tente ajustar os filtros ou a busca para encontrar outros resultados.
              </Typography>
            </Box>
          ) : (
            isMobile ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', p: 2 }}>
                {linesToDisplay.map((line) => {
                  const statusChipProps = getStatusChipProps(line.status);
                  return (
                    <Box
                      key={line.id}
                      sx={{
                        background: '#fff',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px 0 rgba(190,49,36,0.07)',
                        border: '1px solid #E0E0E0',
                        p: 2,
                        mb: 0
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {getStatusIcon(line.status)}
                        <Typography sx={{ fontWeight: 700, color: '#BE3124', fontSize: 16 }}>#{line.id}</Typography>
                        <Chip
                          label={line.status}
                          sx={{
                            backgroundColor: statusChipProps.backgroundColor,
                            color: statusChipProps.color,
                            fontWeight: 500,
                            height: '24px',
                            '& .MuiChip-label': { px: 1.5, fontSize: '0.85rem' }
                          }}
                        />
                      </Box>
                      <Typography sx={{ fontWeight: 600, color: '#222', fontSize: 17, mb: 0.5 }}>{line.name}</Typography>
                      <Typography sx={{ color: '#666', fontSize: 15 }}><b>Localização:</b> {line.location}</Typography>
                      <Typography sx={{ color: '#666', fontSize: 15 }}><b>Estações:</b> {line.stations_count}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                        <Tooltip title="Visualizar" arrow placement="top">
                          <IconButton onClick={() => onLineClick(line.id, line.name)} size="small" sx={{ color: '#2196F3' }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar" arrow placement="top">
                          <IconButton onClick={() => handleEditLine(line.id)} size="small" sx={{ color: '#FF9800' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir" arrow placement="top">
                          <IconButton onClick={(event) => handleDeleteLineClick(event, line)} size="small" sx={{ color: '#BE3124' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Table stickyHeader aria-label="production line table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: 'rgba(190, 49, 36, 0.05)', fontWeight: 'bold', color: '#000', borderBottom: '2px solid rgba(190, 49, 36, 0.1)', width: '5%' }}>ID</TableCell>
                    <TableCell sx={{ backgroundColor: 'rgba(190, 49, 36, 0.05)', fontWeight: 'bold', color: '#000', borderBottom: '2px solid rgba(190, 49, 36, 0.1)', width: '10%' }}>Nome da Linha</TableCell>
                    <TableCell align="center" sx={{ backgroundColor: 'rgba(190, 49, 36, 0.05)', fontWeight: 'bold', color: '#000', borderBottom: '2px solid rgba(190, 49, 36, 0.1)', width: '15%' }}>Status</TableCell>
                    <TableCell sx={{ backgroundColor: 'rgba(190, 49, 36, 0.05)', fontWeight: 'bold', color: '#000', borderBottom: '2px solid rgba(190, 49, 36, 0.1)', width: '15%' }}>Localização</TableCell>
                    <TableCell sx={{ backgroundColor: 'rgba(190, 49, 36, 0.05)', fontWeight: 'bold', color: '#000', borderBottom: '2px solid rgba(190, 49, 36, 0.1)', width: '10%' }}>Estações</TableCell>
                    <TableCell sx={{ backgroundColor: 'rgba(190, 49, 36, 0.05)', fontWeight: 'bold', color: '#000', borderBottom: '2px solid rgba(190, 49, 36, 0.1)', textAlign: 'center', width: '15%' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {linesToDisplay.map((line) => {
                    const statusChipProps = getStatusChipProps(line.status);
                    return (
                      <TableRow
                        key={line.id}
                      >
                        <TableCell component="th" scope="row">{line.id}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getStatusIcon(line.status)}
                            {line.name}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={line.status}
                            sx={{
                              backgroundColor: statusChipProps.backgroundColor,
                              color: statusChipProps.color,
                              fontWeight: 500,
                              height: '24px',
                              '& .MuiChip-label': {
                                px: 1.5,
                                fontSize: '0.875rem'
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>{line.location}</TableCell>
                        <TableCell>{line.stations_count}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Visualizar">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => onLineClick(line.id, line.name)}
                                sx={{ 
                                  color: '#2196F3',
                                  '&:hover': {
                                    backgroundColor: '#2196F315'
                                  }
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleEditLine(line.id)}
                                sx={{ 
                                  color: '#FF9800',
                                  '&:hover': {
                                    backgroundColor: '#FF980015'
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Excluir">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={(event) => handleDeleteLineClick(event, line)}
                                sx={{ 
                                  color: '#BE3124',
                                  '&:hover': {
                                    backgroundColor: '#BE312415'
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )
          )}
        </TableContainer>

        {/* Paginação centralizada */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <LinePagination
            page={page + 1} // LinePagination espera 1-based
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            isMobile={isMobile}
          />
        </Box>

        {lineToEdit && (
          <EditLineModal
            open={isEditModalOpen}
            onClose={handleCloseEditModal}
            lineData={lineToEdit}
            onUpdateSubmit={handleUpdateLineSubmit}
            loading={loadingEdit}
          />
        )}
        {/* Modal de exclusão de linha */}
        <DeleteLineDialog
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDeleteLine}
          line={lineToDelete}
          loading={loadingDelete}
        />
      </Box>
    </Box>
  );
}

export default InformationProductionAllLine;