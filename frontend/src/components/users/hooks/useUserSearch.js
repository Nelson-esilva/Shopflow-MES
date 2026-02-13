import { useState, useMemo } from 'react';

export const useUserSearch = (users) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return users;
    }

    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.id?.toString().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query) ||
      user.name?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return {
    searchQuery,
    filteredUsers,
    handleSearch,
    clearSearch
  };
}; 