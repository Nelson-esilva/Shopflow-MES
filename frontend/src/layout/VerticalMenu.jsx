import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Toolbar,
  Box,
  Divider,
  useMediaQuery
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

// Tamanho do menu deve ser igual ao do HorizontalMenu, caso contrário, o menu não fica responsivo
const drawerWidth = 260;
const collapsedWidth = 64;

const menuItems = [
  { title: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/dashboard' },
  { title: 'Usuários', icon: <PeopleOutlinedIcon />, path: '/usuarios' },
  // { title: 'Dispositivos', icon: <DevicesOutlinedIcon />, path: '/dispositivos' },
  { title: 'Produtos', icon: <Inventory2OutlinedIcon />, path: '/produtos' },
  { title: 'Ordem de Produção', icon: <AssignmentOutlinedIcon />, path: '/ordem-de-producao' },
  { title: 'Plano de Produção', icon: <CalendarMonthOutlinedIcon />, path: '/plano-de-producao' },
  { title: 'Linha de Produção', icon: <FactoryOutlinedIcon />, path: '/linha-de-producao' },
];

const VerticalMenu = ({ open, onToggle, mobileOpen, onMobileToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const drawerContent = (
    <Box sx={{ width: open ? drawerWidth : collapsedWidth, transition: 'width 0.3s', bgcolor: '#222', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center', p: 2 }}>
        {open &&
          <Toolbar sx={{ height: '5px', background: '#', display: 'flex', justifyContent: 'center', mt: 2, ml: -3 }}>
            <Box className='logo-shopflow-redd' sx={{ width: 208, height: 55, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
          </Toolbar>
        }
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mt: -3 }} />
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <Tooltip key={item.title} title={!open && !isMobile ? item.title : ''} placement="right">
            <ListItem disablePadding sx={{ display: 'block', my: 1 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  borderRadius: '8px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                  },
                  '&.Mui-selected': {
                    bgcolor: '#BE3124',
                    color: '#fff',
                    '& .MuiListItemIcon-root': {
                      color: '#fff',
                    },
                  },
                  '&.Mui-selected:hover': {
                    bgcolor: '#a72a1e',
                  },
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  color: 'inherit',
                }}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: 500 }} />}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: '#222',
            color: '#fff',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop: Drawer permanente
  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          bgcolor: '#222',
          color: '#fff',
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default VerticalMenu; 