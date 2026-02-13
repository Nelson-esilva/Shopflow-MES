import { 
  Box, 
  Typography,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Button,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { People as PeopleIcon, Add as AddIcon, FilterList } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';
import { useUserOperations } from '../components/users/hooks/useUserOperations';
import { getUserSuccessMessage } from '../components/users/utils/alertUtils';
import UsersTable from '../components/users/table/UsersTable';
import CreateUserDialog from '../components/users/dialogs/CreateUserDialog';
import EditUserDialog from '../components/users/dialogs/EditUserDialog';
import ViewUserDialog from '../components/users/dialogs/ViewUserDialog';
import DeleteUserDialog from '../components/users/dialogs/DeleteUserDialog';
import DesignerLayout from '../layout/DesignerLayout';
import UserSearchBar from '../components/users/search/UserSearchBar';
import { toastSuccess, toastError } from '../components/notifications/toast';
import UserFilterDialog from '../components/users/dialogs/UserFilterDialog';
import UsersPagination from '../components/users/pagination/UsersPagination';

function UsersPage() {
  // Remover estados locais de users, loading, error
  // Usar o hook de operações
  const {
    users,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount,
    fetchUsers,
    fetchUsersWithFilters,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser
  } = useUserOperations();
  
  // Estados dos diálogos
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Ordenação
  const [orderBy, setOrderBy] = useState('id'); // frontend (setinhas)
  const [orderDirection, setOrderDirection] = useState('desc'); // frontend (setinhas)
  const [ordering, setOrdering] = useState('-id'); // '-id' para mais recente, 'id' para mais antigo
  const [roles, setRoles] = useState([]); // array de roles selecionados

  // Estado para filtro avançado
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [advancedFilters, setAdvancedFilters] = useState({ name: '', email: '', role: [] });

  // Estado para busca backend
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeout = useRef();

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchUsers(1, pageSize, ordering, { search: value });
    }, 400);
  };
  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(1);
    fetchUsers(1, pageSize, ordering, { search: '' });
  };

  // Função para aplicar filtros avançados (busca no backend)
  const handleApplyAdvancedFilters = async (filters) => {
    setAdvancedFilters(filters);
    setFilterAnchorEl(null);
    await fetchUsersWithFilters({
      name: filters.name,
      email: filters.email,
      role: filters.role.length > 0 ? filters.role.join(',') : ''
    }, ordering);
  };
  const handleClearAdvancedFilters = () => {
    setAdvancedFilters({ name: '', email: '', role: [] });
    setSearchQuery('');
    fetchUsers(page, pageSize, ordering, {});
  };

  // Função para ordenar localmente os usuários apenas para nome, email e função
  function sortUsersLocally(users, orderBy, orderDirection) {
    if (!['name', 'email', 'role'].includes(orderBy)) return users;
    return [...users].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      // Para função, usar o label em português
      if (orderBy === 'role') {
        aValue = a.role || '';
        bValue = b.role || '';
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      if (aValue < bValue) return orderDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return orderDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Handler para ordenação de colunas (frontend)
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    const newDirection = isAsc ? 'desc' : 'asc';
    setOrderBy(property);
    setOrderDirection(newDirection);
  };

  // Exibir sempre o array do backend, sem sort local
  const displayedUsers = users; // Ordenação e busca 100% backend

  // Executa a busca de usuários ao montar o componente ou ao mudar filtros
  useEffect(() => {
    const roleParam = roles.length > 0 ? roles.join(',') : '';
    fetchUsers(page, pageSize, ordering, { role: roleParam }, true);
  }, [page, pageSize, ordering, roles]);

  // Handlers para diálogos
  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateConfirm = async (userData) => {
    try {
      await handleCreateUser(userData);
      await fetchUsers();
      setCreateDialogOpen(false);
      toastSuccess(getUserSuccessMessage('create'));
    } catch (err) {
      toastError(err?.response?.data?.detail || err.message || 'Erro ao criar usuário');
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleEditConfirm = async (userId, userData) => {
    try {
      await handleUpdateUser(userId, userData);
      await fetchUsers();
      setEditDialogOpen(false);
      setSelectedUser(null);
      toastSuccess(getUserSuccessMessage('edit'));
    } catch (err) {
      toastError(err?.response?.data?.detail || err.message || 'Erro ao editar usuário');
    }
  };

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await handleDeleteUser(selectedUser.id);
      await fetchUsers();
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      toastSuccess(getUserSuccessMessage('delete'));
    } catch (err) {
      toastError(err?.response?.data?.detail || err.message || 'Erro ao excluir usuário');
    }
  };

  // Handlers para fechar diálogos
  const handleCloseCreateDialog = () => setCreateDialogOpen(false);
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };
  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedUser(null);
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
       <DesignerLayout>
        <Box sx={{ p:3 }}>
          {/* Header */}
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
              <PeopleIcon sx={{ color: '#BE3124', fontSize: isMobile ? 40 : 64, mt: isMobile ? 0 : 0.5 }} />
              <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                <Typography variant="h5" sx={{ fontSize: isMobile ? 22 : 35, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>
                  Usuários
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#fff', opacity: 0.85, fontWeight: 400, fontSize: isMobile ? 13 : 16, mt: 0.5 }}>
                  Gerencie aqui todos os usuários cadastrados no sistema.
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateClick}
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
              Novo Usuário
            </Button>
          </Box>

          {/* Área cinza mobile: filtros, busca e tabela */}
          <Box sx={{
            backgroundColor: isMobile ? '#F5F5F5' : 'transparent',
            p: isMobile ? 1.2 : 0,
            borderRadius: isMobile ? 2 : 0,
            minHeight: 120
          }}>
          {/* Filtros acima da tabela */}
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
              startIcon={<FilterList sx={{ color: '#BE3124', fontSize: 22 }} />}
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
              <UserSearchBar
                searchQuery={searchQuery}
                onSearch={handleSearch}
                onClear={handleClearSearch}
                isMobile={isMobile}
                placeholder="Buscar por nome, email ou username..."
              />
            </Box>
          </Box>
          {/* Popover de filtro avançado */}
          <UserFilterDialog
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={() => setFilterAnchorEl(null)}
            onApply={handleApplyAdvancedFilters}
            onClear={handleClearAdvancedFilters}
            initialFilters={advancedFilters}
          />

          {/* Tabela de usuários */}
          <Box sx={{ 
            width: '100%', 
            overflowX: isMobile ? 'auto' : 'visible'
          }}>
          <UsersTable
              users={displayedUsers}
            loading={loading}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            orderBy={orderBy}
            orderDirection={orderDirection}
            onRequestSort={handleRequestSort}
          />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <UsersPagination
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              isMobile={isMobile}
            />
          </Box>
          </Box>

          {/* Diálogos */}
          <CreateUserDialog
            open={createDialogOpen}
            onClose={handleCloseCreateDialog}
            onConfirm={handleCreateConfirm}
            fullScreen={isMobile}
          />

          <EditUserDialog
            open={editDialogOpen}
            onClose={handleCloseEditDialog}
            onConfirm={handleEditConfirm}
            user={selectedUser}
            fullScreen={isMobile}
          />

          <ViewUserDialog
            open={viewDialogOpen}
            onClose={handleCloseViewDialog}
            user={selectedUser}
            fullScreen={isMobile}
          />

          <DeleteUserDialog
            open={deleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            onConfirm={handleDeleteConfirm}
            user={selectedUser}
            fullScreen={isMobile}
          />

          {/* Alertas */}
          {/* Remover todos os Snackbars de sucesso e erro */}

          {error && (
            <Snackbar
              open={!!error}
              autoHideDuration={5000}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            </Snackbar>
          )}
        </Box>
      </DesignerLayout>
    </>
  );
}

export default UsersPage; 