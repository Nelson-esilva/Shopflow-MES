import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  PersonAdd as PersonAddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { getAvailableRoles } from '../utils/roleUtils';

function CreateUserDialog({ open, onClose, onConfirm }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    cpf: '',
    phone: '',
    address: '',
    job_title: '',
    role: 'operator',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPhoneNumber = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    const limitedNumbers = numbers.slice(0, 11);
    
    // Formata o número
    if (limitedNumbers.length <= 2) {
      return `(${limitedNumbers}`;
    } else if (limitedNumbers.length <= 6) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else if (limitedNumbers.length <= 10) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
    } else {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  const handlePhoneChange = (event) => {
    const { value } = event.target;
    const formattedValue = formatPhoneNumber(value);
    
    setFormData(prev => ({
      ...prev,
      phone: formattedValue
    }));
  };

  const handleCpfChange = (event) => {
    let value = event.target.value.replace(/\D/g, ''); // Remove tudo que não for número
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
    setFormData(prev => ({
      ...prev,
      cpf: value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'name', 'email', 'username'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
    
    if (missingFields.length > 0) {
      const fieldNames = {
        name: 'Nome',
        email: 'Email',
        username: 'Nome de Usuário',
      };
      
      const missingFieldNames = missingFields.map(field => fieldNames[field]).join(', ');
      setError(`Campos obrigatórios: ${missingFieldNames}`);
      return false;
    }
    
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    
    if (formData.password && formData.password.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Remove o campo confirmPassword antes de enviar
      const { confirmPassword, ...userData } = formData;
      
      // Log para debug - verificar dados antes de enviar
      console.log('Dados do formulário antes de enviar:', userData);
      
      await onConfirm(userData);
      setFormData({
        name: '',
        email: '',
        username: '',
        cpf: '',
        phone: '',
        address: '',
        job_title: '',
        role: 'operator',
        password: '',
        confirmPassword: ''
      });
      onClose();
    } catch (err) {
      console.error('Erro no diálogo de criação:', err);
      setError(err.response?.data?.detail || err.message || 'Erro ao criar usuário');
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
          <PersonAddIcon sx={{ fontSize: isMobile ? 22 : 28 }} />
          Novo Usuário
        </DialogTitle>
        
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: isMobile ? 1.2 : 2,
            py: isMobile ? 0.5 : 2
          }}>
            <Alert severity="info" sx={{ mb: isMobile ? 1 : 2, fontSize: isMobile ? 13 : 15, fontWeight: 500 }}>
              Os campos <b>Nome completo</b>, <b>Email</b>, <b>Nome de usuário</b> e <b>Senha</b> são obrigatórios.
            </Alert>
            {error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            )}
            {/* Ordem dos campos conforme solicitado */}
            <TextField
              fullWidth
              required
              label="Seu nome completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!error && !formData.name}
              helperText={!formData.name && error ? 'Nome é obrigatório' : ''}
              sx={{ '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}
            />
            <TextField
              fullWidth
              required
              label="Seu nome de usuário"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!error && !formData.username}
              helperText={!formData.username && error ? 'Nome de usuário é obrigatório' : ''}
              sx={{ '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}
            />
            <TextField
              fullWidth
              required
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!error && !formData.email}
              helperText={!formData.email && error ? 'Email é obrigatório' : ''}
              sx={{ '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}
            />
            <TextField
              fullWidth
              label="CPF"
              name="cpf"
              value={formData.cpf || ''}
              onChange={handleCpfChange}
              inputProps={{ maxLength: 11, inputMode: 'numeric', pattern: '[0-9]*' }}
              error={!!formData.cpf && formData.cpf.length !== 11}
              helperText={formData.cpf && formData.cpf.length !== 11 ? 'CPF deve ter exatamente 11 dígitos' : ''}
              sx={{ '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}
            />
            <TextField
              fullWidth
              label="Telefone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              sx={{ '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}
            />
            <TextField
              fullWidth
              label="Endereço"
              name="address"
              value={formData.address}
              onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}
            />
            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}>
              <InputLabel>Função</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Função"
                sx={{ fontSize: isMobile ? 14 : 16 }}
              >
                {getAvailableRoles().map((role) => (
                  <MenuItem key={role.value} value={role.value} sx={{ fontSize: isMobile ? 14 : 16 }}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Cargo"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}
            />
            <TextField
              fullWidth
              label="Senha *"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOffIcon sx={{ color: '#000' }} /> : <VisibilityIcon sx={{ color: '#000' }} />}
                  </IconButton>
                )
              }}
            />
            <TextField
              fullWidth
              label="Confirmar Senha *"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              sx={{ '& .MuiOutlinedInput-root': { height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 } }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                    {showConfirmPassword ? <VisibilityOffIcon sx={{ color: '#000' }} /> : <VisibilityIcon sx={{ color: '#000' }} />}
                  </IconButton>
                )
              }}
            />
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
              'Criar Usuário'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateUserDialog; 