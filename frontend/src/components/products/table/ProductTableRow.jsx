import React from 'react';
import { TableRow, TableCell, Box, IconButton, Chip, Tooltip, Typography } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const ProductTableRow = ({
  product,
  onView,
  onEdit,
  onDelete,
  getTypeLabel,
  getTypeColor,
  isMobile = false
}) => {
  if (isMobile) {
    return (
      <TableRow>
        <TableCell colSpan={6} sx={{ p: 0, border: 0, background: 'none' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              bgcolor: '#fff',
              borderRadius: 2,
              boxShadow: '0 2px 8px 0 rgba(190,49,36,0.07)',
              border: '1px solid #E0E0E0',
              p: 2,
              mb: 2
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
                <IconButton onClick={() => onView(product)} size="small" sx={{ color: '#2196F3' }}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar" arrow placement="top">
                <IconButton onClick={() => onEdit(product)} size="small" sx={{ color: '#FF9800' }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Deletar" arrow placement="top">
                <IconButton onClick={() => onDelete(product)} size="small" sx={{ color: '#BE3124' }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    );
  }
  return (
    <TableRow 
      sx={{ 
        backgroundColor: '#FFF',
        '&:hover': { 
          backgroundColor: '#FFF',
          transition: 'background-color 0.2s'
        },
        '& td': {
          borderBottom: '1px solid #E0E0E0'
        }
      }}
    >
      <TableCell sx={{ color: '#666' }}>{product.id}</TableCell>
      <TableCell sx={{ color: '#333', fontWeight: 500 }}>{product.name}</TableCell>
      <TableCell sx={{ color: '#666' }}>{product.model}</TableCell>
      <TableCell sx={{ color: '#666' }}>{product.code}</TableCell>
      <TableCell align="center">
        <Chip
          label={getTypeLabel(product.product_type)}
          sx={{
            backgroundColor: `${getTypeColor(product.product_type)}15`,
            color: getTypeColor(product.product_type),
            fontWeight: 500,
            height: '24px',
            '& .MuiChip-label': {
              px: 1.5,
              fontSize: '0.875rem'
            }
          }}
        />
      </TableCell>
      <TableCell align="center">
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title="Ver detalhes" arrow placement="top">
            <IconButton
              onClick={() => onView(product)}
              size="small"
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
          <Tooltip title="Editar" arrow placement="top">
            <IconButton
              onClick={() => onEdit(product)}
              size="small"
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
          <Tooltip title="Deletar" arrow placement="top">
            <IconButton
              onClick={() => onDelete(product)}
              size="small"
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
};

export default ProductTableRow; 