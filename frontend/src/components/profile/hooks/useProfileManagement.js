// This custom hook manages the state and logic for fetching, editing, and saving user profile data, including handling loading states, errors, and form data, with integrated phone and CPF formatting.
import { useState, useEffect, useCallback } from 'react';
import profileService from '../service/profileService'; 
import { formatPhoneNumber, cleanPhoneNumber, formatCpf, cleanCpf } from '../service/formatters';

const labelMap = {
  name: 'Full Name',
  email: 'Email',
  phone: 'Phone',
  address: 'Address',
  role_display: 'Role',
  cpf: 'CPF',
  password: 'Password'
};

const useProfileManagement = (showSnackbar) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editedData, setEditedData] = useState({});

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getMe();
      setUserData(data);

      setEditedData({
        name: data.name || '',
        phone: formatPhoneNumber(data.phone) || '',
        address: data.address || '',
        role_display: Array.isArray(data.job_title) ? data.job_title[0] : data.job_title || data.role_display || '',
        email: data.email || '',
        cpf: formatCpf(data.cpf) || '',
        password: '',
      });
    } catch (err) {
      console.error("Error loading user data:", err);
      setError("Could not load profile information. Please try again later.");
      showSnackbar("Could not load profile information.", 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleEditClick = useCallback((fieldName) => {
    setEditingField(fieldName);
  }, []);

  const handleCancelClick = useCallback(() => {
    const originalValue = editingField === 'role_display'
                          ? (Array.isArray(userData.job_title) ? userData.job_title[0] : userData.job_title || userData.role_display || '')
                          : userData[editingField] || '';
    
    setEditedData(prevData => ({
      ...prevData,
      [editingField]: editingField === 'password'
                      ? ''
                      : (editingField === 'phone'
                         ? formatPhoneNumber(originalValue)
                         : (editingField === 'cpf' ? formatCpf(originalValue) : originalValue))
    }));
    setEditingField(null);
  }, [editingField, userData]);

  const handleSaveClick = useCallback(async () => {
    setLoading(true);
    try {
      const dataToUpdate = {
        name: editedData.name,
        phone: cleanPhoneNumber(editedData.phone),
        address: editedData.address,
        job_title: editedData.role_display,
        email: editedData.email,
        cpf: cleanCpf(editedData.cpf),
        password: editedData.password,
      };

      Object.keys(dataToUpdate).forEach(key => {
        if (dataToUpdate[key] === undefined || dataToUpdate[key] === null || dataToUpdate[key] === '') {
          delete dataToUpdate[key];
        }
      });
      
      if (Array.isArray(dataToUpdate.job_title)) {
        dataToUpdate.job_title = dataToUpdate.job_title[0];
      }

      const updatedUserResponse = await profileService.updateMe(dataToUpdate);

      setUserData(updatedUserResponse);

      setEditedData({
        name: updatedUserResponse.name || '',
        phone: formatPhoneNumber(updatedUserResponse.phone) || '',
        address: updatedUserResponse.address || '',
        role_display: Array.isArray(updatedUserResponse.job_title)
                      ? updatedUserResponse.job_title[0]
                      : updatedUserResponse.job_title || updatedUserResponse.role_display || '',
        email: updatedUserResponse.email || '',
        cpf: formatCpf(updatedUserResponse.cpf) || '',
        password: '',
      });

      setEditingField(null);
      showSnackbar(`${labelMap[editingField] || 'Profile'} updated successfully! 🎉`, 'success');
    } catch (err) {
      console.error("Error saving user data:", err.response?.data || err.message);
      const backendErrorMessage = err.response?.data?.message || err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message;
      showSnackbar(`Error updating profile: ${backendErrorMessage}. 😟`, 'error');
    } finally {
      setLoading(false);
    }
  }, [editedData, editingField, showSnackbar, userData]);

  return {
    userData,
    loading,
    error,
    editingField,
    editedData,
    setEditedData,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    labelMap,
    emailInitial: userData?.email ? userData.email.charAt(0).toUpperCase() : '',
  };
};

export default useProfileManagement;