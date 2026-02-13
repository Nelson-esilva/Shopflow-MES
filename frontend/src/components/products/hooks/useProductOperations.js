import { useState } from 'react';
import { listProducts, deleteProduct, updateProduct, createProduct } from '../productsApi';

export const useProductOperations = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  // Estados para paginação
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Novo: fetchProducts aceita filtros e ordering
  const fetchProducts = async (pageArg = page, pageSizeArg = pageSize, filters = {}, ordering = '-id') => {
    try {
      setLoading(true);
      const params = { ...filters };
      if (ordering) params.ordering = ordering;
      // Proteção extra para nunca enviar page < 1
      const safePage = Math.max(1, pageArg);
      const response = await listProducts(safePage, pageSizeArg, params);
      setProducts(response.results || []);
      setTotalCount(response.count || 0);
      setError(null);
    } catch (err) {
      setError(`Erro ao carregar produtos: ${err.message}`);
      setProducts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Novo: fetchProductsWithFilters para uso externo
  const fetchProductsWithFilters = async (filters = {}, ordering = '-id') => {
    await fetchProducts(1, pageSize, filters, ordering);
    setPage(1);
  };

  const handleDelete = async (product) => {
    try {
      setDeleteLoading(true);
      await deleteProduct(product.id);
      
      // Re-fetch products to update the list
      await fetchProducts(page, pageSize);
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Erro ao deletar:', err);
      setError(`Erro ao deletar produto: ${err.message}`);
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = async (productId, formData) => {
    try {
      setEditLoading(true);
      const updatedProduct = await updateProduct(productId, formData);
      
      // Re-fetch products to update the list
      await fetchProducts(page, pageSize);
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Erro ao editar:', err);
      setError(`Erro ao editar produto: ${err.message}`);
      return false;
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      setCreateLoading(true);
      const newProduct = await createProduct(formData);
      
      // Re-fetch products to update the list
      await fetchProducts(page, pageSize);
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Erro ao criar:', err);
      setError(`Erro ao criar produto: ${err.message}`);
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    deleteLoading,
    editLoading,
    createLoading,
    fetchProducts,
    fetchProductsWithFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount,
    setTotalCount,
    handleDelete,
    handleEdit,
    handleCreate
  };
}; 