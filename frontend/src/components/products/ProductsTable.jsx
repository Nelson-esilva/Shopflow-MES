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
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import ProductTableHeader from './table/ProductTableHeader';
import ProductTableRow from './table/ProductTableRow';
import ProductSearchBar from './search/ProductSearchBar';
import DeleteProductDialog from './dialogs/DeleteProductDialog';
import EditProductDialog from './dialogs/EditProductDialog';
import ViewProductDialog from './dialogs/ViewProductDialog';
import CreateProductDialog from './dialogs/CreateProductDialog';
import ProductsPagination from './pagination/ProductsPagination';
import ProductsFilterDialog from './dialogs/ProductsFilterDialog';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductsTable = ({
  products,
  loading,
  error,
  page,
  pageSize,
  totalCount,
  onView,
  onEdit,
  onDelete,
  onApplyAdvancedFilters,
  onClearAdvancedFilters,
  onSearch,
  onClearSearch,
  onChangePage,
  onChangeRowsPerPage,
  ordering,
  setOrdering,
  searchQuery,
  advancedFilters,
  filterAnchorEl,
  setFilterAnchorEl,
  createDialogOpen,
  setCreateDialogOpen,
  isMobile = false,
  fetchProducts // nova prop
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [productToView, setProductToView] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    model: '',
    code: '',
    product_type: ''
  });
  const [createForm, setCreateForm] = useState({
    name: '',
    model: '',
    code: '',
    product_type: ''
  });
  const searchTimeout = useRef();

  // Remover todos os estados e funções relacionados ao hook interno
  // Usar apenas os dados e handlers recebidos via props
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  // Handlers para editar, excluir e criar produto usando props (com toast)
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    if (onDelete) {
      await onDelete(productToDelete);
    } else {
      // This part of the logic would typically be handled by a hook or context
      // For now, it's a placeholder.
      console.error("No onDelete handler provided.");
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setEditForm({
      name: product.name,
      model: product.model,
      code: product.code,
      product_type: product.product_type
    });
    setEditDialogOpen(true);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditConfirm = async () => {
    if (!productToEdit) return;
    if (onEdit) {
      await onEdit(productToEdit.id, editForm);
    } else {
      // This part of the logic would typically be handled by a hook or context
      // For now, it's a placeholder.
      console.error("No onEdit handler provided.");
    }
    setEditDialogOpen(false);
    setProductToEdit(null);
    setEditForm({ name: '', model: '', code: '', product_type: '' });
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setProductToEdit(null);
    setEditForm({
      name: '',
      model: '',
      code: '',
      product_type: ''
    });
  };

  const handleViewClick = (product) => {
    setProductToView(product);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setProductToView(null);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'raw_material':
        return '#2196F3';
      case 'finished':
        return '#4CAF50';
      case 'semi_finished':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'raw_material':
        return 'Matéria Prima';
      case 'finished':
        return 'Produto Final';
      case 'semi_finished':
        return 'Semi-Acabado';
      default:
        return type;
    }
  };

  const handleCreateChange = (event) => {
    const { name, value } = event.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateConfirm = async (formData) => {
    if (typeof onConfirm === 'function') {
      await onConfirm(formData);
    }
    setCreateDialogOpen(false);
    setCreateForm({ name: '', model: '', code: '', product_type: '' });
  };

  const handleCreateCancel = () => {
    setCreateDialogOpen(false);
    setCreateForm({
      name: '',
      model: '',
      code: '',
      product_type: ''
    });
  };

  const handleApplyAdvancedFilters = () => {
    onApplyAdvancedFilters(advancedFilters);
    setFilterAnchorEl(null);
  };
  const handleClearAdvancedFilters = () => {
    onClearAdvancedFilters();
    setFilterAnchorEl(null);
  };

  const handleClearSearch = () => {
    onClearSearch();
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

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1.5 : 3, alignItems: isMobile ? 'stretch' : 'center' }}>
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
          <ProductSearchBar
            searchQuery={searchQuery}
            onSearch={onSearch}
            onClear={handleClearSearch}
            isMobile={isMobile}
          />
        </Box>
        <ProductsFilterDialog
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={() => setFilterAnchorEl(null)}
          onApply={onApplyAdvancedFilters}
          onClear={onClearAdvancedFilters}
          initialFilters={advancedFilters}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!Array.isArray(products) || products.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 3, color: 'text.secondary' }}>
          <SearchOffIcon sx={{ fontSize: 54, mb: 1, color: '#BE3124', opacity: 0.7 }} />
          <Typography variant="h6" color="text.secondary">
            Nenhum produto encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Tente ajustar os filtros ou a busca para encontrar outros resultados.
          </Typography>
        </Box>
      ) : (
        <>
        {isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            {products.map((product) => (
              <Box
                key={product.id}
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
                  <Typography sx={{ fontWeight: 700, color: '#BE3124', fontSize: 16 }}>#{product.id}</Typography>
                  <Chip
                    label={getTypeLabel(product.product_type)}
                    sx={{
                      backgroundColor: `${getTypeColor(product.product_type)}15`,
                      color: getTypeColor(product.product_type),
                      fontWeight: 500,
                      height: '24px',
                      '& .MuiChip-label': { px: 1.5, fontSize: '0.85rem' }
                    }}
                  />
                </Box>
                <Typography sx={{ fontWeight: 600, color: '#222', fontSize: 17, mb: 0.5 }}>{product.name}</Typography>
                <Typography sx={{ color: '#666', fontSize: 15 }}><b>Modelo:</b> {product.model}</Typography>
                <Typography sx={{ color: '#666', fontSize: 15 }}><b>Código:</b> {product.code}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                  <Tooltip title="Ver detalhes" arrow placement="top">
                    <IconButton onClick={() => handleViewClick(product)} size="small" sx={{ color: '#2196F3' }}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar" arrow placement="top">
                    <IconButton onClick={() => handleEditClick(product)} size="small" sx={{ color: '#FF9800' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Deletar" arrow placement="top">
                    <IconButton onClick={() => handleDeleteClick(product)} size="small" sx={{ color: '#BE3124' }}>
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
            border: '1px solid #E0E0E0',
            overflowX: isMobile ? 'auto' : 'visible'
          }}
        >
          <Table>
            <ProductTableHeader isMobile={isMobile} />
            <TableBody>
              {products.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  onView={handleViewClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  getTypeLabel={getTypeLabel}
                  getTypeColor={getTypeColor}
                  isMobile={isMobile}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}
        </>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <ProductsPagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
          isMobile={isMobile}
        />
      </Box>

      <DeleteProductDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        product={productToDelete}
        loading={false} // Assuming deleteLoading is no longer available
      />

      <EditProductDialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        onConfirm={handleEditConfirm}
        form={editForm}
        onChange={handleEditChange}
        loading={false} // Assuming editLoading is no longer available
      />

      <ViewProductDialog
        open={viewDialogOpen}
        onClose={handleViewClose}
        product={productToView}
        getTypeLabel={getTypeLabel}
        getTypeColor={getTypeColor}
      />

      <CreateProductDialog
        open={createDialogOpen}
        onClose={handleCreateCancel}
        onConfirm={handleCreateConfirm}
        form={createForm}
        onChange={handleCreateChange}
        loading={false} // Assuming createLoading is no longer available
        isMobile={isMobile}
        onProductCreated={fetchProducts}
      />
    </Box>
  );
};

export default ProductsTable; 