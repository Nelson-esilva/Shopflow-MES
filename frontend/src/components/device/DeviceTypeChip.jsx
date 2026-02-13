import { Chip } from '@mui/material';

const TYPE_COLORS = {
  equipamento: {
    color: '#1976D2', // AZUL
    backgroundColor: '#E3F2FD',
    borderColor: '#90CAF9'
  },
  ferramenta: {
    color: '#7B1FA2', // ROXO
    backgroundColor: '#F3E5F5',
    borderColor: '#CE93D8'
  },
  material: {
    color: '#E65100', // LARANJA
    backgroundColor: '#FFF3E0',
    borderColor: '#FFB74D'
  },
  outro: {
    color: '#5D4037', // MARROM 
    backgroundColor: '#EFEBE9',
    borderColor: '#BCAAA4'
  }
};

function DeviceTypeChip({ type }) {
  const typeConfig = TYPE_COLORS[type] || {
    color: '#757575',
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0'
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'equipamento':
        return 'Equipamento';
      case 'ferramenta':
        return 'Ferramenta';
      case 'material':
        return 'Material';
      case 'outro':
        return 'Outro';
      default:
        return type;
    }
  };

  return (
    <Chip
      label={getTypeLabel(type)}
      sx={{
        color: typeConfig.color,
        backgroundColor: typeConfig.backgroundColor,
        border: `1px solid ${typeConfig.borderColor}`,
        fontWeight: 500,
        '& .MuiChip-label': {
          px: 1
        }
      }}
      size="small"
    />
  );
}

export default DeviceTypeChip; 