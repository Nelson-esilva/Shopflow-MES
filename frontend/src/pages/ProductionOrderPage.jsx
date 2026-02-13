import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import DesignerLayout from '../layout/DesignerLayout';
import ProductionOrderTable from '../components/productionorder/ProductionOrderTable';

const ProductionOrderPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
    <DesignerLayout>
          <Box sx={{ p: 3 }}>
            <ProductionOrderTable />
          </Box>
        </DesignerLayout>
    </>
  );
};

export default ProductionOrderPage; 