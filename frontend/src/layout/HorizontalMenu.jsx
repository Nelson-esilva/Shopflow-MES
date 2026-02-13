import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

function HorizontalMenu({ onHamburgerClick, menuWidth }) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { user: jwtUser, logout } = useAuth();
  const { user: googleUser, logoutGoogle } = useGoogleAuth();
  const user = googleUser || jwtUser; // Consolida o usuário logado
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      if (googleUser) {
        await logoutGoogle();
      } else {
        await logout();
      }
      handleCloseUserMenu();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error); // Adicionado para melhor depuração
      handleCloseUserMenu();
      navigate('/login');
    }
  };

  const handleProfile = () => {
    navigate('/meu-perfil');
    handleCloseUserMenu();
  };

  const handleSettings = () => {
    navigate('/configuracoes');
    handleCloseUserMenu();
  };

  // Determine o nome a ser exibido
  const userNameDisplay = user?.name || user?.username || user?.email?.split('@')[0] || 'Usuário';

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#BE3124',
        boxShadow: 'none',
        borderBottom: '0px solid #000',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        marginLeft: isMobile ? 0 : menuWidth,
        width: isMobile ? '100%' : `calc(100% - ${menuWidth})`,
        transition: 'margin-left 0.3s, width 0.3s',
      }}
    >
      <Toolbar sx={{ minHeight: '80px !important', display: 'flex', justifyContent: 'flex-end', pr: { xs: 1, sm: 4 } }}>
        {/* Botão de menu hambúrguer à esquerda */}
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onHamburgerClick} sx={{ mr: 2, position: 'absolute', left: 16 }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right', mr: 2 }}>
            {/* Primeira linha: Nome do usuário */}
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 500, fontSize: 20 }}>
              Olá, {userNameDisplay}
            </Typography>
            {/* Segunda linha: Cargo (role_display) */}
            {user?.role_display && ( // Exibe o cargo apenas se ele existir
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
                {user.role_display}
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              alt={userNameDisplay} // Usando o nome de exibição no alt
              src={user?.picture || user?.avatar || "/static/images/avatar/2.jpg"}
              sx={{ width: 44, height: 44, border: '3px solid rgba(255,255,255,0.2)' }}
            />
          </IconButton>
          <Menu
            sx={{ mt: '60px', '& .MuiPaper-root': { backgroundColor: '#fff', color: '#232323', minWidth: 200, borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.13)' } }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            PaperProps={{ sx: { zIndex: 1600 } }}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" sx={{ color: '#BE3124' }} />
              </ListItemIcon>
              Meu Perfil
            </MenuItem>
            <MenuItem onClick={handleSettings}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" sx={{ color: '#BE3124' }} />
              </ListItemIcon>
              Configurações
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: '#BE3124' }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default HorizontalMenu;