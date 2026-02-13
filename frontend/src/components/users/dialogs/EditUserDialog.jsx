import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Avatar,
  Typography,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Edit as EditIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';

function EditUserDialog({ open, onClose, onConfirm, user }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        password: '' // Sempre começa vazio por segurança
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'password') setConfirmPassword('');
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Validação de senha
    if (formData.password && formData.password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      // Remove campos vazios antes de enviar
      const dataToSend = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '')
      );
      await onConfirm(user.id, dataToSend);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Erro ao atualizar usuário');
    } finally {
      setLoading(false);
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
      <form onSubmit={handleSubmit} style={{ height: '100%' }}>
      <DialogTitle sx={{ 
        backgroundColor: '#FFF5F5',
        borderBottom: '1px solid #E2D9D9',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontSize: isMobile ? 18 : 22,
        py: isMobile ? 1.2 : 2,
        px: isMobile ? 2 : 3
      }}>
          <EditIcon sx={{ fontSize: isMobile ? 22 : 28 }} />
          Editar Usuário
        </DialogTitle>
        
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: isMobile ? 1.2 : 3,
            py: isMobile ? 0.5 : 2
          }}>
            <Avatar
              src={user?.picture || user?.avatar}
              alt={user?.name || user?.username}
              sx={{ width: isMobile ? 64 : 80, height: isMobile ? 64 : 80, bgcolor: '#BE3124' }}
            />
            
            <Typography variant="h6" component="div" align="center" sx={{ fontSize: isMobile ? 18 : 22 }}>
              {user?.name}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Nome Completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}
            />

            <TextField
              fullWidth
              label="Usuário"
              name="username"
              value={formData.username}
              onChange={handleChange}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}
            />

            <TextField
              fullWidth
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}
            />

            <TextField
              fullWidth
              label="Nova Senha (opcional)"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              helperText="Se quiser alterar, digite a nova senha."
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}
              InputProps={{
                endAdornment: (
                  <Button onClick={toggleShowPassword} tabIndex={-1} sx={{ minWidth: 0, p: 0 }}>
                    {showPassword ? <VisibilityOffIcon sx={{ color: '#000' }} /> : <VisibilityIcon sx={{ color: '#000' }} />}
                  </Button>
                )
              }}
            />
            {formData.password && (
              <TextField
                fullWidth
                label="Confirmar Nova Senha"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}
                InputProps={{
                  endAdornment: (
                    <Button onClick={toggleShowConfirmPassword} tabIndex={-1} sx={{ minWidth: 0, p: 0 }}>
                      {showConfirmPassword ? <VisibilityOffIcon sx={{ color: '#000' }} /> : <VisibilityIcon sx={{ color: '#000' }} />}
                    </Button>
                  )
                }}
              />
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: isMobile ? 1.2 : 2, borderTop: '1px solid #E2D9D9', gap: isMobile ? 1 : 2 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          sx={{ 
            color: '#666',
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
          Cancelar
        </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ 
              backgroundColor: '#BE3124',
              fontSize: isMobile ? 14 : 16,
              py: isMobile ? 1 : 1.5,
              px: isMobile ? 1.5 : 2.5,
              borderRadius: 2,
              minWidth: isMobile ? 110 : 140,
              '&:hover': {
                backgroundColor: '#a3291f'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={isMobile ? 20 : 24} color="inherit" />
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditUserDialog; 