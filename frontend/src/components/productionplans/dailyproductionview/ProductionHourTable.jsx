import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Typography, ButtonGroup, Button, useTheme, useMediaQuery } from '@mui/material';

const horarios = [
  '07:00:00', '08:00:00', '09:00:00', '10:00:00', '11:00:00',
  '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00',
  '18:00:00', '19:00:00', '20:00:00', '21:00:00', '22:00:00', '23:00:00'
];

const turnos = [
  { key: 'manha', label: 'Manhã', start: 7, end: 12 },
  { key: 'tarde', label: 'Tarde', start: 12, end: 18 },
  { key: 'noite', label: 'Noite', start: 18, end: 7 }
];

function filtrarPorTurno(turnoKey, dados) {
  if (turnoKey === 'manha') {
    return dados.filter(d => {
      const h = Number(d.hora.split(':')[0]);
      return h >= 7 && h < 12;
    });
  }
  if (turnoKey === 'tarde') {
    return dados.filter(d => {
      const h = Number(d.hora.split(':')[0]);
      return h >= 12 && h < 18;
    });
  }
  if (turnoKey === 'noite') {
    return dados.filter(d => {
      const h = Number(d.hora.split(':')[0]);
      return h >= 18 || h < 7;
    });
  }
  return dados;
}

// Substituir cálculo dinâmico por dados estáticos para cada turno
function gerarDadosFicticios(turnoKey) {
  let horas = [];
  if (turnoKey === 'manha') horas = ['07:00:00', '08:00:00', '09:00:00', '10:00:00', '11:00:00'];
  if (turnoKey === 'tarde') horas = ['12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00'];
  if (turnoKey === 'noite') horas = ['18:00:00', '19:00:00', '20:00:00', '21:00:00', '22:00:00', '23:00:00'];
  return horas.map((hora, idx) => {
    let produzido = 0;
    let meta = 100;
    let produtividade = 0;
    if (idx === 0 || idx === 1) {
      produzido = meta;
      produtividade = 100;
    } else if (idx === 2) {
      produzido = meta / 2;
      produtividade = 50;
    }
    return { hora, produzido, meta, produtividade };
  });
}

