import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography,
  Alert,
  useTheme,
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  Inventory as InventoryIcon,
  Add as AddIcon
} from '@mui/icons-material';
import ProductsTable from '../components/products/ProductsTable';
import { useProductOperations } from '../components/products/hooks/useProductOperations';
import DesignerLayout from '../layout/DesignerLayout';
import { toastSuccess, toastError } from '../components/notifications/toast';

function getProductSuccessMessage(action) {
  switch (action) {
    case 'create': return 'Produto criado com sucesso!';
    case 'edit': return 'Produto editado com sucesso!';
    case 'delete': return 'Produto excluído com sucesso!';
    default: return 'Operação realizada com sucesso!';
  }
}

const ProductsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const {
    products,
    loading,
    error,
    fetchProducts,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount,
    handleDelete,
    handleEdit,
    handleCreate
  } = useProductOperations();

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [advancedFilters, setAdvancedFilters] = useState({ name: '', code: '', model: '', product_type: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, setOrdering] = useState('-id');
  const searchTimeout = useRef();

  useEffect(() => {
    fetchProducts(page, pageSize, { ...advancedFilters, search: searchQuery }, ordering);
    // eslint-disable-next-line
  }, [page, pageSize, ordering]);

  const handleViewProduct = (product) => {
    // TODO: implementar visualizacao do produto
  };

  // Handlers integrados com toast
  const handleCreateProduct = async (formData) => {
    const success = await handleCreate(formData);
    if (success) {
      toastSuccess(getProductSuccessMessage('create'));
      await fetchProducts(page, pageSize, advancedFilters, ordering);
      setPage(1);
    } else {
      toastError('Erro ao criar produto');
    }
  };

  const handleEditProduct = async (productId, formData) => {
    const success = await handleEdit(productId, formData);
    if (success) {
      toastSuccess(getProductSuccessMessage('edit'));
      await fetchProducts(page, pageSize, advancedFilters, ordering);
    } else {
      toastError('Erro ao editar produto');
    }
  };

  const handleDeleteProduct = async (product) => {
    const success = await handleDelete(product);
    if (success) {
      toastSuccess(getProductSuccessMessage('delete'));
      await fetchProducts(page, pageSize, advancedFilters, ordering);
    } else {
      toastError('Erro ao excluir produto');
    }
  };

  const handleConfirmDelete = () => {
    // Implementar exclusão do produto
    console.log('Excluir produto:', selectedProduct);
    setDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleApplyAdvancedFilters = (filters) => {
    setAdvancedFilters(filters);
    setFilterAnchorEl(null);
    fetchProducts(1, pageSize, filters, ordering);
    setPage(1);
  };
  const handleClearAdvancedFilters = () => {
    setAdvancedFilters({ name: '', code: '', model: '', product_type: [] });
    setFilterAnchorEl(null);
    fetchProducts(1, pageSize, {}, ordering);
    setPage(1);
  };
  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1); // Sempre volta para a primeira página ao buscar
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchProducts(1, pageSize, { search: value }, ordering);
    }, 400);
  };
  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(1);
    fetchProducts(1, pageSize, { search: '' }, ordering);
  };
  const handleChangePage = (event, newPage) => {
    const safePage = Number.isFinite(newPage) ? newPage + 1 : 1;
    setPage(safePage);
  };
  const handleChangeRowsPerPage = (event) => {
    const value = parseInt(event.target.value, 10);
    setPageSize(Number.isFinite(value) ? value : 10);
    setPage(1);
  };

  return (
    <>
         <DesignerLayout>
         <Box sx={{ p: 3 }}>
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
                <InventoryIcon sx={{ color: '#BE3124', fontSize: isMobile ? 40 : 64, mt: isMobile ? 0 : 0.5 }} />
                <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <Typography variant="h5" sx={{ fontSize: isMobile ? 22 : 35, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>
                    Produtos
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#fff', opacity: 0.85, fontWeight: 400, fontSize: isMobile ? 13.5 : 16, mt: 0.5 }}>
                    Gerencie aqui todos os produtos cadastrados no sistema.
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
                Novo Produto
              </Button>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                onClose={() => setError(null)}
                sx={{ mx: 3, mb: 3 }}
              >
                {error}
              </Alert>
            )}

            <Box
              sx={{ 
                mx: 'auto', 
                width: '100%', 
                overflowX: isMobile ? 'auto' : 'visible', 
                backgroundColor: isMobile ? '#F5F5F5' : 'transparent',
                p: isMobile ? 1.2 : 0,
                borderRadius: isMobile ? 2 : 0,
                minHeight: 120
              }}>
              <ProductsTable 
                products={products}
                loading={loading}
                error={error}
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onView={handleViewProduct}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onApplyAdvancedFilters={handleApplyAdvancedFilters}
                onClearAdvancedFilters={handleClearAdvancedFilters}
                onSearch={handleSearch}
                onClearSearch={handleClearSearch}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ordering={ordering}
                setOrdering={setOrdering}
                searchQuery={searchQuery}
                advancedFilters={advancedFilters}
                filterAnchorEl={filterAnchorEl}
                setFilterAnchorEl={setFilterAnchorEl}
                createDialogOpen={createDialogOpen}
                setCreateDialogOpen={setCreateDialogOpen}
                isMobile={isMobile}
                fetchProducts={() => fetchProducts(page, pageSize, advancedFilters, ordering)}
              />
            </Box>
            </Box>
        </DesignerLayout>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o produto "{selectedProduct?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ backgroundColor: '#BE3124' }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductsPage; 