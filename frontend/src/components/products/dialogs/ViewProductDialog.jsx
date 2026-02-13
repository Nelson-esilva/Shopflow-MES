import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const ViewProductDialog = ({
  open,
  onClose,
  product,
  getTypeLabel,
  getTypeColor
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  if (!product) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isMobile ? 0 : '10px',
          m: isMobile ? 0 : undefined
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#FFF5F5',
        borderBottom: '1px solid #E2D9D9',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontSize: isMobile ? 18 : 22,
        py: isMobile ? 1.2 : 2,
        px: isMobile ? 2 : 3
      }}>
        <InfoIcon sx={{ color: '#000', fontSize: isMobile ? 22 : 26 }} />
        Detalhes do Produto
      </DialogTitle>
      <DialogContent sx={{ mt: 2, px: isMobile ? 2 : 3, py: isMobile ? 1.5 : 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1.2 : 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? 13 : 15 }}>
              ID
            </Typography>
            <Typography variant="body1" sx={{ fontSize: isMobile ? 15 : 17 }}>
              {product.id}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? 13 : 15 }}>
              Nome
            </Typography>
            <Typography variant="body1" sx={{ fontSize: isMobile ? 15 : 17 }}>
              {product.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? 13 : 15 }}>
              Modelo
            </Typography>
            <Typography variant="body1" sx={{ fontSize: isMobile ? 15 : 17 }}>
              {product.model}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? 13 : 15 }}>
              Código
            </Typography>
            <Typography variant="body1" sx={{ fontSize: isMobile ? 15 : 17 }}>
              {product.code}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? 13 : 15 }}>
              Tipo
            </Typography>
            <Chip
              label={getTypeLabel(product.product_type)}
              sx={{
                backgroundColor: `${getTypeColor(product.product_type)}15`,
                color: getTypeColor(product.product_type),
                fontWeight: 500,
                height: '24px',
                '& .MuiChip-label': {
                  px: 1.5,
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? 13 : 15 }}>
              Data de Criação
            </Typography>
            <Typography variant="body1" sx={{ fontSize: isMobile ? 15 : 17 }}>
              {new Date(product.created).toLocaleString('pt-BR')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? 13 : 15 }}>
              Última Atualização
            </Typography>
            <Typography variant="body1" sx={{ fontSize: isMobile ? 15 : 17 }}>
              {new Date(product.updated).toLocaleString('pt-BR')}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: isMobile ? 1.5 : 2, borderTop: '1px solid #E2D9D9' }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: '#666',
            fontSize: isMobile ? 15 : 16,
            width: isMobile ? '100%' : 'auto',
            '&:hover': {
              backgroundColor: '#F5F5F5'
            }
          }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewProductDialog; 