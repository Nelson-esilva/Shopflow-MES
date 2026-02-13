import {
  TableRow,
  TableCell,
  Avatar,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Chip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { getRoleDisplay, isSuperAdmin } from '../utils/roleUtils';

function UserTableRow({ user, onView, onEdit, onDelete }) {
  // Obter configuração da role com destaque para super usuário
  const roleConfig = getRoleDisplay(user.role, user.email);
  const isSuper = isSuperAdmin(user.email);

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
      {/* ID */}
      <TableCell sx={{ color: '#666' }}>
        {user.id}
      </TableCell>
      
      {/* Nome */}
      <TableCell sx={{ color: '#333', fontWeight: 500 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={user.picture || user.avatar}
              alt={user.name || user.username}
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: roleConfig.color,
                fontSize: '0.75rem'
              }}
            >
              {(user.name || user.username || '').charAt(0).toUpperCase()}
            </Avatar>
            {isSuper && (
              <StarIcon 
                sx={{ 
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  fontSize: 16,
                  color: '#FFD700',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                }} 
              />
            )}
          </Box>
          <Typography variant="body2" fontWeight="medium">
            {user.name || user.username || 'N/A'}
          </Typography>
        </Box>
      </TableCell>
      
      {/* Email */}
      <TableCell sx={{ color: '#666' }}>
        {user.email || 'N/A'}
      </TableCell>
      
      {/* Função */}
      <TableCell align="center">
        <Chip
          label={roleConfig.label}
          sx={{
            backgroundColor: roleConfig.backgroundColor,
            color: roleConfig.color,
            fontWeight: 500,
            height: '24px',
            '& .MuiChip-label': {
              px: 1.5,
              fontSize: '0.875rem'
            }
          }}
        />
      </TableCell>
      
      {/* Ações */}
      <TableCell align="center">
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title="Ver detalhes" arrow placement="top">
            <IconButton
              onClick={() => onView(user)}
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
              onClick={() => onEdit(user)}
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
              onClick={() => onDelete(user)}
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
}

export default UserTableRow; 