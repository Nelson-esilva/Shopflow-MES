import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, Typography, CircularProgress, Button, FormControl, InputLabel, Select, MenuItem, TextField, FormControlLabel, Switch } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuTabs from './cards/MenuTabs';
import CarouselChart from './carousel/charts/CarouselChart';
import HourTable from './carousel/timetable/HourTable';
import EstacoesContent from './cards/EstacoesContent';
import DefeitosContent from './cards/DefeitosContent';
import carouselApi from './carousel/carouselApi';
import dayjs from 'dayjs';

const ProductionDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('linhas');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  
  // Filtros para a API
  const [filters, setFilters] = useState({
    product_id: '',
    production_line_id: '',
    station_id: '',
    workstation_id: '1' // ID da estação de trabalho padrão
  });

  // Filtros adicionais
  const [showGeneralData, setShowGeneralData] = useState(false);
  const [customDate, setCustomDate] = useState(dayjs().format('YYYY-MM-DD'));
  
  // Log para confirmar a data inicial
  console.log('Data inicial configurada:', dayjs().format('YYYY-MM-DD'));
  console.log('customDate atual:', customDate);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Função para buscar dados com filtros
  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Buscando dados com filtros:', filters);
      console.log('Data selecionada:', selectedDate.format('YYYY-MM-DD'));
      console.log('Data customizada:', customDate);
      console.log('Dados gerais:', showGeneralData);
      
      let data;
      
      if (showGeneralData) {
        // Buscar dados gerais (sem especificar estação)
        console.log('Buscando dados gerais...');
        data = await carouselApi.getDailyProductionData({
          registered_at: customDate || selectedDate.format('YYYY-MM-DD')
        });
      } else {
        // Buscar dados específicos da estação
        data = await carouselApi.getDailyWorkstationData(filters.workstation_id, {
          product_id: filters.product_id || undefined,
          production_line_id: filters.production_line_id || undefined,
          station_id: filters.station_id || undefined,
          registered_at: customDate || selectedDate.format('YYYY-MM-DD')
        });
      }
      
      console.log('Dados recebidos da API:', data);
      
      // Processar dados para o gráfico baseado no formato da API
      let processedData = {
        percentage: 0,
        meta: 0,
        produzido: 0,
        diferenca: 0,
        defeitos: 0,
        rawData: data
      };

      // Verificar se data é um array e tem dados
      if (Array.isArray(data) && data.length > 0) {
        // Pegar o último item que contém os dados totais
        const totalData = data[data.length - 1];
        console.log('Dados totais encontrados:', totalData);
        
        processedData = {
          percentage: totalData.FPY || 0, // First Pass Yield como percentual
          meta: totalData["quantity planned"] || 0, // Quantidade planejada como meta
          produzido: totalData["total produced"] || 0, // Total produzido
          diferenca: (totalData["quantity planned"] || 0) - (totalData["total produced"] || 0), // Diferença
          defeitos: totalData["total defective units"] || 0, // Total de unidades defeituosas
          rawData: data
        };
      } else if (data && typeof data === 'object') {
        // Se não for array, verificar se tem os campos diretamente
        processedData = {
          percentage: data.FPY || 0,
          meta: data["quantity planned"] || 0,
          produzido: data["total produced"] || 0,
          diferenca: (data["quantity planned"] || 0) - (data["total produced"] || 0),
          defeitos: data["total defective units"] || 0,
          rawData: data
        };
      }
      
      console.log('Dados processados para gráfico:', processedData);
      console.log('Percentual:', processedData.percentage);
      console.log('Meta:', processedData.meta);
      console.log('Produzido:', processedData.produzido);
      console.log('Diferença:', processedData.diferenca);
      console.log('Defeitos:', processedData.defeitos);
      
      setChartData(processedData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Erro ao carregar dados do gráfico');
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados quando filtros ou data mudarem
  useEffect(() => {
    fetchChartData();
  }, [filters, selectedDate, customDate, showGeneralData]);

  const handleTabChange = (tab) => {
    if (tab === 'grafana') {
      window.open('https://localhost:3000', '_blank', 'noopener,noreferrer');
      return;
    }
    setSelectedTab(tab);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = () => {
    fetchChartData();
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setCustomDate(newDate);
    console.log('Data customizada alterada:', newDate);
  };

  const handleGeneralDataToggle = (event) => {
    setShowGeneralData(event.target.checked);
    console.log('Dados gerais:', event.target.checked);
  };

  return (
    <Box
      sx={{
        px: { xs: 1.5, sm: 2, md: 0 },
        py: { xs: 1, sm: 2, md: 0 },
        mt: isMobile ? 0.5 : 4,
        minHeight: isMobile ? '100vh' : 'auto',
        background: isMobile ? 'linear-gradient(180deg, #fff 70%, #f7f7fa 100%)' : 'none',
        borderRadius: isMobile ? 0 : 4,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
        <MenuTabs
          selected={selectedTab}
          onChange={handleTabChange}
          selectedDate={selectedDate}
        />
      
        {selectedTab === 'linhas' && (
          <Box sx={{ mb: isMobile ? 0.5 : 1 }}>
            {/* Filtros */}
            <Paper
              elevation={2}
              sx={{
                p: isMobile ? 2 : 3,
                mb: 3,
                borderRadius: 2,
                background: '#fff',
                border: '1px solid #e0e0e0'
              }}
            >
              {/* Filtros em Layout Responsivo */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 2,
                alignItems: isMobile ? 'stretch' : 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                mb: 3
              }}>
                {/* Filtros Específicos */}
                {!showGeneralData && (
                  <>
                    {/* Plano de Produção */}
                    <FormControl size="large" sx={{ 
                      minWidth: isMobile ? '100%' : 150, 
                      flex: isMobile ? 'none' : 1,
                      width: isMobile ? '100%' : 'auto'
                    }}>
                      <InputLabel>Plano de Produção</InputLabel>
                      <Select
                        value={filters.workstation_id}
                        onChange={(e) => handleFilterChange('workstation_id', e.target.value)}
                        label="Plano de Produção"
                      >
                        <MenuItem value="1">Estação 1</MenuItem>
                        <MenuItem value="2">Estação 2</MenuItem>
                        <MenuItem value="3">Estação 3</MenuItem>
                      </Select>
                    </FormControl>
                    
                    {/* Produto */}
                    <FormControl size="large" sx={{ 
                      minWidth: isMobile ? '100%' : 150, 
                      flex: isMobile ? 'none' : 1,
                      width: isMobile ? '100%' : 'auto'
                    }}>
                      <InputLabel>Produto</InputLabel>
                      <Select
                        value={filters.product_id}
                        onChange={(e) => handleFilterChange('product_id', e.target.value)}
                        label="Produto"
                      >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="1">Produto 1</MenuItem>
                        <MenuItem value="2">Produto 2</MenuItem>
                        <MenuItem value="3">Produto 3</MenuItem>
                      </Select>
                    </FormControl>
                    
                    {/* Linha */}
                    <FormControl size="large" sx={{ 
                      minWidth: isMobile ? '100%' : 150, 
                      flex: isMobile ? 'none' : 1,
                      width: isMobile ? '100%' : 'auto'
                    }}>
                      <InputLabel>Linha</InputLabel>
                      <Select
                        value={filters.production_line_id}
                        onChange={(e) => handleFilterChange('production_line_id', e.target.value)}
                        label="Linha"
                      >
                        <MenuItem value="">Todas</MenuItem>
                        <MenuItem value="1">Linha 1</MenuItem>
                        <MenuItem value="2">Linha 2</MenuItem>
                        <MenuItem value="3">Linha 3</MenuItem>
                      </Select>
                    </FormControl>
                    
                    {/* Estação */}
                    <FormControl size="large" sx={{ 
                      minWidth: isMobile ? '100%' : 150, 
                      flex: isMobile ? 'none' : 1,
                      width: isMobile ? '100%' : 'auto'
                    }}>
                      <InputLabel>Estação</InputLabel>
                      <Select
                        value={filters.station_id}
                        onChange={(e) => handleFilterChange('station_id', e.target.value)}
                        label="Estação"
                      >
                        <MenuItem value="">Todas</MenuItem>
                        <MenuItem value="1">Estação 1</MenuItem>
                        <MenuItem value="2">Estação 2</MenuItem>
                        <MenuItem value="3">Estação 3</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Data */}
                    <FormControl size="large" sx={{ 
                      minWidth: isMobile ? '100%' : 150, 
                      flex: isMobile ? 'none' : 1,
                      width: isMobile ? '100%' : 'auto'
                    }}>
                      <TextField
                        type="date"
                        value={customDate}
                        label="Data"
                        onChange={handleDateChange}
                        size="large"
                        sx={{
                          maxWidth: isMobile ? '100%' : 300,
                          width: '100%',
                          '& .MuiInputBase-root': {
                            fontSize: '1rem'
                          }
                        }}
                      />
                    </FormControl>
                  </>
                )}
              </Box>

              {/* Controles no Canto Direito */}
              <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                justifyContent: 'flex-end',
                gap: isMobile ? 2 : 2,
                mt: isMobile ? 2 : 0
              }}>
                {/* Switch de Dados Gerais */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={showGeneralData}
                      onChange={handleGeneralDataToggle}
                      color="primary"
                      size="large"
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ 
                      fontWeight: 600, 
                      color: '#333',
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                      Dados Gerais
                    </Typography>
                  }
                  sx={{
                    justifyContent: isMobile ? 'center' : 'flex-start',
                    mb: isMobile ? 1 : 0
                  }}
                />

                {/* Botões */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'row' : 'row',
                  gap: 2,
                  justifyContent: isMobile ? 'center' : 'flex-end',
                  width: isMobile ? '100%' : 'auto'
                }}>
                  {/* Botão Limpar Filtros */}
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setFilters({
                        workstation_id: '',
                        product_id: '',
                        production_line_id: '',
                        station_id: ''
                      });
                      setCustomDate('');
                    }}
                    size="large"
                    sx={{
                      borderColor: '#666',
                      color: '#666',
                      px: isMobile ? 2 : 3,
                      py: isMobile ? 1 : 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      minWidth: isMobile ? 100 : 120,
                      height: isMobile ? 48 : 56,
                      flex: isMobile ? 1 : 'none',
                      '&:hover': {
                        borderColor: '#333',
                        color: '#333',
                        bgcolor: '#f5f5f5'
                      }
                    }}
                  >
                    Limpar
                  </Button>

                  {/* Botão Filtrar */}
                  <Button
                    variant="contained"
                    onClick={handleRefresh}
                    disabled={loading}
                    size="large"
                    sx={{
                      bgcolor: '#BE3124',
                      px: isMobile ? 2 : 4,
                      py: isMobile ? 1 : 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      minWidth: isMobile ? 100 : 150,
                      height: isMobile ? 48 : 56,
                      flex: isMobile ? 1 : 'none',
                      '&:hover': {
                        bgcolor: '#a0281e'
                      }
                    }}
                  >
                    {loading ? 'Carregando...' : 'Filtrar'}
                  </Button>
                </Box>
              </Box>

              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#666', 
                  mt: isMobile ? 2 : 2,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}
              >
                {showGeneralData 
                  ? "Mostrando dados gerais de produção"
                  : "Mostrando dados específicos por estação"
                }
              </Typography>
            </Paper>

            {/* Dashboard Box */}
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: 400,
                p: 4
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress size={60} sx={{ color: '#BE3124', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#666' }}>
                    Carregando dados...
                  </Typography>
                </Box>
              </Box>
            ) : error ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: 400,
                p: 4
              }}>
                <Box sx={{ 
                  textAlign: 'center',
                  maxWidth: 500,
                  mx: 'auto'
                }}>
                  {/* Ícone de Erro */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 3 
                  }}>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid #f44336',
                      boxShadow: '0 4px 20px rgba(244, 67, 54, 0.2)'
                    }}>
                      <Typography variant="h3" sx={{ 
                        color: '#f44336', 
                        fontWeight: 700,
                        fontSize: isMobile ? '2rem' : '3rem'
                      }}>
                        ⚠️
                      </Typography>
                    </Box>
                  </Box>

                  {/* Título do Erro */}
                  <Typography variant="h5" sx={{ 
                    color: '#d32f2f', 
                    mb: 2,
                    fontWeight: 700,
                    fontSize: isMobile ? '1.3rem' : '1.5rem'
                  }}>
                    Erro ao Carregar Dados
                  </Typography>

                  {/* Mensagem de Erro */}
                  <Typography variant="body1" sx={{ 
                    color: '#666', 
                    mb: 3,
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    lineHeight: 1.6
                  }}>
                    {error.includes('Network Error') || error.includes('fetch') 
                      ? 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.'
                      : error.includes('timeout') || error.includes('Timeout')
                      ? 'A requisição demorou muito para responder. Tente novamente em alguns instantes.'
                      : error.includes('500') || error.includes('Internal Server Error')
                      ? 'Erro interno do servidor. Nossa equipe foi notificada e está trabalhando para resolver.'
                      : error.includes('404') || error.includes('Not Found')
                      ? 'Os dados solicitados não foram encontrados. Verifique os filtros selecionados.'
                      : error.includes('401') || error.includes('Unauthorized')
                      ? 'Sessão expirada. Faça login novamente para continuar.'
                      : error.includes('403') || error.includes('Forbidden')
                      ? 'Você não tem permissão para acessar estes dados.'
                      : 'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.'
                    }
                  </Typography>

                  {/* Dicas de Solução */}
                  <Box sx={{ 
                    background: '#f8f9fa', 
                    p: 2, 
                    borderRadius: 2, 
                    mb: 3,
                    border: '1px solid #e9ecef'
                  }}>
                    <Typography variant="subtitle2" sx={{ 
                      color: '#495057', 
                      mb: 1,
                      fontWeight: 600,
                      fontSize: isMobile ? '0.85rem' : '0.9rem'
                    }}>
                      💡 Dicas para resolver:
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#6c757d',
                      fontSize: isMobile ? '0.8rem' : '0.85rem',
                      lineHeight: 1.5
                    }}>
                      • Verifique sua conexão com a internet<br/>
                      • Tente ajustar os filtros selecionados<br/>
                      • Verifique se a data selecionada é válida<br/>
                      • Se o problema persistir, tente novamente em alguns minutos
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : chartData ? (
              <Paper
                elevation={2}
                sx={{
                  p: isMobile ? 2 : 3,
                  mb: 3,
                  borderRadius: 2,
                  background: '#fff',
                  border: '1px solid #e0e0e0'
                }}
              >
                <Grid container spacing={3} justifyContent="center">
                  {/* Gráfico Principal */}
                  <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 500,
                      p: isMobile ? 1 : 2,
                      width: '100%',
                      maxWidth: 700
                    }}>
                      <CarouselChart
                        percentage={chartData.percentage}
                        meta={chartData.meta}
                        produzido={chartData.produzido}
                        diferenca={chartData.diferenca}
                        defeitos={chartData.defeitos}
                      />
                    </Box>
                  </Grid>

                  {/* Tabela de Horas */}
                  <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{
                      height: 500,
                      display: 'flex',
                      flexDirection: 'column',
                      p: isMobile ? 1 : 2,
                      width: '100%',
                      maxWidth: 600
                    }}>
                      <Box sx={{ flex: 1 }}>
                        <HourTable
                          apiData={chartData?.rawData || []}
                          paperProps={{
                            sx: {
                              borderRadius: 3,
                              background: 'linear-gradient(135deg, #f7f7fa 60%, #fff 100%)',
                              boxShadow: '0 4px 24px 0 rgba(190,49,36,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.04)',
                              border: 'none',
                              height: '100%',
                              width: '100%',
                              minHeight: 450
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: 400,
                p: 4
              }}>
                <Typography variant="h6" sx={{ color: '#666', textAlign: 'center' }}>
                  Nenhum dado disponível
                </Typography>
              </Box>
            )}
          </Box>
        )}
      
        {selectedTab === 'estacoes' && <EstacoesContent />}
        {selectedTab === 'defeitos' && <DefeitosContent />}
      </Box>
    );
  };

  export default ProductionDashboard; 