import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function ContentBox({ children, sx = {}, fixed = false, menuWidth = 0 }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: fixed ? `calc(100% - ${menuWidth}px)` : '100%',
        maxWidth: '100%',
        mx: fixed ? 0 : 'auto',
        my: { xs: 2, md: 6 },
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: '#fff',
        border: 0,
        position: fixed ? 'fixed' : 'relative',
        top: fixed ? '35px' : 'auto',
        left: fixed ? `${menuWidth}px` : 'auto',
        height: fixed ? 'calc(100vh - 64px)' : 'auto',
        overflowY: fixed ? 'auto' : 'unset',
        transition: theme.transitions.create(['width', 'left'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        ...sx
      }}
    >
      {children}
    </Box>
  );
}

export default ContentBox; 