const ProductionHourTable = ({ meta, planShifts }) => {
  // Proteção: se planShifts for inválido, mostra mensagem e não tenta renderizar tabela
  const planShiftsValido = planShifts && typeof planShifts === 'object' && Object.keys(planShifts).length > 0;

  // Hooks SEMPRE antes de qualquer return condicional
  const metaValue = Number(meta) > 0 ? Number(meta) : 0;
  const dados = horarios.map(hora => {
    let produzido = 0;
    if (hora === '07:00:00' || hora === '08:00:00' || hora === '09:00:00') {
      produzido = metaValue;
    } else if (hora === '10:00:00') {
      produzido = metaValue / 2;
    }
    return {
      hora,
      produzido,
      meta: metaValue,
      produtividade: metaValue > 0 ? Math.round((produzido / metaValue) * 100) : 0
    };
  });

  const availableShifts = React.useMemo(() => {
    if (!planShiftsValido) return [];
    return Object.keys(planShifts).map(key => {
      if (key.toLowerCase().includes('morning')) return 'manha';
      if (key.toLowerCase().includes('afternoon')) return 'tarde';
      if (key.toLowerCase().includes('evening') || key.toLowerCase().includes('night')) return 'noite';
      return key;
    });
  }, [planShifts, planShiftsValido]);

  const [turno, setTurno] = useState(() => availableShifts[0] || 'manha');
  React.useEffect(() => {
    if (availableShifts.length > 0) setTurno(availableShifts[0]);
  }, [availableShifts.length]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Se não houver dados válidos, retorna mensagem amigável
  if (!planShiftsValido) {
    return (
      <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center', color: '#BE3124', background: '#fff7f7' }}>
        Nenhum dado de turno disponível para este plano.
      </Paper>
    );
  }

  // Em vez de calcular dadosFiltrados dinamicamente, usar dados fictícios fixos
  let dadosFiltrados = gerarDadosFicticios(turno);

  // Estado para animar as barras de progresso
  const [progressos, setProgressos] = useState(Array(dadosFiltrados.length).fill(0));

  useEffect(() => {
    // Inicializa todos os progressos em 0
    setProgressos(Array(dadosFiltrados.length).fill(0));
    // Anima cada barra individualmente
    dadosFiltrados.forEach((row, idx) => {
      let start = 0;
      const end = row.produtividade;
      const duration = 700; // ms
      const step = 15; // ms
      const increment = end / (duration / step);
      const interval = setInterval(() => {
        start += increment;
        setProgressos(prev => {
          const copy = [...prev];
          copy[idx] = Math.min(start, end);
          return copy;
        });
        if (start >= end) clearInterval(interval);
      }, step);
      // Limpa o intervalo ao desmontar
      return () => clearInterval(interval);
    });
  }, [turno]);

  // Sempre renderizar a tabela, sem checar turnoExiste
  if (isMobile) {
    return (
      <Paper sx={{ borderRadius: 0, background: '#F5F5F5', boxShadow: 'none', width: '100%', maxWidth: 420, minWidth: 0, height: '100%', minHeight: 320, p: 1.2, ml: -3, mr: 'auto', gap: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Botão de seleção de turno */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <ButtonGroup variant="outlined" sx={{ boxShadow: 'none', width: '100%' }} fullWidth>
            {turnos.map(t => (
              <Button
                key={t.key}
                onClick={() => setTurno(t.key)}
                disabled={!availableShifts.includes(t.key)}
                sx={{
                  fontWeight: 700,
                  backgroundColor: turno === t.key ? '#222' : 'rgba(0,0,0,0.07)',
                  color: turno === t.key ? '#fff' : (!availableShifts.includes(t.key) ? '#aaa' : '#222'),
                  borderColor: 'rgba(0,0,0,0.13)',
                  borderRadius: 2,
                  minWidth: '100%',
                  px: 1,
                  py: 0.7,
                  boxShadow: 'none',
                  opacity: availableShifts.includes(t.key) ? 1 : 0.5,
                  fontSize: 13,
                  '&:hover': {
                    backgroundColor: !availableShifts.includes(t.key) ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.13)',
                    color: !availableShifts.includes(t.key) ? '#aaa' : '#222',
                    borderColor: '#222',
                    boxShadow: 'none'
                  }
                }}
                fullWidth
              >
                {t.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, alignItems: 'center', width: '100%' }}>
          {dadosFiltrados.map((row, idx) => (
            <Box key={row.hora} sx={{ background: '#fff', borderRadius: 3, boxShadow: '0 1px 4px 0 rgba(190,49,36,0.07)', border: '1px solid #E0E0E0', p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.7, width: '100%', maxWidth: 370, minWidth: 0, m: '0 auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography sx={{ fontWeight: 700, color: '#BE3124', fontSize: 13 }}>Hora: {row.hora}</Typography>
                <Typography sx={{ fontWeight: 700, color: '#1976d2', fontSize: 13 }}>{row.produtividade}%</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <LinearProgress variant="determinate" value={progressos[idx] || 0} sx={{ width: '100%', height: 7, borderRadius: 5, background: '#eee' }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: '#222' }}>Meta: <b>{row.meta}</b></Typography>
                <Typography sx={{ fontSize: 12, color: '#222' }}>Produzido: <b>{row.produzido}</b></Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    );
  }
  return (
    <Paper
      sx={{
        borderRadius: isMobile ? 0 : 4,
        background: isMobile ? 'none' : '#fff',
        boxShadow: isMobile ? 'none' : '0 2px 8px 0 rgba(80, 61, 59, 0.07)',
        border: isMobile ? 'none' : '1px solid #E0E0E0',
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        minHeight: 420,
        p: isMobile ? 0 : 2,
        gap: isMobile ? 0 : 2,
        m: 0
      }}
    >
      {/* Botão de seleção de turno */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end' }}>
        <ButtonGroup variant="outlined" sx={{ boxShadow: 'none', width: isMobile ? '100%' : 'auto' }} fullWidth={isMobile}>
          {turnos.map(t => (
            <Button
              key={t.key}
              onClick={() => setTurno(t.key)}
              disabled={!availableShifts.includes(t.key)}
              sx={{
                fontWeight: 700,
                backgroundColor: turno === t.key ? '#222' : 'rgba(0,0,0,0.07)',
                color: turno === t.key ? '#fff' : (!availableShifts.includes(t.key) ? '#aaa' : '#222'),
                borderColor: 'rgba(0,0,0,0.13)',
                borderRadius: 2,
                minWidth: isMobile ? '100%' : 110,
                px: isMobile ? 1 : 2,
                py: isMobile ? 0.7 : 1.1,
                boxShadow: 'none',
                opacity: availableShifts.includes(t.key) ? 1 : 0.5,
                fontSize: isMobile ? 13 : 15,
                '&:hover': {
                  backgroundColor: !availableShifts.includes(t.key) ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.13)',
                  color: !availableShifts.includes(t.key) ? '#aaa' : '#222',
                  borderColor: '#222',
                  boxShadow: 'none'
                }
              }}
              fullWidth={isMobile}
            >
              {t.label}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <Box sx={{ width: '100%', height: '100%', overflowX: isMobile ? 'auto' : 'visible' }}>
        <TableContainer component={Box} sx={{ width: '100%', borderRadius: 6, overflow: 'auto' }}>
          <Table sx={{ width: '100%', minWidth: isMobile ? 320 : 700, maxWidth: '100%' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#BE3124', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                <TableCell sx={{ color: '#fff', fontWeight: 700, width: isMobile ? 50 : 90, textAlign: 'center', verticalAlign: 'middle', fontSize: isMobile ? 12 : 15, py: isMobile ? 0.5 : 1.2, px: isMobile ? 0.5 : 2 }}>Hora</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, width: isMobile ? 90 : 250, textAlign: 'center', verticalAlign: 'middle', fontSize: isMobile ? 12 : 15, py: isMobile ? 0.5 : 1.2, px: isMobile ? 0.5 : 2 }}>Produzido</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, width: isMobile ? 40 : 80, textAlign: 'center', verticalAlign: 'middle', fontSize: isMobile ? 12 : 15, py: isMobile ? 0.5 : 1.2, px: isMobile ? 0.5 : 2 }}>Meta</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, width: isMobile ? 70 : 110, textAlign: 'center', verticalAlign: 'middle', fontSize: isMobile ? 12 : 15, py: isMobile ? 0.5 : 1.2, px: isMobile ? 0.5 : 2 }}>Produtividade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dadosFiltrados.map((row, idx) => (
                <TableRow key={row.hora} sx={{ height: isMobile ? 30 : 48 }}>
                  <TableCell sx={{ textAlign: 'center', fontSize: isMobile ? 12 : 15, py: isMobile ? 0.5 : 1.2, px: isMobile ? 0.5 : 2 }}>{row.hora}</TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: isMobile ? 12 : 15, py: isMobile ? 0.5 : 1.2, px: isMobile ? 0.5 : 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: isMobile ? 40 : 120, justifyContent: 'center' }}>
                      <LinearProgress
                        variant="determinate"
                        value={progressos[idx] || 0}
                        sx={{ width: isMobile ? 40 : 250, height: isMobile ? 5 : 10, borderRadius: 5, background: '#eee' }}
                      />
                      <Typography sx={{ fontWeight: 700, color: '#BE3124', fontSize: isMobile ? 12 : 15 }}>{row.produtividade}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: isMobile ? 12 : 15, py: isMobile ? 0.5 : 1.2, px: isMobile ? 0.5 : 2 }}>{row.meta}</TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: isMobile ? 12 : 15, py: isMobile ? 0.5 : 1.2, px: isMobile ? 0.5 : 2 }}>{row.produtividade}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default ProductionHourTable; 