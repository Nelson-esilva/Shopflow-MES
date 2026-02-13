import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';

const ProductTableHeader = ({ isMobile = false }) => {
  if (isMobile) return null;
  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: '#FFF5F5' }}>
        <TableCell sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>ID</TableCell>
        <TableCell sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>Nome</TableCell>
        <TableCell sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>Modelo</TableCell>
        <TableCell sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>Código</TableCell>
        <TableCell align="center" sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>Tipo</TableCell>
        <TableCell align="center" sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>Ações</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default ProductTableHeader; 