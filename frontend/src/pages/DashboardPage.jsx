import React from 'react';
import DesignerLayout from '../layout/DesignerLayout';
import { Typography, Paper, Box } from '@mui/material';
import ProductionDashboard from '../components/dashboard/ProductionDashboard';

const DashboardPage = () => {
  return (
    <DesignerLayout>
      <Box sx={{mt: -5}}>
      <ProductionDashboard />
      </Box>
    </DesignerLayout>
  );
};

export default DashboardPage; 