import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import ProgressChart from './dailyproductionview/ProgressChart';
import PlanDetails from './dailyproductionview/PlanDetails';
import ProductionHourTable from './dailyproductionview/ProductionHourTable';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StationDetailsLinePlan from './dailyproductionview/StationDetailsLinePlan';
import StatusDailyView from './dailyproductionview/StatusDailyView';
import { useTheme, useMediaQuery } from '@mui/material';

const DailyProductionView = ({ dateData, onBack }) => {
  const { date, plans = [] } = dateData || {};
  const meta = plans.length > 0 && plans[0]?.extendedProps?.quantidade !== undefined ? plans[0].extendedProps.quantidade : '--';
  const metaValue = Number(meta) > 0 ? Number(meta) : 0;
  const produzido = Math.floor(metaValue / 2);
  const diferenca = metaValue - produzido;
  const percentage = metaValue > 0 ? Math.round((produzido / metaValue) * 100) : 0;

  const fakePlanShifts = {
    morning: { quantity: 100 },
    afternoon: { quantity: 120 },
    night: { quantity: 80 }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ p: isMobile ? 1.2 : 3 }}>
      {/* Cabeçalho com botão de voltar e info */}
      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'center' : 'center',
        justifyContent: isMobile ? 'center' : 'space-between',
        mb: isMobile ? 2 : 4,
        px: isMobile ? 1 : { xs: 2, sm: 4 },
        py: isMobile ? 1 : 2.5,
        borderRadius: isMobile ? 2 : 4,
        background: '#222',
        boxShadow: '0 2px 12px 0 rgba(190,49,36,0.10)',
        gap: isMobile ? 0.5 : 3
      }}>
        <IconButton onClick={onBack} sx={{
          mr: isMobile ? 0 : 2,
          mb: isMobile ? 1 : 0,
          width: isMobile ? 38 : 54,
          height: isMobile ? 38 : 54,
          background: '#fff',
          color: '#BE3124',
          border: '2px solid #fff',
          boxShadow: '0 2px 8px rgba(190,49,36,0.10)',
          alignSelf: isMobile ? 'center' : 'center',
          '&:hover': { background: '#222', color: '#BE3124' }
        }}>
          <ArrowBackIcon sx={{ fontSize: isMobile ? 20 : 32 }} />
        </IconButton>
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', mb: isMobile ? 0.5 : 0.5, fontSize: isMobile ? 22 : undefined }}>
            Produção do Dia
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 1, mt: isMobile ? 0.5 : 0 }}>
            <InfoOutlinedIcon sx={{ color: '#fff', fontSize: isMobile ? 18 : 24 }} />
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500, fontSize: isMobile ? 15 : '1.25rem', textAlign: 'center' }}>
              {date ? new Date(date).toLocaleDateString('pt-BR') : '--/--/----'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Status do plano personalizado */}
      <StatusDailyView 
        status={plans[0]?.originalPlan?.status}
        planId={plans[0]?.originalPlan?.id}
      />

      {/* Box centralizada com ProgressChart e ProductionHourTable */}
      <Paper sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        gap: isMobile ? 2 : 4,
        p: isMobile ? 1.2 : { xs: 2, md: 4 },
        mb: 4,
        borderRadius: isMobile ? 0 : 5,
        boxShadow: isMobile ? 'none' : '0 4px 24px 0 rgba(80, 61, 59, 0.1), 0 1.5px 6px 0 rgba(0, 0, 0, 0.04)',
        background: isMobile ? '#F5F5F5' : '#fff',
        width: '100%'
      }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 0, md: 1 }, width: '100%' }}>
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 320 }, maxWidth: { xs: '100%', md: 500 }, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', mb: { xs: 2, md: 0 } }}>
            <ProgressChart
              percentage={percentage}
              meta={meta}
              produzido={produzido}
              diferenca={diferenca}
            />
          </Box>
          <Box sx={{ flex: 2, minWidth: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <ProductionHourTable meta={meta} planShifts={plans[0]?.originalPlan?.shifts || fakePlanShifts} />
          </Box>
        </Box>
        <Box sx={{ width: '100%', mt: 1 }}>
          <StationDetailsLinePlan plan={plans[0]?.originalPlan} />
          <PlanDetails plan={plans[0]?.originalPlan} />
        </Box>
      </Paper>
    </Box>
  );
};

export default DailyProductionView; 