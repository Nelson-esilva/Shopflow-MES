import { useState } from 'react';

export const useProductSearch = (allProducts, setFilteredProducts) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredProducts(allProducts);
      return;
    }

    const searchTermLower = value.toLowerCase();
    const filtered = allProducts.filter(product => {
      // Busca por ID
      if (!isNaN(searchTermLower) && product.id.toString() === searchTermLower) {
        return true;
      }
      
      // Busca por código
      if (product.code.toLowerCase().includes(searchTermLower)) {
        return true;
      }

      return false;
    });

    setFilteredProducts(filtered);
  };

  return {
    searchTerm,
    handleSearch
  };
}; 