import { Chip } from '@mui/material';

const STATUS_COLORS = {
  disponivel: { // DISPONIVEL (VERDE)
    color: '#1B5E20',
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7'
  },
  manutencao: { // MANUTENÇÃO (VERMELHO)
    color: '#BE3124',
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2'
  },
  em_uso: { // EM USO (AMARELO)
    color: '#F57F17',
    backgroundColor: '#FFF3E0',
    borderColor: '#FFCC80'
  }
};

function DeviceStatusChip({ status }) {
  const statusConfig = STATUS_COLORS[status] || {
    color: '#757575',
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0'
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'manutencao':
        return 'Em Manutenção';
      case 'em_uso':
        return 'Em Uso';
      default:
        return status;
    }
  };

  return (
    <Chip
      label={getStatusLabel(status)}
      sx={{
        color: statusConfig.color,
        backgroundColor: statusConfig.backgroundColor,
        border: `1px solid ${statusConfig.borderColor}`,
        fontWeight: 500,
        '& .MuiChip-label': {
          px: 1
        }
      }}
      size="small"
    />
  );
}

export default DeviceStatusChip; 