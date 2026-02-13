// src/profile/ProfilePage.jsx
import React, { useState, useEffect, memo } from 'react';
import DesignerLayout from '../layout/DesignerLayout'; // Path to DesignerLayout
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  TextField, // Mantido para os campos de senha
  IconButton, // Mantido para os botões de editar/salvar/cancelar da senha
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

// IMPORTANT: Adjust this import path to your profileService.js
import profileService from '../components/profile/service/profileService.js'; 

// --- Component EditableInfoBox (Memoized for performance) ---
import EditableInfoBox from '../components/profile/components/EditableInfoBox/EditableInfoBox.jsx'; 


function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null); // Para campos gerais
  const [editedData, setEditedData] = useState({}); // Para campos gerais

  // Estados para a mudança de senha
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Estados para o Snackbar de feedback
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const labelMap = {
    name: 'Nome Completo',
    email: 'Email',
    phone: 'Telefone',
    address: 'Endereço',
    role_display: 'Cargo',
    cpf: 'CPF',
    // 'password' é agora gerenciado internamente, não precisa de label para EditableInfoBox
    username: 'Nome de Usuário' 
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getMe();
      setUserData(data);
      setEditedData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        role_display: Array.isArray(data.job_title) ? data.job_title[0] : data.job_title || data.role_display || '',
        email: data.email || '',
        cpf: data.cpf || '',
        username: data.username || '',
      });
      // Resetar campos de senha ao carregar dados do usuário
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setIsEditingPassword(false);
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
      setError("Não foi possível carregar as informações do perfil. Tente novamente mais tarde.");
      setSnackbarMessage("Não foi possível carregar as informações do perfil. 😟");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Empty dependency array means it runs once on mount

  // --- Funções para Edição de Campos Gerais ---
  const handleEditClick = (fieldName) => {
    setEditingField(fieldName);
  };

  const handleCancelClick = () => {
    const originalValue = editingField === 'role_display'
                          ? (Array.isArray(userData.job_title) ? userData.job_title[0] : userData.job_title || userData.role_display || '')
                          : userData[editingField] || '';
        
    setEditedData(prevData => ({
      ...prevData,
      [editingField]: originalValue
    }));
    setEditingField(null);
  };

  const handleSaveClick = async () => {
    setLoading(true);
    try {
      const dataToUpdate = {
        name: editedData.name,
        phone: editedData.phone,
        address: editedData.address,
        job_title: editedData.role_display,
        email: editedData.email,
        cpf: editedData.cpf,
        username: editedData.username,
      };

      Object.keys(dataToUpdate).forEach(key => {
        if (dataToUpdate[key] === undefined || dataToUpdate[key] === null || dataToUpdate[key] === '') {
          delete dataToUpdate[key];
        }
      });
            
      if (Array.isArray(dataToUpdate.job_title)) {
        dataToUpdate.job_title = dataToUpdate.job_title[0];
      }

      console.log('Dados a serem enviados para o backend (updateMe):', dataToUpdate);
      const updatedUserResponse = await profileService.updateMe(dataToUpdate);
      
      setUserData(updatedUserResponse);
      setEditedData({
        name: updatedUserResponse.name || '',
        phone: updatedUserResponse.phone || '',
        address: updatedUserResponse.address || '',
        role_display: Array.isArray(updatedUserResponse.job_title)
                      ? updatedUserResponse.job_title[0]
                      : updatedUserResponse.job_title || updatedUserResponse.role_display || '',
        email: updatedUserResponse.email || '',
        cpf: updatedUserResponse.cpf || '',
        username: updatedUserResponse.username || '',
      });
      setEditingField(null);
      setSnackbarMessage(`${labelMap[editingField] || 'Perfil'} atualizado com sucesso! 🎉`);
      setSnackbarSeverity('success');
    } catch (err) {
      console.error("Erro ao salvar dados do usuário:", err.response?.data || err.message);
      const backendErrorMessage = err.response?.data?.message || err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message;
      setSnackbarMessage(`Erro ao atualizar o perfil: ${backendErrorMessage}. 😟`);
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  // --- Funções para Mudança de Senha ---
  const handleEditPasswordClick = () => {
    setIsEditingPassword(true);
  };

  const handleCancelPasswordClick = () => {
    setIsEditingPassword(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleSavePasswordClick = async () => {
    // Validação adicionada para garantir que todos os campos de senha estejam preenchidos
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setSnackbarMessage("Por favor, preencha todos os campos de senha.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return; // Interrompe a função se algum campo estiver vazio
    }

    if (newPassword !== confirmNewPassword) {
      setSnackbarMessage("As novas senhas não coincidem.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      await profileService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword, // Alterado de 'confirm_password' para 'confirm_new_password'
      });
      setSnackbarMessage("Senha atualizada com sucesso! 🎉");
      setSnackbarSeverity('success');
      handleCancelPasswordClick(); // Reseta os campos e sai do modo de edição
    } catch (err) {
      console.error("Erro ao mudar a senha:", err.response?.data || err.message);
      const backendErrorMessage = err.response?.data?.message || err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message;
      setSnackbarMessage(`Erro ao atualizar a senha: ${backendErrorMessage}. 😟`);
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  // --- Função para Fechar Snackbar ---
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Extrai a primeira letra do email para exibir no avatar
  const emailInitial = userData?.email ? userData.email.charAt(0).toUpperCase() : '';

  if (loading && !userData) {
    return (
      <DesignerLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Carregando perfil...</Typography>
        </Box>
      </DesignerLayout>
    );
  }

  if (error) {
    return (
      <DesignerLayout>
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </DesignerLayout>
    );
  }

  if (!userData) {
    return (
      <DesignerLayout>
        <Box sx={{ p: 2 }}>
          <Alert severity="info">Nenhum dado de perfil encontrado.</Alert>
        </Box>
      </DesignerLayout>
    );
  }

  return (
    <>
      <DesignerLayout>
        <Box sx={{ p: 2 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 4
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(190, 49, 36, 0.08)',
              color: '#BE3124',
              boxShadow: '0 2px 8px rgba(190, 49, 36, 0.1)',
              fontSize: '3rem',
              fontWeight: 'bold',
            }}>
              {emailInitial}
            </Box>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  color: '#000',
                  fontWeight: 'bold',
                  letterSpacing: '-0.5px',
                  mb: 0.5
                }}
              >
                Olá, {userData.name}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  fontSize: '1rem',
                  fontWeight: 400
                }}
              >
                Gerencie suas informações pessoais.
              </Typography>
            </Box>
          </Box>

          <Box sx={{
            p: 3,
            bgcolor: '#f5f5f5',
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Detalhes Pessoais
            </Typography>

            {/* Campos gerais do perfil usando EditableInfoBox */}
            <EditableInfoBox
              key="name"
              label="Nome Completo"
              fieldName="name"
              value={userData.name}
              editingField={editingField}
              editedData={editedData}
              setEditedData={setEditedData}
              handleEditClick={handleEditClick}
              handleSaveClick={handleSaveClick}
              handleCancelClick={handleCancelClick}
              loading={loading}
            />
            <EditableInfoBox
              key="email"
              label="Email"
              fieldName="email"
              value={userData.email}
              type="email"
              editingField={editingField}
              editedData={editedData}
              setEditedData={setEditedData}
              handleEditClick={handleEditClick}
              handleSaveClick={handleSaveClick}
              handleCancelClick={handleCancelClick}
              loading={loading}
            />
            <EditableInfoBox
              key="phone"
              label="Telefone"
              fieldName="phone"
              value={userData.phone}
              editingField={editingField}
              editedData={editedData}
              setEditedData={setEditedData}
              handleEditClick={handleEditClick}
              handleSaveClick={handleSaveClick}
              handleCancelClick={handleCancelClick}
              loading={loading}
            />
            <EditableInfoBox
              key="address"
              label="Endereço"
              fieldName="address"
              value={userData.address}
              editingField={editingField}
              editedData={editedData}
              setEditedData={setEditedData}
              handleEditClick={handleEditClick}
              handleSaveClick={handleSaveClick}
              handleCancelClick={handleCancelClick}
              loading={loading}
            />
            <EditableInfoBox
              key="cpf"
              label="CPF"
              fieldName="cpf"
              value={userData.cpf}
              type="text"
              readOnly={true}
              editingField={editingField}
              editedData={editedData}
              setEditedData={setEditedData}
              handleEditClick={handleEditClick}
              handleSaveClick={handleSaveClick}
              handleCancelClick={handleCancelClick}
              loading={loading}
            />
            <EditableInfoBox
              key="role_display"
              label="Cargo"
              fieldName="role_display"
              value={Array.isArray(userData.job_title) ? userData.job_title[0] : userData.job_title || userData.role_display || ''}
              readOnly={true}
              editingField={editingField}
              editedData={editedData}
              setEditedData={setEditedData}
              handleEditClick={handleEditClick}
              handleSaveClick={handleSaveClick}
              handleCancelClick={handleCancelClick}
              loading={loading}
            />
            
            {/* Seção de Mudança de Senha - Integrada diretamente aqui */}
            <Box sx={{
              p: 2,
              bgcolor: '#fff',
              borderRadius: 1,
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                  Senha
                </Typography>
                {isEditingPassword ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                    <TextField
                      fullWidth
                      label="Senha Antiga"
                      type="password"
                      variant="outlined"
                      size="small"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      disabled={loading}
                    />
                    <TextField
                      fullWidth
                      label="Nova Senha"
                      type="password"
                      variant="outlined"
                      size="small"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                    />
                    <TextField
                      fullWidth
                      label="Confirmar Nova Senha"
                      type="password"
                      variant="outlined"
                      size="small"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      disabled={loading}
                    />
                  </Box>
                ) : (
                  <Typography variant="body1" sx={{ fontWeight: 'medium', wordBreak: 'break-word' }}>
                    ********
                  </Typography>
                )}
              </Box>
              <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                {isEditingPassword ? (
                  <>
                    <IconButton
                      color="primary"
                      onClick={handleSavePasswordClick}
                      disabled={loading || !oldPassword || !newPassword || !confirmNewPassword}
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={handleCancelPasswordClick}
                      disabled={loading}
                    >
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton
                    onClick={handleEditPasswordClick}
                    aria-label="Alterar Senha"
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </Box>
            </Box>

          </Box>
        </Box>
      </DesignerLayout>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProfilePage;
