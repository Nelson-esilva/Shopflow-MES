import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const Footer = ({ menuWidth }) => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: `${menuWidth}px`,
        right: 0,
        py: 1,
        px: 3,
        bgcolor: '#fff',
        borderTop: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['left', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: `calc(100% - ${menuWidth}px)`,
        height: '40px'
      }}
    >
      <Typography variant="body2" color="#000" sx={{ fontSize: '0.875rem' }}>
        ShopFlow © 2025 - V0.0.3
      </Typography>
    </Box>
  );
};

export default Footer; 