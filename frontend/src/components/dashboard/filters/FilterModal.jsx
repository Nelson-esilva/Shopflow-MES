import React, { useState } from 'react';
import { Modal, Box, Typography, Button, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#fff',
  borderRadius: 5,
  boxShadow: '0 8px 32px 0 rgba(190,49,36,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.04)',
  p: 4,
  outline: 'none',
  border: '1.5px solid #F0EAEA',
};

const FilterModal = ({ open, onClose, onSelectDate, onSelectToday }) => {
  const today = dayjs().startOf('day');
  const [selectedDate, setSelectedDate] = useState(today);
  const [loading, setLoading] = useState(false);

  const handleApply = () => {
    setLoading(true);
    onSelectDate(selectedDate);
    setTimeout(() => {
      setLoading(false);
    onClose();
      window.location.reload();
    }, 1000);
  };

  const handleToday = () => {
    setSelectedDate(today);
    if (onSelectToday) onSelectToday(today);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon sx={{ color: '#BE3124', fontSize: 28 }} />
          <Typography variant="h6" fontWeight={900} sx={{ letterSpacing: 1, color: '#BE3124' }}>Filtrar por Dia</Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#888' }}><CloseIcon /></IconButton>
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <DatePicker
            label="Selecione o dia"
            value={selectedDate}
            onChange={setSelectedDate}
            sx={{ width: '100%', mb: 2, background: '#f7f7fa', borderRadius: 2, p: 1, boxShadow: '0 1px 4px #eee' }}
            slotProps={{ textField: { fullWidth: true, variant: 'outlined', size: 'medium' } }}
          />
        </LocalizationProvider>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="outlined"
            color="inherit"
          onClick={handleToday}
          fullWidth
            sx={{ fontWeight: 700, borderRadius: 2, fontSize: 16, borderWidth: 2, color: '#555', borderColor: '#ccc' }}
        >
          Hoje
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleApply}
          fullWidth
            disabled={loading}
            sx={{ fontWeight: 700, borderRadius: 2, fontSize: 16, boxShadow: '0 2px 3px rgba(25, 118, 210, 0.10)', backgroundColor: "#BE3124" }}
        >
            {loading ? 'Aplicando...' : 'Aplicar'}
        </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default FilterModal; 