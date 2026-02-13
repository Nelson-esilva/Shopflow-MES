import React from 'react';
import { Box, Paper, Grid } from '@mui/material';
import DefectCountChart from '../defects/charts/DefectCountChart';
import DefectTypeChart from '../defects/charts/DefectTypeChart';

const DefeitosContent = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
    <Box sx={{ width: '100%' }}>
    <Paper
        elevation={8}
        sx={{
          p: { xs: 2, md: 6 },
          textAlign: 'center',
          minHeight: 500,
          borderRadius: 6,
          background: '#fbfbfb',
          boxShadow: 'none',
          border: '2px solid #ccc'
        }}
      >
        <Grid container spacing={2} alignItems="flex-start" justifyContent="center">
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <DefectCountChart />
      </Grid>
      <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <DefectTypeChart />
      </Grid>
    </Grid>
    </Paper>
  </Box>
   </Box>
);

export default DefeitosContent; 