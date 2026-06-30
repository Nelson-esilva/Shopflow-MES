import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { CreateProductionPlanModal } from './modals';
import { turnos } from './data';
import DailyProductionView from './DailyProductionView';
import { listPlans, deletePlan } from './plansApi';
import './Calendar.css';
import { listProducts } from '../products/productsApi';
import DeleteProductionPlanModal from './modals/DeleteProductionPlanModal';

const Calendar = ({ currentView, setCurrentView, openPlanModal, setOpenPlanModal }) => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [dailyData, setDailyData] = useState(null);
  const [products, setProducts] = useState([]);
  const calendarRef = useRef(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [calendarView, setCalendarView] = useState('dayGridMonth');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Gerar opções de meses e anos
  const meses = [
    { value: 0, label: 'Janeiro' },
    { value: 1, label: 'Fevereiro' },
    { value: 2, label: 'Março' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Maio' },
    { value: 5, label: 'Junho' },
    { value: 6, label: 'Julho' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Setembro' },
    { value: 9, label: 'Outubro' },
    { value: 10, label: 'Novembro' },
    { value: 11, label: 'Dezembro' }
  ];

  const anos = [];
  for (let i = 2025; i <= 2035; i++) {
    anos.push(i);
  }

  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());

  const handleMesChange = (event) => {
    const novoMes = event.target.value;
    setMesSelecionado(novoMes);
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.gotoDate(new Date(anoSelecionado, novoMes, 1));
    }
  };

  const handleAnoChange = (event) => {
    const novoAno = event.target.value;
    setAnoSelecionado(novoAno);
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.gotoDate(new Date(novoAno, mesSelecionado, 1));
    }
  };

  const handleViewChange = (view) => {
    setCalendarView(view);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  };

  // Função para lidar com clique em uma data
  const handleDateClick = (arg) => {
    const plansForDay = events.filter(event => event.start === arg.dateStr);

    if (plansForDay.length > 0) {
      setDailyData({ date: arg.dateStr, plans: plansForDay });
      setCurrentView('dailyProduction');
    } else {
      // Se não houver planos, abre o modal de criação
      setSelectedDate(arg.dateStr);
      setEditingEvent(null);
      setOpenPlanModal(true);
    }
  };

  const handleSavePlan = (plano) => {
    const ordemTurnos = ['Manhã', 'Tarde', 'Noite'];
    const turnosAtivos = Object.keys(plano.turnosSelecionados).filter(turno => plano.turnosSelecionados[turno]);
    let turnosNomes = turnosAtivos.map(turno => {
      const turnoInfo = turnos.find(t => t.id === turno);
      return turnoInfo?.nome || turno;
    });
    turnosNomes = ordemTurnos.filter(t => turnosNomes.includes(t));
    const horariosArr = turnosAtivos.map(turno => {
      const turnoInfo = turnos.find(t => t.id === turno);
      return turnoInfo ? `${turnoInfo.inicio} - ${turnoInfo.fim}` : '';
    });
    // Se estiver editando, remover eventos antigos
    if (editingEvent) {
      const eventosParaRemover = events.filter(e => e.id.startsWith(editingEvent.id.toString()));
      setEvents(events.filter(e => !eventosParaRemover.includes(e)));
    }
    // Criar um único evento com todos os turnos
    const evento = {
      id: `${plano.id}`,
      title: `${plano.ordemProducao}`,
      start: plano.data,
      backgroundColor: '#fff',
      borderColor: '#e0e0e0',
      textColor: '#333',
      extendedProps: {
        tipo: 'plano',
        ordemProducao: plano.ordemProducao,
        linha: plano.linha,
        produto: plano.produto,
        quantidade: plano.quantidadeTotal,
        turnos: turnosNomes.join(', '),
        horarios: horariosArr.join(' | '),
        createdAt: plano.createdAt
      }
    };
    setEvents([...events, evento]);
    setEditingEvent(null);
  };

  const handleCloseModal = () => {
    setOpenPlanModal(false);
    setEditingEvent(null);
    setSelectedDate('');
  };

  // Paleta fixa de cores vibrantes para produtos
  const PRODUCT_COLORS = [
    '#1976D2', // Azul vibrante
    '#43A047', // Verde vibrante
    '#FB8C00', // Laranja vibrante
    '#8E24AA', // Roxo vibrante
    '#E53935', // Vermelho vibrante
    '#00ACC1', // Ciano vibrante
    '#6D4C41', // Marrom vibrante
    '#455A64', // Cinza escuro vibrante
    '#D81B60', // Rosa vibrante
    '#FBC02D'  // Amarelo vibrante
  ];

  // Lista de produtos únicos, ordenada por id
  const uniqueProducts = React.useMemo(() => {
    // Remove duplicados por id
    const seen = new Set();
    return products.filter(prod => {
      if (seen.has(prod.id)) return false;
      seen.add(prod.id);
      return true;
    }).sort((a, b) => a.id - b.id);
  }, [products]);

  // Função para obter a cor do produto baseada na lista única por id
  const getProductColor = (produtoId) => {
    const idx = uniqueProducts.findIndex(p => p.id === produtoId);
    if (idx === -1) return PRODUCT_COLORS[0];
    const prod = uniqueProducts[idx];
    return prod?.cor || prod?.color || PRODUCT_COLORS[idx % PRODUCT_COLORS.length];
  };

  // Função para renderizar o conteúdo personalizado dos eventos
  const renderEventContent = (eventInfo) => {
    const { extendedProps } = eventInfo.event;
    // Proteção extra: garantir que só strings/números vão para o JSX
    const safe = (val) => {
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') return '';
      if (Array.isArray(val)) return '';
      return val;
    };
    // Buscar produto pelo nome para pegar o id
    const produtoNome = safe(extendedProps.produto);
    const produtoObj = products.find(
      p => (p.nome || p.name) === produtoNome
    );
    const produtoId = produtoObj?.id;
    const produtoCor = getProductColor(produtoId);
    // Função para abrir detalhes do plano ao clicar no olho
    const handleEyeClick = (e) => {
      e.stopPropagation();
      // Buscar o evento completo pelo id (garante que é igual ao array de eventos)
      const evento = events.find(ev => ev.id === eventInfo.event.id);
      setDailyData({
        date: eventInfo.event.startStr,
        plans: evento ? [evento] : [eventInfo.event],
      });
      setCurrentView('dailyProduction');
    };
    return (
      <Box
        className="custom-event-content"
        sx={{
          p: 1.7,
          fontSize: '0.93rem',
          lineHeight: 1.6,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: '#fff',
          borderRadius: '20px',
          border: '1px solid #ccc',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            transform: 'none',
          },
          ...(isMobile && {
            justifyContent: 'center',
            alignItems: 'center',
          })
        }}
      >
        {isMobile ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* Ícone Olho apenas no mobile */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '50%',
                width: 24,
                height: 24,
                backgroundColor: '#e3f2fd',
                boxShadow: '0 1px 4px rgba(25, 118, 210, 0.08)'
              }}
              title="Visualizar plano"
              onClick={handleEyeClick}
            >
              <VisibilityIcon fontSize="medium" sx={{ color: '#1976D2', fontSize: '1.1rem' }} />
            </Box>
          </Box>
        ) : (
        <>
        {/* Header simples */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 1.2,
          gap: 1.2
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.7,
            background: 'linear-gradient(90deg, #F5F5F5 60%, #FFF5F5 100%)',
            color: '#BE3124',
            px: 1.5,
            py: 0.5,
            borderRadius: '7px',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: 0.2,
            boxShadow: 'none'
          }}>
            <Typography variant="caption" sx={{ fontWeight: 900, fontSize: '1.05rem', color: '#BE3124', letterSpacing: 0.2 }}>
              OP: <span style={{ color: '#222' }}>{safe(extendedProps.ordemProducaoId)}</span>{safe(extendedProps.ordemProducao) ? <span style={{ color: '#888', fontWeight: 600 }}> - {safe(extendedProps.ordemProducao)}</span> : ''}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            {/* Ícone Olho */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '50%',
                width: 32,
                height: 32,
                backgroundColor: '#e3f2fd',
                boxShadow: '0 1px 4px rgba(25, 118, 210, 0.08)'
              }}
              title="Visualizar plano"
              onClick={handleEyeClick}
            >
              <VisibilityIcon fontSize="medium" sx={{ color: '#1976D2', fontSize: '1.25rem' }} />
            </Box>
            {/* Ícone Lixeira */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '50%',
                width: 32,
                height: 32,
                backgroundColor: '#ffebee',
                boxShadow: '0 1px 4px rgba(229, 57, 53, 0.08)'
              }}
              title="Excluir plano"
              onClick={() => { setPlanToDelete(eventInfo.event); setDeleteDialogOpen(true); }}
            >
              <DeleteIcon fontSize="medium" sx={{ color: '#E53935', fontSize: '1.25rem' }} />
            </Box>
          </Box>
        </Box>

        {/* Conteúdo principal */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.2, mt: 0.5 }}>
          {/* Produto */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.7,
            backgroundColor: produtoCor,
            px: 0.8,
            py: 0.38,
            borderRadius: '5px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.09)'
          }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: '0.82rem',
                color: '#fff',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                letterSpacing: 0.1,
                maxWidth: '100%'
              }}
            >
              <b>Produto:</b> {produtoNome}
            </Typography>
          </Box>

          {/* Linha */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.7,
            backgroundColor: '#f7f7f7',
            px: 0.8,
            py: 0.38,
            borderRadius: '4px'
          }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                fontSize: '0.82rem',
                color: '#444',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }}
            >
              <b>Linha:</b> {safe(extendedProps.linha)}
            </Typography>
          </Box>

          {/* Quantidade */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.7,
            backgroundColor: '#f7f7f7',
            px: 0.8,
            py: 0.38,
            borderRadius: '4px'
          }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                fontSize: '0.82rem',
                color: '#444',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }}
            >
              <b>Quantidade:</b> {safe(extendedProps.quantidade)} un
            </Typography>
          </Box>

          {/* Turnos (se existir) */}
          {safe(extendedProps.turnos) && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.7,
              backgroundColor: '#f7f7f7',
              px: 0.8,
              py: 0.38,
              borderRadius: '4px',
              maxWidth: '100%'
            }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  color: '#444',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%'
                }}
              >
                <b>Turnos:</b> {safe(extendedProps.turnos)}
              </Typography>
            </Box>
          )}
        </Box>
        </>
        )}
      </Box>
    );
  };

  // Função para traduzir turnos do inglês para português
  const traduzirTurno = (turno) => {
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
  };

  // Função para converter planos da API para eventos do calendário
  const converterPlanosParaEventos = (planos) => {
    const eventos = [];
    const ordemTurnos = ['Manhã', 'Tarde', 'Noite'];
    planos.forEach((plano) => {
      // Converter data DD/MM/YYYY para YYYY-MM-DD
      let dataISO = '';
      if (plano.production_day && plano.production_day.includes('/')) {
        const [dia, mes, ano] = plano.production_day.split('/');
        dataISO = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
      } else {
        dataISO = plano.production_day;
      }
      // Extrair nomes/códigos dos objetos relacionados
      const produtoNome = plano.product?.nome || plano.product?.name || plano.product?.codigo || plano.product?.code || plano.product || '';
      const linhaNome = plano.production_line?.nome || plano.production_line?.name || plano.production_line?.codigo || plano.production_line?.code || plano.production_line || '';
      const ordemId = plano.product_order?.id || plano.product_order?.numero || plano.product_order?.number || '';
      const ordemNome = plano.product_order?.nome || plano.product_order?.name || plano.product_order?.codigo || plano.product_order?.code || plano.product_order || '';
      // Unificar turnos em um único evento
      let turnosStr = '';
      let horariosStr = '';
      if (plano.shifts && typeof plano.shifts === 'object' && Object.keys(plano.shifts || {}).length > 0) {
        let turnosArr = Object.entries(plano.shifts || {}).map(([turno, info]) => traduzirTurno(turno));
        turnosArr = ordemTurnos.filter(t => turnosArr.includes(t));
        turnosStr = turnosArr.join(', ');
        const horariosArr = Object.entries(plano.shifts || {}).map(([turno, info]) => `${info?.init_time || ''} - ${info?.stop_time || ''}`);
        horariosStr = horariosArr.join(' | ');
      }
      eventos.push({
        id: `${plano.id}`,
        title: `Ordem: ${ordemNome} | Produto: ${produtoNome} | Linha: ${linhaNome}`,
        start: dataISO,
        backgroundColor: '#fff',
        borderColor: '#e0e0e0',
        textColor: '#333',
        originalPlan: plano,
        extendedProps: {
          tipo: 'plano',
          ordemProducao: ordemNome,
          ordemProducaoId: ordemId,
          linha: linhaNome,
          produto: produtoNome,
          quantidade: plano.total_quantity,
          turnos: turnosStr,
          horarios: horariosStr,
          createdAt: plano.created
        }
      });
    });
    return eventos;
  };

  // Buscar planos do backend ao carregar o componente
  const fetchPlans = async () => {
    try {
      const plansWithDetails = await listPlans();
      console.log('Planos detalhados:', plansWithDetails);
      const eventos = converterPlanosParaEventos(plansWithDetails);
      console.log('Eventos convertidos:', eventos);
      setEvents(eventos);
    } catch (error) {
      // Trate o erro conforme necessário
      setEvents([]);
    }
  };

  React.useEffect(() => {
    fetchPlans();
  }, []);

  // Função para atualizar planos manualmente (após criar)
  const atualizarPlanos = () => {
    fetchPlans();
  };

  // Buscar produtos do backend ao carregar o componente
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await listProducts();
        // Suporte para response.results (paginado) ou array direto
        const productsList = Array.isArray(response?.results) ? response.results : Array.isArray(response) ? response : [];
        setProducts(productsList);
      } catch (error) {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Função para deletar plano
  const handleDeletePlan = async (planId) => {
    try {
      await deletePlan(planId);
      setEvents((prev) => prev.filter(ev => !ev.id.startsWith(planId.toString())));
    } catch (error) {
      alert('Erro ao excluir plano!');
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', borderRadius: 5 }}>
      {currentView === 'calendar' ? (
        <>
          {/* Calendário ou Lista responsiva */}
          <Paper elevation={4} sx={{
            borderRadius: 5,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{
              p: isMobile ? 1.2 : 3,
              backgroundColor: '#222',
              color: 'white',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: 'space-between',
              gap: isMobile ? 1.5 : 2
            }}>
              {/* Esquerda: Selects de mês e ano */}
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 2, alignItems: isMobile ? 'stretch' : 'center', width: isMobile ? '100%' : 'auto' }}>
                <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 120 }}>
                  <Select
                    value={mesSelecionado}
                    onChange={handleMesChange}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '& .MuiSelect-icon': { color: 'white' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                      width: isMobile ? '100%' : 'auto',
                      fontSize: isMobile ? 14 : 16
                    }}
                  >
                    {meses.map((mes) => (
                      <MenuItem key={mes.value} value={mes.value} sx={{ color: '#333' }}>
                        {mes.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 100 }}>
                  <Select
                    value={anoSelecionado}
                    onChange={handleAnoChange}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '& .MuiSelect-icon': { color: 'white' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                      width: isMobile ? '100%' : 'auto',
                      fontSize: isMobile ? 14 : 16
                    }}
                  >
                    {anos.map((ano) => (
                      <MenuItem key={ano} value={ano} sx={{ color: '#333' }}>
                        {ano}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {/* Direita: Botões de visualização */}
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 1, alignItems: isMobile ? 'stretch' : 'center', width: isMobile ? '100%' : 'auto' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleViewChange('dayGridMonth')}
                  sx={{
                    backgroundColor: calendarView === 'dayGridMonth' ? '#222' : 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.3)',
                    fontWeight: 700,
                    minWidth: isMobile ? '100%' : 120,
                    height: 40,
                    px: isMobile ? 1.5 : 2.5,
                    py: isMobile ? 0.7 : 1,
                    borderRadius: 2,
                    boxShadow: 'none',
                    fontSize: isMobile ? 14 : 16,
                    '&:hover': {
                      backgroundColor: calendarView === 'dayGridMonth' ? '#111' : 'rgba(255,255,255,0.18)',
                      color: '#fff',
                      borderColor: 'rgba(255,255,255,0.5)',
                      boxShadow: 'none'
                    }
                  }}
                  fullWidth={isMobile}
                >
                  Mês
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleViewChange('dayGridWeek')}
                  sx={{
                    backgroundColor: calendarView === 'dayGridWeek' ? '#222' : 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.3)',
                    fontWeight: 700,
                    minWidth: isMobile ? '100%' : 120,
                    height: 40,
                    px: isMobile ? 1.5 : 2.5,
                    py: isMobile ? 0.7 : 1,
                    borderRadius: 2,
                    boxShadow: 'none',
                    fontSize: isMobile ? 14 : 16,
                    '&:hover': {
                      backgroundColor: calendarView === 'dayGridWeek' ? '#111' : 'rgba(255,255,255,0.18)',
                      color: '#fff',
                      borderColor: 'rgba(255,255,255,0.5)',
                      boxShadow: 'none'
                    }
                  }}
                  fullWidth={isMobile}
                >
                  Semana
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleViewChange('dayGridDay')}
                  sx={{
                    backgroundColor: calendarView === 'dayGridDay' ? '#222' : 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.3)',
                    fontWeight: 700,
                    minWidth: isMobile ? '100%' : 120,
                    height: 40,
                    px: isMobile ? 1.5 : 2.5,
                    py: isMobile ? 0.7 : 1,
                    borderRadius: 2,
                    boxShadow: 'none',
                    fontSize: isMobile ? 14 : 16,
                    '&:hover': {
                      backgroundColor: calendarView === 'dayGridDay' ? '#111' : 'rgba(255,255,255,0.18)',
                      color: '#fff',
                      borderColor: 'rgba(255,255,255,0.5)',
                      boxShadow: 'none'
                    }
                  }}
                  fullWidth={isMobile}
                >
                  Dia
                </Button>
              </Box>
            </Box>

            <Box sx={{ p: 2 }}>
              {isMobile ? (
                // LISTA MOBILE
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {(() => {
                    // Agrupar eventos por data
                    const eventosPorData = {};
                    events.forEach(ev => {
                      if (!ev || !ev.start) return;
                      if (!eventosPorData[ev.start]) eventosPorData[ev.start] = [];
                      eventosPorData[ev.start].push(ev);
                    });
                    // Filtro por visualização
                    const now = new Date();
                    const selectedMonth = mesSelecionado;
                    const selectedYear = anoSelecionado;
                    let datasOrdenadas = Object.keys(eventosPorData).sort();
                    let filteredDatas = datasOrdenadas;
                    if (calendarView === 'dayGridWeek') {
                      // Semana: filtra apenas os dias da semana atual do mês/ano selecionado
                      const today = new Date(selectedYear, selectedMonth, now.getDate());
                      const weekStart = new Date(today);
                      weekStart.setDate(today.getDate() - today.getDay()); // domingo
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekStart.getDate() + 6); // sábado
                      filteredDatas = datasOrdenadas.filter(dateStr => {
                        const d = new Date(dateStr);
                        return d >= weekStart && d <= weekEnd && d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
                      });
                    } else if (calendarView === 'dayGridDay') {
                      // Dia: filtra apenas o dia atual do mês/ano selecionado
                      const today = new Date(selectedYear, selectedMonth, now.getDate());
                      filteredDatas = datasOrdenadas.filter(dateStr => {
                        const d = new Date(dateStr);
                        return d.getDate() === today.getDate() && d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
                      });
                    } else {
                      // Mês: filtra todos do mês/ano selecionado
                      filteredDatas = datasOrdenadas.filter(dateStr => {
                        const d = new Date(dateStr);
                        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
                      });
                    }
                    const getSafeString = (val) => {
                      if (val == null) return '-';
                      if (typeof val === 'string' || typeof val === 'number') return val;
                      if (typeof val === 'object') {
                        // Tenta pegar campos comuns
                        return val.nome || val.name || val.code || val.codigo || val.id || '-';
                      }
                      return '-';
                    };
                    if (filteredDatas.length === 0) {
                      return <Typography sx={{ color: '#888', textAlign: 'center', py: 4 }}>Nenhum plano cadastrado para este período.</Typography>;
                    }
                    return filteredDatas.map(data => (
                      <Box key={data} sx={{ background: '#fff', borderRadius: 2, boxShadow: 1, p: 1.5, mb: 1.2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#BE3124', fontWeight: 700, mb: 1, fontSize: 15, letterSpacing: 0.1 }}>{new Date(data).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                          {eventosPorData[data].map(ev => {
                            const ext = ev.extendedProps || {};
                            // Cor do produto para borda
                            let produtoCor = '#BE3124';
                            if (ext.produto && typeof ext.produto === 'object') {
                              produtoCor = ext.produto.cor || ext.produto.color || '#BE3124';
                            }
                            if (typeof ext.produto === 'string' && Array.isArray(products)) {
                              const prodObj = products.find(p => p.nome === ext.produto || p.name === ext.produto);
                              if (prodObj && (prodObj.cor || prodObj.color)) produtoCor = prodObj.cor || prodObj.color;
                            }
                            return (
                              <Box key={ev.id} sx={{
                                borderLeft: `4px solid ${produtoCor}`,
                                borderRadius: 1.5,
                                p: 1.2,
                                mb: 0.5,
                                background: '#fafafa',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.7,
                                boxShadow: '0 1px 4px 0 rgba(190,49,36,0.04)',
                                transition: 'box-shadow 0.2s',
                                '&:hover': { boxShadow: '0 2px 8px 0 rgba(190,49,36,0.10)' }
                              }}>
                                <Typography sx={{ fontWeight: 800, color: '#222', fontSize: 15, mb: 0.2, letterSpacing: 0.05 }}>
                                  OP: {getSafeString(ext.ordemProducao)}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7, mb: 0.2 }}>
                                  <Chip label={getSafeString(ext.produto)} sx={{ background: produtoCor, color: '#fff', fontWeight: 600, fontSize: 12, px: 1, height: 22 }} />
                                  <Chip label={getSafeString(ext.linha)} sx={{ background: '#f7f7f7', color: '#BE3124', fontWeight: 600, fontSize: 12, px: 1, height: 22 }} />
                                  <Chip label={getSafeString(ext.quantidade)} sx={{ background: '#f7f7f7', color: '#1976d2', fontWeight: 600, fontSize: 12, px: 1, height: 22 }} />
                                  {ext.turnos && (
                                    <Chip label={getSafeString(ext.turnos)} sx={{ background: '#f7f7f7', color: '#444', fontWeight: 600, fontSize: 12, px: 1, height: 22 }} />
                                  )}
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                  <Button size="small" variant="contained" color="primary" startIcon={<VisibilityIcon />} sx={{ fontWeight: 600, borderRadius: 1.5, px: 1.5, minWidth: 0, fontSize: 13, height: 28 }} onClick={() => {
                                    setDailyData({ date: data, plans: [ev] });
                                    setCurrentView('dailyProduction');
                                  }}>Ver</Button>
                                  <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} sx={{ fontWeight: 600, borderRadius: 1.5, px: 1.5, minWidth: 0, fontSize: 13, height: 28 }} onClick={() => { setPlanToDelete(ev); setDeleteDialogOpen(true); }}>Excluir</Button>
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    ));
                  })()}
                </Box>
              ) : (
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView={calendarView}
                headerToolbar={false}
                events={events}
                dateClick={handleDateClick}
                eventContent={renderEventContent}
                height="auto"
                locales={[ptBrLocale]}
                locale="pt-br"
                dayMaxEvents={3}
                moreLinkClick="popover"
                eventDisplay="block"
                eventMinHeight={isMobile ? 48 : 80}
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: false
                }}
                buttonText={{
                  today: 'Hoje',
                  month: 'Mês',
                  week: 'Semana'
                }}
                sx={{
                  '& .fc-toolbar': {
                    backgroundColor: '#f8f9fa',
                    padding: 2,
                    borderRadius: 1
                  },
                  '& .fc-button': {
                    backgroundColor: '#1976d2',
                    borderColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0'
                    }
                  },
                  '& .fc-daygrid-day': {
                    '&:hover': {
                      backgroundColor: '#f0f8ff'
                    },
                    fontSize: isMobile ? '12px' : '15px',
                    padding: isMobile ? '2px' : '6px',
                  },
                  '& .fc-event': {
                    cursor: 'pointer',
                    borderRadius: '6px',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    margin: '1px 0',
                    minHeight: isMobile ? '48px' : '80px',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      transform: 'translateY(-1px)',
                      transition: 'all 0.2s ease'
                    }
                  },
                  '& .fc-daygrid-event-dot': {
                    display: 'none'
                  },
                  '& .fc-event-main': {
                    padding: '0 !important',
                    fontSize: isMobile ? '12px' : '15px',
                  },
                  '& .fc-daygrid-day-events': {
                    marginTop: isMobile ? '1px' : '2px'
                  },
                  '& .fc-daygrid-day-number, & .fc-col-header-cell-cushion, & .fc-daygrid-day, & .fc-day': {
                    color: '#111',
                    fontWeight: 600,
                    fontSize: isMobile ? '13px' : '16px',
                    padding: isMobile ? '2px' : '6px',
                  }
                }}
              />
              )}
            </Box>
          </Paper>

          {/* Legenda */}
          <Paper elevation={2} sx={{ mt: 3, p: 0, borderRadius: 5, border: '1px solid #E0E0E0', background: '#FFF' }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: isMobile ? 1.5 : 3,
              py: isMobile ? 1 : 2,
              borderBottom: '1px solid #E0E0E0',
              background: 'linear-gradient(90deg, #FFF5F5 0%, #F5F5F5 100%)',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}>
              <Box sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#BE3124',
                mr: 1
              }} />
              <Typography variant={isMobile ? 'subtitle2' : 'h6'} sx={{ fontWeight: 700, color: '#BE3124', letterSpacing: 0.2, fontSize: isMobile ? 15 : 20, textAlign: isMobile ? 'center' : 'left' }}>
                Legenda de Produtos
              </Typography>
            </Box>
            <Box sx={{ px: isMobile ? 1.5 : 3, py: isMobile ? 1 : 2 }}>
              <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 1 : 2} flexWrap={isMobile ? 'nowrap' : 'wrap'} gap={1} alignItems={isMobile ? 'center' : 'flex-start'}>
                {uniqueProducts.map((produto) => (
                  <Chip
                    key={produto.id}
                    label={produto.nome || produto.name}
                    sx={{
                      backgroundColor: getProductColor(produto.id),
                      color: '#fff',
                      fontWeight: 500,
                      fontSize: isMobile ? '0.80rem' : '0.95rem',
                      border: 'none',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                      minWidth: isMobile ? 90 : 110,
                      justifyContent: 'center'
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Paper>

          {/* Modal de criação de plano de produção */}
          <CreateProductionPlanModal
            open={openPlanModal}
            onClose={handleCloseModal}
            onSave={handleSavePlan}
            onPlanCreated={atualizarPlanos}
            plano={editingEvent}
            selectedDate={selectedDate}
          />
        </>
      ) : (
        <DailyProductionView
          dateData={dailyData}
          onBack={() => setCurrentView('calendar')}
        />
      )}

      {/* Diálogo de confirmação de exclusão */}
      <DeleteProductionPlanModal
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          await handleDeletePlan(planToDelete.id.split('-')[0]);
          setDeleteDialogOpen(false);
        }}
      />
    </Box>
  );
};

export default Calendar;