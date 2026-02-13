import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { getProductById, getProductionLineById, getOrderById } from '../plansApi';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function formatDate(dateStr) {
  if (!dateStr) return '--';
  // Se for formato ISO, corta só a data
  if (dateStr.includes('T')) return dateStr.split('T')[0].split('-').reverse().join('/');
  // Se já for DD/MM/YYYY, retorna direto
  if (dateStr.includes('/')) return dateStr;
  return dateStr;
}

// Função para traduzir turnos para português
function traduzirTurno(turno) {
  const traducoes = {
    'morning': 'Manhã',
    'afternoon': 'Tarde',
    'evening': 'Noite',
    'night': 'Noite',
    'manha': 'Manhã',
    'tarde': 'Tarde',
    'noite': 'Noite',
    'Morning': 'Manhã',
    'Afternoon': 'Tarde',
    'Evening': 'Noite',
    'Night': 'Noite'
  };
  return traducoes[turno] || turno;
}

const STATUS_LABELS = {
  planned: 'Planejado',
  in_progress: 'Em Progresso',
  completed: 'Concluído',
  paused: 'Pausado',
  canceled: 'Cancelado'
};

const infoList = [
  { label: 'ID do plano:', key: 'id' },
  { label: 'Código do plano:', key: 'plan_code' },
  { label: 'Ordem de produção:', key: 'order' },
  { label: 'Linha de Produção:', key: 'line' },
  { label: 'Produto:', key: 'product' },
  { label: 'Quantidade:', key: 'total_quantity' },
  { label: 'Turnos:', key: 'turnos' },
  { label: 'Data:', key: 'production_day' },
  { label: 'Criado dia:', key: 'created' },
  { label: 'Ultima atualização:', key: 'updated' },
];

const PlanDetails = ({ plan, onClose }) => {
  const [product, setProduct] = React.useState(null);
  const [line, setLine] = React.useState(null);
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!plan) return;
    setLoading(true);
    if (plan.product && typeof plan.product === 'object') {
      setProduct(plan.product);
    } else if (plan.product) {
      getProductById(plan.product).then(setProduct);
    } else {
      setProduct(null);
    }
    if (plan.production_line && typeof plan.production_line === 'object') {
      setLine(plan.production_line);
    } else if (plan.production_line) {
      getProductionLineById(plan.production_line).then(setLine);
    } else {
      setLine(null);
    }
    if (plan.product_order && typeof plan.product_order === 'object') {
      setOrder(plan.product_order);
    } else if (plan.product_order) {
      getOrderById(plan.product_order).then(setOrder);
    } else {
      setOrder(null);
    }
    setLoading(false);
  }, [plan]);

  if (!plan) {
    return (
      <Paper sx={{ p: 3, mt: 2, borderRadius: 4, background: '#fafbfc', textAlign: 'center', boxShadow: 3 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Nenhum plano selecionado.
        </Typography>
      </Paper>
    );
  }

  // Monta os valores para exibir
  const values = {
    id: plan.id ?? '--',
    plan_code: plan.plan_code && plan.plan_code.trim() !== '' ? plan.plan_code : '--',
    order: loading ? 'Carregando...' : (order?.order_code || order?.nome || order?.name || order?.numero || order?.number || order?.id || '--'),
    line: loading ? 'Carregando...' : (line?.nome || line?.name || '--'),
    product: loading ? 'Carregando...' : (product?.nome || product?.name || '--'),
    total_quantity: plan.total_quantity || plan.quantidade || '--',
    status: STATUS_LABELS[plan.status] || plan.status || '--',
    turnos: plan.shifts
      ? Object.keys(plan.shifts)
        .map(traduzirTurno)
        .join(', ')
      : '--',
    production_day: formatDate(plan.production_day || plan.data),
    created: formatDate(plan.created),
    updated: formatDate(plan.updated),
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        mb: 3,
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        background: '#fff',
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)',
        border: '1px solid #E0E0E0',
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          mb: 1,
        }}
      >
        <InfoOutlinedIcon sx={{ color: '#BE3124', fontSize: 40, mr: 1 }} />
        <Typography
          variant="h5"
          fontWeight={900}
          color="#BE3124"
          sx={{
            letterSpacing: '-1px',
            textShadow: '0 2px 8px #fff',
            mr: 2,
          }}
        >
          Detalhes do Plano
        </Typography>
      </Box>
      <Box sx={{ px: { xs: 2, sm: 4 }, py: 3 }}>
        <Box component="div" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {infoList.map((item) => {
            // Destaque visual para Ordem, Linha e Produto
            let bg = '#f5f5f5';
            let color = '#000';
            let labelColor = '#BE3124';
            return (
              <Box key={item.key} sx={{
                display: 'flex',
                flexDirection: 'column',
                background: bg,
                borderRadius: 3,
                p: 2.2,
                boxShadow: '0 1px 4px rgba(190,49,36,0.04)',
                minHeight: 70
              }}>
                <Typography variant="subtitle2" sx={{ color: labelColor, fontSize: '1.01rem', fontWeight: 700, mb: 0.5, letterSpacing: 0.1 }}>
                  {item.label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: color, fontSize: '1.18rem', textAlign: 'left', letterSpacing: 0.1 }}>
                  {values[item.key]}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default PlanDetails; 