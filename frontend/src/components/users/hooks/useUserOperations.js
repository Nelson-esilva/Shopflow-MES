import { useState } from 'react';
import { createUser, updateUser, deleteUser, getAuthToken, listUsers } from '../usersApi';

export const useUserOperations = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Estados para paginação
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Agora aceita filtros avançados
  const fetchUsers = async (pageArg = page, pageSizeArg = pageSize, ordering = '-id', filters = {}, sendOrdering = true) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pageArg,
        pageSize: pageSizeArg,
        ...filters
      };
      if (sendOrdering) {
        params.ordering = ordering;
      }
      const response = await listUsers(params);
      setUsers(response.results || []);
      setTotalCount(response.count || 0);
    } catch (err) {
      setError(err.message || 'Erro ao carregar usuários');
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Método para uso externo (filtros avançados)
  const fetchUsersWithFilters = async (filters = {}, ordering = '-id') => {
    await fetchUsers(1, pageSize, ordering, filters);
    setPage(1);
  };

  const handleCreateUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createUser(userData);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erro ao criar usuário';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateUser(userId, userData);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erro ao atualizar usuário';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteUser(userId);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erro ao excluir usuário';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount,
    setTotalCount,
    fetchUsers,
    fetchUsersWithFilters,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser
  };
}; 