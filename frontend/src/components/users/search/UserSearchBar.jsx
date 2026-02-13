import { useState } from 'react';
import { TextField, InputAdornment, IconButton, Box, useTheme, useMediaQuery } from '@mui/material';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';

function UserSearchBar({ searchQuery, onSearch, onClear, placeholder }) {
    const [inputValue, setInputValue] = useState(searchQuery || '');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };
  
    const handleSearchClick = () => {
      onSearch(inputValue);
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        onSearch(inputValue);
      }
    };
  
    const handleClear = () => {
      setInputValue('');
      onClear();
    };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: isMobile ? '100%' : 'auto', gap: 1 }}>
      <TextField
        size="small"
        variant="outlined"
        placeholder={placeholder || "Buscar por nome, código ou modelo..."}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <>
              {inputValue && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClear} size="small">
                    <ClearIcon sx={{ color: '#BE3124' }} />
                  </IconButton>
                </InputAdornment>
              )}
            </>
          ),
          sx: {
            backgroundColor: '#fff',
            borderRadius: 1,
            boxShadow: 'none',
            fontSize: isMobile ? 15 : 17,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E0E0E0',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#000',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#BE3124',
            },
            minWidth: isMobile ? 0 : 320,
            height: 45,
            transition: 'min-width 0.3s cubic-bezier(0.4,0,0.2,1)',
            width: isMobile ? '100%' : 'auto',
            px: isMobile ? 0.5 : 2
          }
        }}
        inputProps={{
          style: {
            color: '#333',
            fontWeight: 500,
            fontSize: isMobile ? 15 : 17
          }
        }}
        sx={{
          minWidth: isMobile ? 0 : 400,
          width: isMobile ? '100%' : 'auto',
          borderRadius: 1,
          boxShadow: 'none',
          backgroundColor: '#fff',
          '& .MuiInputBase-input::placeholder': {
            color: '#666',
            opacity: 1,
            fontWeight: 400,
            fontSize: isMobile ? 14 : 16
          },
          transition: 'min-width 0.3s cubic-bezier(0.4,0,0.2,1)',
          fontSize: isMobile ? 15 : 17,
          px: isMobile ? 0.5 : 2
        }}
      />
      <IconButton
        onClick={handleSearchClick}
        size="medium"
        sx={{
          height: 40,
          width: 40,
          backgroundColor: '#BE3124',
          color: '#fff',
          borderRadius: 1,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#8B1E1E',
          }
        }}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
}

export default UserSearchBar; 