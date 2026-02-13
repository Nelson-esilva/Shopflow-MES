import {
  Table,
  TableBody,
  TableContainer,
  Paper,
  Box,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton,
  Avatar,
  Chip,
  Tooltip
} from '@mui/material';
import UserTableHeader from './UserTableHeader';
import UserTableRow from './UserTableRow';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon, Star as StarIcon } from '@mui/icons-material';
import { getRoleDisplay, isSuperAdmin } from '../utils/roleUtils';

function UsersTable({ 
  users, 
  loading, 
  onView, 
  onEdit, 
  onDelete, 
  orderBy, 
  orderDirection, 
  onRequestSort 
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress sx={{ color: '#BE3124' }} />
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 3, color: 'text.secondary' }}>
        <SearchOffIcon sx={{ fontSize: 54, mb: 1, color: '#BE3124', opacity: 0.7 }} />
        <Typography variant="h6" color="text.secondary">
          Nenhum usuário encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Tente ajustar os filtros ou a busca para encontrar outros resultados.
        </Typography>
      </Box>
    );
  }

  if (isMobile) {
    // Layout tipo card para mobile (igual ao padrão dos produtos)
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        {users.map((user) => {
          const roleConfig = getRoleDisplay(user.role, user.email);
          const isSuper = isSuperAdmin(user.email);
          return (
            <Box key={user.id} sx={{
              background: '#fff',
              borderRadius: 2,
              boxShadow: '0 2px 8px 0 rgba(190,49,36,0.07)',
              border: '1px solid #E0E0E0',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography sx={{ fontWeight: 700, color: '#BE3124', fontSize: 16 }}>#{user.id}</Typography>
                <Chip
                  label={roleConfig.label}
                  sx={{
                    backgroundColor: roleConfig.backgroundColor,
                    color: roleConfig.color,
                    fontWeight: 500,
                    height: '24px',
                    '& .MuiChip-label': { px: 1.5, fontSize: '0.85rem' }
                  }}
                />
              </Box>
              <Typography sx={{ fontWeight: 600, color: '#222', fontSize: 17, mb: 0.5 }}>{user.name || user.username || 'N/A'}</Typography>
              <Typography sx={{ color: '#666', fontSize: 15 }}>{user.email || 'N/A'}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                <Tooltip title="Ver detalhes" arrow placement="top">
                  <IconButton onClick={() => onView(user)} size="small" sx={{ color: '#2196F3' }}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar" arrow placement="top">
                  <IconButton onClick={() => onEdit(user)} size="small" sx={{ color: '#FF9800' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Deletar" arrow placement="top">
                  <IconButton onClick={() => onDelete(user)} size="small" sx={{ color: '#BE3124' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }

  // Desktop/tablet: tabela normal
  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
        border: '1px solid #E0E0E0'
      }}
    >
      <Table>
        <UserTableHeader 
          orderBy={orderBy}
          orderDirection={orderDirection}
          onRequestSort={onRequestSort}
        />
        <TableBody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UsersTable; 