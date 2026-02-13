import { Popover, Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const LINE_STATUS = [
  { value: 'active', label: 'Operacional' },
  { value: 'inactive', label: 'Parada' },
  { value: 'maintenance', label: 'Em Manutenção' }
];

function LineFilterDialog({ anchorEl, open, onClose, onApply, onClear, initialFilters }) {
  const [filters, setFilters] = useState(initialFilters || { status: [], name: '', location: '' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
  };

  const handleClear = () => {
    setFilters({ status: [], name: '', location: '' });
    onClear && onClear();
  };

  const selectMenuProps = {
    PaperProps: {
      sx: {
        boxShadow: 3,
        '& .MuiMenuItem-root.Mui-selected, & .MuiMenuItem-root.Mui-selected:hover': {
          backgroundColor: '#fff',
        },
      },
    },
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'center', horizontal: isMobile ? 'center' : 'right' }}
      transformOrigin={{ vertical: 'center', horizontal: isMobile ? 'center' : 'left' }}
      PaperProps={{
        sx: {
          p: isMobile ? 1.5 : 2,
          borderRadius: 2,
          width: isMobile ? '98vw' : '100%',
          maxWidth: 600,
          boxShadow: 3,
          ml: isMobile ? 0 : 2
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1.5 : 2, width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? 1 : 2, flexWrap: isMobile ? 'nowrap' : 'wrap', width: '100%' }}>
          <FormControl size="small" fullWidth={isMobile} sx={{ flex: 1 }}>
            <InputLabel sx={{ background: '#fff', px: 0.5, color: '#000', fontWeight: 500, '&.Mui-focused': { color: '#000' } }}>Status</InputLabel>
            <Select
              multiple
              value={filters.status}
              onChange={handleStatusChange}
              renderValue={(selected) => selected.map(val => LINE_STATUS.find(t => t.value === val)?.label || val).join(', ')}
              MenuProps={selectMenuProps}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E0E0E0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#BE3124',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#BE3124',
                },
              }}
            >
              {LINE_STATUS.map(type => (
                <MenuItem key={type.value} value={type.value}>
                  <Checkbox checked={filters.status.indexOf(type.value) > -1} sx={{ color: '#BE3124', '&.Mui-checked': { color: '#BE3124' } }} />
                  <ListItemText primary={type.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Nome da Linha"
            name="name"
            value={filters.name}
            onChange={handleChange}
            size="small"
            fullWidth={isMobile}
            InputLabelProps={{ sx: { color: '#000', fontWeight: 500, '&.Mui-focused': { color: '#000' } } }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Localização"
            name="location"
            value={filters.location}
            onChange={handleChange}
            size="small"
            fullWidth={isMobile}
            InputLabelProps={{ sx: { color: '#000', fontWeight: 500, '&.Mui-focused': { color: '#000' } } }}
            sx={{ flex: 1 }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 2, justifyContent: isMobile ? 'stretch' : 'flex-end', mt: 2 }}>
          <Button
            onClick={handleClear}
            size="small"
            fullWidth={isMobile}
            sx={{
              color: '#BE3124',
              background: '#fff',
              border: '1.5px solid #BE3124',
              fontWeight: 700,
              borderRadius: 4,
              px: 1.5,
              py: 0.5,
              minWidth: 0,
              minHeight: 0,
              boxShadow: '0 1px 4px 0 rgba(190,49,36,0.07)',
              transition: 'background 0.2s, color 0.2s',
              '&:hover': {
                background: '#fff',
                borderColor: '#8B1E1E',
                color: '#000',
              },
            }}
          >
            Limpar Filtros
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<SearchIcon />}
            onClick={() => onApply(filters)}
            fullWidth={isMobile}
            sx={{
              background: '#BE3124',
              color: '#fff',
              fontWeight: 900,
              borderRadius: 4,
              px: 2,
              py: 0.5,
              minWidth: 0,
              minHeight: 0,
              boxShadow: 'none',
              fontSize: '0.95rem',
              letterSpacing: 0.5,
              transition: 'background 0.2s',
              '&:hover': {
                background: '#8B1E1E',
                boxShadow: 'none',
                color: '#fff',
              },
            }}
          >
            Buscar
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}

export default LineFilterDialog; 