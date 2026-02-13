import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Chip,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  AssignmentInd as AssignmentIndIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Fingerprint as FingerprintIcon,
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import { getRoleDisplay } from '../utils/roleUtils';

function ViewUserDialog({ open, onClose, user }) {
  if (!user) return null;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Obter configuração da role
  const roleConfig = getRoleDisplay(user.role);

  // Função para formatar telefone (padrão (99) 99999-9999)
  const formatPhone = (phone) => {
    if (!phone) return 'Não informado';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  // Função para formatar CPF (padrão 999.999.999-99)
  const formatCpf = (cpf) => {
    if (!cpf) return 'Não informado';
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
    }
    return cpf;
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="view-dialog-title"
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isMobile ? 0 : '10px',
          m: isMobile ? 0 : undefined,
          width: isMobile ? '100vw' : undefined,
          minHeight: isMobile ? '100vh' : undefined,
        }
      }}
    >
      <DialogTitle
        id="view-dialog-title"
        sx={{
          backgroundColor: '#FFF5F5',
          borderBottom: '1px solid #E2D9D9',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: isMobile ? 18 : 22,
          py: isMobile ? 1.2 : 2,
          px: isMobile ? 2 : 3
        }}
      >
        <VisibilityIcon sx={{ fontSize: isMobile ? 22 : 28 }} />
        Detalhes do Usuário
      </DialogTitle>
      <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: isMobile ? 2 : 3,
          py: isMobile ? 1 : 2
        }}>
          {/* Header com Avatar e Nome */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? 1.2 : 2 }}>
            <Avatar
              src={user?.picture || user?.avatar}
              alt={user?.name || user?.username}
              sx={{ 
                width: isMobile ? 64 : 100, 
                height: isMobile ? 64 : 100, 
                bgcolor: roleConfig.color,
                fontSize: isMobile ? '1.3rem' : '2rem'
              }}
            >
              {(user?.name || user?.username || '').charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" component="div" align="center" fontWeight="bold" sx={{ fontSize: isMobile ? 18 : 24 }}>
              {user?.name || user?.username}
            </Typography>
            <Chip
              label={roleConfig.label}
              sx={{
                backgroundColor: roleConfig.backgroundColor,
                color: roleConfig.color,
                fontWeight: 600,
                height: isMobile ? '22px' : '28px',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                '& .MuiChip-label': {
                  px: isMobile ? 1.2 : 2
                }
              }}
            />
          </Box>

          <Divider sx={{ width: '100%', my: isMobile ? 1.5 : 2 }} />

          {/* Informações Detalhadas */}
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ mb: isMobile ? 2 : 3, color: '#333', fontWeight: 600, fontSize: isMobile ? 16 : 20 }}>
              Informações Pessoais
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 1.5 : 3 }}>
              {/* ID */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontSize: isMobile ? 13 : 15, display: 'flex', alignItems: 'center', gap: 0.7 }}>
                  <FingerprintIcon sx={{ fontSize: isMobile ? 15 : 18 }} />
                  ID do Usuário
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: isMobile ? 14 : 16 }}>
                  #{user.id}
                </Typography>
              </Box>

              {/* Nome completo */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontSize: isMobile ? 13 : 15, display: 'flex', alignItems: 'center', gap: 0.7 }}>
                  <PersonIcon sx={{ fontSize: isMobile ? 15 : 18 }} />
                  Nome completo
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: isMobile ? 14 : 16 }}>
                  {user.name || 'Não informado'}
                </Typography>
              </Box>

              {/* Nome de usuário */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontSize: isMobile ? 13 : 15, display: 'flex', alignItems: 'center', gap: 0.7 }}>
                  <AssignmentIndIcon sx={{ fontSize: isMobile ? 15 : 18 }} />
                  Nome de usuário
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: isMobile ? 14 : 16 }}>
                  {user.username || 'Não informado'}
                </Typography>
              </Box>

              {/* Email */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontSize: isMobile ? 13 : 15, display: 'flex', alignItems: 'center', gap: 0.7 }}>
                  <EmailIcon sx={{ fontSize: isMobile ? 15 : 18 }} />
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: isMobile ? 14 : 16 }}>
                  {user.email || 'Não informado'}
                </Typography>
              </Box>

              {/* CPF */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontSize: isMobile ? 13 : 15, display: 'flex', alignItems: 'center', gap: 0.7 }}>
                  <BadgeIcon sx={{ fontSize: isMobile ? 15 : 18 }} />
                  CPF
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: isMobile ? 14 : 16 }}>
                  {formatCpf(user.cpf)}
                </Typography>
              </Box>

              {/* Telefone */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.7, fontSize: isMobile ? 13 : 15 }}>
                  <PhoneIcon sx={{ fontSize: isMobile ? 15 : 18 }} />
                  Telefone
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: isMobile ? 14 : 16 }}>
                  {formatPhone(user.phone)}
                </Typography>
              </Box>

              {/* Endereço */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.7, fontSize: isMobile ? 13 : 15 }}>
                  <LocationIcon sx={{ fontSize: isMobile ? 15 : 18 }} />
                  Endereço
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: isMobile ? 14 : 16 }}>
                  {user.address || 'Não informado'}
                </Typography>
              </Box>

              {/* Cargo na empresa */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.7, fontSize: isMobile ? 13 : 15 }}>
                  <WorkIcon sx={{ fontSize: isMobile ? 15 : 18 }} />
                  Cargo na empresa
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: isMobile ? 14 : 16 }}>
                  {user.job_title || 'Não informado'}
                </Typography>
              </Box>

              {/* Cargo no sistema */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.7, fontSize: isMobile ? 13 : 15 }}>
                  <VerifiedUserIcon sx={{ fontSize: isMobile ? 15 : 18 }} />
                  Cargo no sistema
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: isMobile ? 14 : 16 }}>
                  {getRoleDisplay(user.role).label || 'Não informado'}
                </Typography>
              </Box>

              {/* Status */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontSize: isMobile ? 13 : 15 }}>
                  Status da Conta
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {user.is_active ? (
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: isMobile ? 16 : 20 }} />
                  ) : (
                    <CancelIcon sx={{ color: '#f44336', fontSize: isMobile ? 16 : 20 }} />
                  )}
                  <Typography variant="body1" sx={{ fontWeight: 500, color: user.is_active ? '#4caf50' : '#f44336', fontSize: isMobile ? 14 : 16 }}>
                    {user.is_active ? 'Ativo' : 'Inativo'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ width: '100%', my: isMobile ? 2 : 3 }} />

            {/* Informações do Sistema */}
            <Typography variant="h6" sx={{ mb: isMobile ? 2 : 3, color: '#333', fontWeight: 600, fontSize: isMobile ? 16 : 20 }}>
              Informações do Sistema
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 1.5 : 3 }}>
              {/* Último Acesso */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: isMobile ? 13 : 15 }}>
                  <AccessTimeIcon sx={{ fontSize: isMobile ? 14 : 16 }} />
                  Último Acesso
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: isMobile ? 14 : 16 }}>
                  {formatDate(user.last_access)}
                </Typography>
              </Box>

              {/* Role Display (se disponível) */}
              {user.role_display && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontSize: isMobile ? 13 : 15, display: 'flex', alignItems: 'center', gap: 0.7 }}>
                    <VerifiedUserIcon sx={{ fontSize: isMobile ? 15 : 18 }} />
                    Cargo no sistema
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontSize: isMobile ? 14 : 16 }}>
                    {getRoleDisplay(user.role).label || 'Não informado'}
                  </Typography>
                </Box>
              )}

              {/* Data de Criação */}
              {user.created_at && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontSize: isMobile ? 13 : 15 }}>
                    Data de Criação
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontSize: isMobile ? 14 : 16 }}>
                    {formatDate(user.created_at)}
                  </Typography>
                </Box>
              )}

              {/* Data de Atualização */}
              {user.updated_at && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontSize: isMobile ? 13 : 15 }}>
                    Última Atualização
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontSize: isMobile ? 14 : 16 }}>
                    {formatDate(user.updated_at)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: isMobile ? 1.2 : 2, borderTop: '1px solid #E2D9D9', gap: isMobile ? 1 : 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#666',
            backgroundColor: 'transparent',
            fontSize: isMobile ? 14 : 16,
            py: isMobile ? 1 : 1.5,
            px: isMobile ? 1.5 : 2.5,
            borderRadius: 2,
            minWidth: isMobile ? 90 : 120,
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
}

export default ViewUserDialog; 