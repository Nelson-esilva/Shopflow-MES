// This component renders an editable information box, handling display, input, and actions (edit, save, cancel) for various fields, including automatic formatting for phone and CPF.
import React, { memo } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { formatPhoneNumber, formatCpf } from '../../service/formatters';

const EditableInfoBox = memo(({ label, fieldName, value, type = "text", readOnly = false,
  editingField, editedData, setEditedData, handleEditClick, handleSaveClick, handleCancelClick, loading }) => {

  const isCurrentFieldBeingEdited = editingField === fieldName && !readOnly;

  const handleChange = (e) => {
    let newValue = e.target.value;
    if (fieldName === 'phone') {
      newValue = formatPhoneNumber(newValue);
    } else if (fieldName === 'cpf') {
      newValue = formatCpf(newValue);
    }
    setEditedData(prevData => ({
      ...prevData,
      [fieldName]: newValue
    }));
  };

  let displayValue = value;
  if (fieldName === 'phone') {
    displayValue = formatPhoneNumber(value);
  } else if (fieldName === 'cpf') {
    displayValue = formatCpf(value);
  }

  const getInputProps = () => {
    if (fieldName === 'phone') {
      return { maxLength: 15, inputMode: 'numeric', pattern: '[0-9]*' };
    }
    if (fieldName === 'cpf') {
      return { maxLength: 14, inputMode: 'numeric', pattern: '[0-9]*' };
    }
    return {};
  };

  return (
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
          {label}
        </Typography>
        {isCurrentFieldBeingEdited ? (
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={editedData[fieldName] || ''}
            onChange={handleChange}
            type={type}
            inputProps={getInputProps()}
            sx={{ maxWidth: 'calc(100% - 48px)' }}
          />
        ) : (
          <Typography variant="body1" sx={{ fontWeight: 'medium', wordBreak: 'break-word' }}>
            {displayValue || 'N/A'}
          </Typography>
        )}
      </Box>
      <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
        {isCurrentFieldBeingEdited ? (
          <>
            <IconButton
              color="primary"
              onClick={handleSaveClick}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
            </IconButton>
            <IconButton
              color="error"
              onClick={handleCancelClick}
              disabled={loading}
            >
              <CloseIcon />
            </IconButton>
          </>
        ) : (
          !readOnly && (
            <IconButton
              onClick={() => handleEditClick(fieldName)}
              aria-label={`Editar ${label}`}
            >
              <EditIcon />
            </IconButton>
          )
        )}
      </Box>
    </Box>
  );
});

export default EditableInfoBox;