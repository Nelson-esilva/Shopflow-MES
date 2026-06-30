import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Button,
  Tooltip,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as VisibilityIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  PauseCircle as PauseCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
  PlayCircle as PlayCircleIcon,
  FilterList as FilterListIcon,
  SearchOff as SearchOffIcon
} from '@mui/icons-material';
import { listOrders, deleteOrder, createOrder, updateOrder } from './orderApi';
import CreateOrderDialog from './dialogs/CreateOrderDialog';
import OrderMainDetails from './orderview/OrderMainDetails';
import DeleteOrderDialog from './dialogs/DeleteOrderDialog';
import OrderSearchBar from './search/OrderSearchBar';
import EditOrderDialog from './dialogs/EditOrderDialog';
import ProductionOrderPagination from './pagination/ProductionOrderPagination';
import OrderFilterDialog from './dialogs/OrderFilterDialog';
import { toastSuccess, toastError } from '../notifications/toast';

// Mensagens de sucesso para toast
const getOrderSuccessMessage = (action) => {
  switch (action) {
    case 'create': return 'Ordem criada com sucesso!';
    case 'edit': return 'Ordem editada com sucesso!';
    case 'delete': return 'Ordem excluída com sucesso!';
    default: return 'Operação realizada com sucesso!';
  }
};

const ProductionOrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estados para paginação
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' ou 'details'
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    order_code: '',
    quantity_meta: '',
    start_date: '',
    end_date: ''
  });
  const [createErrors, setCreateErrors] = useState({});
  const [search, setSearch] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    order_code: '',
    quantity_meta: '',
    start_date: '',
    end_date: ''
  });
  const [editErrors, setEditErrors] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [ordering, setOrdering] = useState('-id');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [advancedFilters, setAdvancedFilters] = useState({ status: [], order_code: '', start_date: '', end_date: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeout = useRef();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Monta os filtros para a requisição
        const params = {
          ...advancedFilters,
          search: searchQuery,
          ordering,
          page,
          page_size: pageSize
        };
        // Remove filtros vazios
        Object.keys(params).forEach(key => {
          if (params[key] === '' || (Array.isArray(params[key]) && params[key].length === 0)) {
            delete params[key];
          }
        });
        const response = await listOrders(params);
        setOrders(response.results || []);
        setTotalCount(response.count || 0);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar ordens. Por favor, tente novamente.');
        setOrders([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page, pageSize, ordering, advancedFilters, searchQuery]);

  const getStatusColor = (status) => {
    const statusColors = {
      'empty': 'info',
      'in_progress': 'warning',
      'paused': 'default',
      'completed': 'success',
      'canceled': 'error'
    };
    return statusColors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'empty': 'Planejado',
      'planned': 'Planejado',
      'in_progress': 'Em Andamento...',
      'paused': 'Pausado',
      'completed': 'Concluído',
      'canceled': 'Cancelado'
    };
    return statusLabels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Se vier só a data, adiciona 'T12:00:00' para evitar problemas de fuso
    const safeDate = dateString.length === 10 ? dateString + 'T12:00:00' : dateString;
    return new Date(safeDate).toLocaleDateString('pt-BR');
  };

  const getRelatedName = (order, field) => {
    const relatedObject = order[field];
    
    if (!relatedObject) {
      return 'N/A';
    }

    switch (field) {
      case 'product':
        return relatedObject.name || 'N/A';
      case 'production_line':
        return relatedObject.name || 'N/A';
      case 'plan':
        return relatedObject.plan_code || 'N/A';
      default:
        return 'N/A';
    }
  };

  const handleOpenCreate = () => {
    setCreateForm({ order_code: '', quantity_meta: '', start_date: '', end_date: '' });
    setCreateDialogOpen(true);
  };

  const handleCloseCreate = () => {
    setCreateDialogOpen(false);
    setCreateForm({ order_code: '', quantity_meta: '', start_date: '', end_date: '' });
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity_meta') {
      if (!/^\d*$/.test(value)) return;
    }
    setCreateForm((prev) => ({ ...prev, [name]: value }));
    setCreateErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateCreateForm = () => {
    const errors = {};
    const { order_code, quantity_meta, start_date, end_date } = createForm;
    if (!order_code) errors.order_code = 'Informe o código da ordem';
    if (!quantity_meta || isNaN(Number(quantity_meta)) || Number(quantity_meta) <= 0) {
      errors.quantity_meta = 'A meta deve ser um número positivo';
    }
    if (!start_date) errors.start_date = 'Informe a data de início';
    if (!end_date) errors.end_date = 'Informe a data de fim';
    if (start_date && end_date && end_date < start_date) {
      errors.end_date = 'A data de fim não pode ser anterior à data de início';
    }
    return errors;
  };

  const handleCreateOrder = async () => {
    const errors = validateCreateForm();
    setCreateErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setCreateLoading(true);
    try {
      const newOrder = await createOrder(createForm);
      setOrders((prev) => [newOrder, ...prev]);
      handleCloseCreate();
      toastSuccess(getOrderSuccessMessage('create'));
    } catch (error) {
      toastError('Erro ao criar ordem');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteOrder(orderToDelete.id);
      setOrders(prev => prev.filter(order => order.id !== orderToDelete.id));
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
      toastSuccess(getOrderSuccessMessage('delete'));
    } catch (error) {
      toastError('Erro ao excluir ordem');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setViewMode('table');
    setSelectedOrder(null);
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(prev => prev.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  const canEditOrder = (order) => order.status === 'planned';
  const canDeleteOrder = (order) => order.status === 'planned';

  const filteredOrders = orders.filter(order => {
    const searchLower = search.toLowerCase();
    return (
      String(order.id).includes(searchLower) ||
      (order.order_code && order.order_code.toLowerCase().includes(searchLower))
    );
  });

  const handleOpenEdit = (order) => {
    setEditForm({
      id: order.id,
      order_code: order.order_code || '',
      quantity_meta: order.quantity_meta || '',
      start_date: order.start_date || '',
      end_date: order.end_date || ''
    });
    setEditErrors({});
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setEditForm({ id: '', order_code: '', quantity_meta: '', start_date: '', end_date: '' });
    setEditErrors({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity_meta') {
      if (!/^\d*$/.test(value)) return;
    }
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateEditForm = () => {
    const errors = {};
    const { order_code, quantity_meta, start_date, end_date } = editForm;
    if (!order_code) errors.order_code = 'Informe o código da ordem';
    if (!quantity_meta || isNaN(Number(quantity_meta)) || Number(quantity_meta) <= 0) {
      errors.quantity_meta = 'A meta deve ser um número positivo';
    }
    if (!start_date) errors.start_date = 'Informe a data de início';
    if (!end_date) errors.end_date = 'Informe a data de fim';
    if (start_date && end_date && end_date < start_date) {
      errors.end_date = 'A data de fim não pode ser anterior à data de início';
    }
    return errors;
  };

  const handleEditOrder = async () => {
    const errors = validateEditForm();
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setEditLoading(true);
    try {
      const updatedOrder = await updateOrder(editForm.id, {
        order_code: editForm.order_code,
        quantity_meta: editForm.quantity_meta,
        start_date: editForm.start_date,
        end_date: editForm.end_date
      });
      setOrders((prev) => prev.map(order => order.id === editForm.id ? { ...order, ...updatedOrder } : order));
      handleCloseEdit();
      toastSuccess(getOrderSuccessMessage('edit'));
    } catch (error) {
      toastError('Erro ao editar ordem');
    } finally {
      setEditLoading(false);
    }
  };

  const getStatusProps = (status) => {
    switch (status) {
      case 'empty':
        return {
          icon: <HourglassEmptyIcon sx={{ mr: 1, color: '#1976d2' }} />, // azul
          sx: { background: '#e3f2fd', color: '#1976d2', fontWeight: 700 }
        };
      case 'in_progress':
        return {
          icon: <PlayCircleIcon sx={{ mr: 1, color: '#ff9800' }} />, // laranja
          sx: { background: '#fff3e0', color: '#ff9800', fontWeight: 700 }
        };
      case 'paused':
        return {
          icon: <PauseCircleIcon sx={{ mr: 1, color: '#757575' }} />, // cinza
          sx: { background: '#f5f5f5', color: '#757575', fontWeight: 700 }
        };
      case 'completed':
        return {
          icon: <CheckCircleIcon sx={{ mr: 1, color: '#388e3c' }} />, // verde
          sx: { background: '#e8f5e9', color: '#388e3c', fontWeight: 700 }
        };
      case 'canceled':
        return {
          icon: <CancelIcon sx={{ mr: 1, color: '#d32f2f' }} />, // vermelho
          sx: { background: '#ffebee', color: '#d32f2f', fontWeight: 700 }
        };
      default:
        return {
          icon: <HourglassEmptyIcon sx={{ mr: 1, color: '#1976d2' }} />,
          sx: { background: '#e3f2fd', color: '#1976d2', fontWeight: 700 }
        };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress sx={{ color: '#BE3124' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (viewMode === 'details') {
    return (
      <OrderMainDetails 
        order={selectedOrder} 
        onBack={handleBackToList}
        onOrderUpdate={handleOrderUpdate}
      />
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1); // MUI começa do zero
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {}, 400);
  };
  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(1);
  };
  const handleApplyAdvancedFilters = (filters) => {
    setAdvancedFilters(filters);
    setFilterAnchorEl(null);
    setPage(1);
  };
  const handleClearAdvancedFilters = () => {
    setAdvancedFilters({ status: [], order_code: '', start_date: '', end_date: '' });
    setFilterAnchorEl(null);
    setPage(1);
  };
  const handleOrderingChange = (e) => {
    setOrdering(e.target.value);
    setPage(1);
  };

  return (
    <Box>
      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        mb: 3,
        px: { xs: 1, sm: 2 },
        py: isMobile ? 1.5 : 2,
        borderRadius: 3,
        background: '#222',
        boxShadow: '0 2px 12px 0 rgba(190,49,36,0.10)',
        gap: isMobile ? 2 : 0
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'flex-start',
          gap: isMobile ? 1 : 2,
          mb: isMobile ? 1 : 0
        }}>
          <AssignmentIcon sx={{ color: '#BE3124', fontSize: isMobile ? 40 : 64, mt: isMobile ? 0 : 0.5 }} />
          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            <Typography variant="h5" sx={{ fontSize: isMobile ? 22 : 35, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>
              Ordens de Produção
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#fff', opacity: 0.85, fontWeight: 400, fontSize: isMobile ? 13 : 16, mt: 0.5 }}>
              Gerencie aqui todas as ordens de produção cadastradas no sistema.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
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
          Nova Ordem
        </Button>
      </Box>
      {/* Filtros, ordenação e busca */}
      <Box
        sx={isMobile ? {
          backgroundColor: '#F5F5F5',
          borderRadius: 2,
          p: 1.2,
          mt: 2,
          mb: 0
        } : { mb: 3 }}
      >
          <Box sx={{ mb: 3, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1.5 : 3, alignItems: isMobile ? 'stretch' : 'center' }}>
            <FormControl fullWidth={isMobile} size="small" sx={{
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
            }}>            
            <InputLabel id="order-direction-label">Ordenação</InputLabel>
            <Select
              labelId="order-direction-label"
              value={ordering}
              label="Ordenação"
              onChange={handleOrderingChange}
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
            <OrderSearchBar
              searchQuery={searchQuery}
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="Buscar por código..."
            />
          </Box>
          <OrderFilterDialog
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={() => setFilterAnchorEl(null)}
            onApply={handleApplyAdvancedFilters}
            onClear={handleClearAdvancedFilters}
            initialFilters={advancedFilters}
          />
        </Box>
        {(!Array.isArray(orders) || orders.length === 0) ? (
          <>
            <Box sx={{ textAlign: 'center', p: 3, color: 'text.secondary' }}>
              <SearchOffIcon sx={{ fontSize: 54, mb: 1, color: '#BE3124', opacity: 0.7 }} />
              <Typography variant="h6" color="text.secondary">
                Nenhuma ordem encontrada
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Tente ajustar os filtros ou a busca para encontrar outros resultados.
              </Typography>
            </Box>
            <ProductionOrderPagination
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <>
            {/* Cards/tabela */}
            {isMobile ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                {filteredOrders.map((order) => (
                  <Box
                    key={order.id}
                    sx={{
                      background: '#fff',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px 0 rgba(190,49,36,0.07)',
                      border: '1px solid #E0E0E0',
                      p: 2,
                      mb: 0
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 700, color: '#BE3124', fontSize: 16 }}>#{order.id}</Typography>
                      <Chip
                        icon={getStatusProps(order.status).icon}
                        label={getStatusLabel(order.status)}
                        sx={{
                          ...getStatusProps(order.status).sx,
                          minWidth: 90,
                          fontSize: 13,
                          borderRadius: 2,
                          px: 1.2,
                          py: 0.2,
                          boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)'
                        }}
                      />
                    </Box>
                    <Typography sx={{ fontWeight: 600, color: '#222', fontSize: 17, mb: 0.5 }}>{order.order_code}</Typography>
                    <Typography sx={{ color: '#666', fontSize: 15 }}><b>Meta:</b> {order.quantity_meta}</Typography>
                    <Typography sx={{ color: '#666', fontSize: 15 }}><b>Início:</b> {formatDate(order.start_date)}</Typography>
                    <Typography sx={{ color: '#666', fontSize: 15 }}><b>Fim:</b> {formatDate(order.end_date)}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                      <Tooltip title="Visualizar" arrow placement="top">
                        <IconButton onClick={() => handleViewOrder(order)} size="small" sx={{ color: '#2196F3' }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar" arrow placement="top">
                        <IconButton onClick={() => handleOpenEdit(order)} size="small" sx={{ color: '#FF9800' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir" arrow placement="top">
                        <IconButton onClick={() => handleDeleteClick(order)} size="small" sx={{ color: '#BE3124' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <TableContainer 
                component={Paper} 
                sx={{ 
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #E0E0E0'
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#FFF5F5' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>Código da Ordem</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>Meta</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>Início</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>Fim</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>Status</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow 
                        key={order.id}
                        sx={{ backgroundColor: '#fff' }}
                      >
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.order_code}</TableCell>
                        <TableCell>{order.quantity_meta}</TableCell>
                        <TableCell>{formatDate(order.start_date)}</TableCell>
                        <TableCell>{formatDate(order.end_date)}</TableCell>
                        <TableCell>
                          {(() => {
                            const statusProps = getStatusProps(order.status);
                            return (
                              <Chip
                                icon={statusProps.icon}
                                label={getStatusLabel(order.status)}
                                sx={{
                                  ...statusProps.sx,
                                  minWidth: 140,
                                  fontSize: 15,
                                  borderRadius: 2,
                                  px: 1.5,
                                  py: 0.5,
                                  boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)'
                                }}
                              />
                            );
                          })()}
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Visualizar">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleViewOrder(order)}
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
                                onClick={() => handleOpenEdit(order)}
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
                                onClick={() => handleDeleteClick(order)}
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <ProductionOrderPagination
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Box>

      <CreateOrderDialog
        open={createDialogOpen}
        onClose={handleCloseCreate}
        onConfirm={handleCreateOrder}
        form={createForm}
        onChange={handleCreateChange}
        loading={createLoading}
        errors={createErrors}
      />
      <DeleteOrderDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        order={orderToDelete}
        loading={deleteLoading}
      />
      <EditOrderDialog
        open={editDialogOpen}
        onClose={handleCloseEdit}
        onConfirm={handleEditOrder}
        form={editForm}
        onChange={handleEditChange}
        loading={editLoading}
        errors={editErrors}
      />
    </Box>
  );
};

export default ProductionOrderTable; 