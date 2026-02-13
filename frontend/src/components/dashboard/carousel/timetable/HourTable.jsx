import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, useTheme, useMediaQuery, Typography, Divider } from '@mui/material';

// Função para processar dados da API
const processarDadosHora = (apiData) => {
  console.log('=== INÍCIO DO PROCESSAMENTO ===');
  console.log('Dados recebidos:', apiData);
  console.log('Tipo:', typeof apiData);
  console.log('É array?', Array.isArray(apiData));
  console.log('Tamanho:', apiData?.length);
  
  if (!apiData || !Array.isArray(apiData)) {
    console.log('❌ Dados inválidos para processamento');
    return [];
  }

  // Filtrar apenas registros individuais (excluir o resumo final)
  const registrosIndividuais = apiData.filter(record => {
    console.log('Verificando registro:', record);
    
    const temRecordId = record && record["record id"];
    const temRegisteredAt = record && record["registered at"];
    const naoTemTotalProduced = !record["total produced"];
    
    console.log('Tem record id?', temRecordId);
    console.log('Tem registered at?', temRegisteredAt);
    console.log('Não tem total produced?', naoTemTotalProduced);
    
    // Verificar se é um registro individual (tem "record id" e "registered at")
    const isIndividual = record && 
           record["record id"] && 
           record["registered at"] && 
           !record["total produced"]; // Excluir registros de resumo
    
    console.log('É registro individual?', isIndividual);
    return isIndividual;
  });

  console.log('✅ Registros individuais filtrados:', registrosIndividuais);
  console.log('Quantidade de registros individuais:', registrosIndividuais.length);

  // Agrupar dados por hora
  const dadosPorHora = {};
  
  registrosIndividuais.forEach((record, index) => {
    console.log(`\n--- Processando registro ${index + 1} ---`);
    console.log('Registro:', record);
    
    // Verificar se o registro tem dados válidos
    if (!record || typeof record !== 'object') {
      console.log('❌ Registro inválido');
      return;
    }

    // Extrair a data do registro
    const dataString = record["registered at"] || record["registered_at"] || record["data"];
    console.log('Data string:', dataString);
    
    if (!dataString) {
      console.log('❌ Registro não tem campo de data');
      return;
    }

    try {
      const data = new Date(dataString);
      console.log('Data parseada:', data);
      
      if (isNaN(data.getTime())) {
        console.log('❌ Data inválida');
        return;
      }

      const hora = `${data.getHours().toString().padStart(2, '0')}:00`;
      console.log('Hora extraída:', hora);

      // Inicializar dados da hora se não existir
      if (!dadosPorHora[hora]) {
        dadosPorHora[hora] = {
          hora: hora,
          produzido: 0,
          defeitos: 0,
          meta: 100, // Meta padrão por hora
          progresso: 0
        };
        console.log('✅ Nova hora criada:', hora);
      }
      
      // Extrair quantidades
      const quantidadeProduzida = parseInt(record["quantity produced"]) || 0;
      const quantidadeDefeituosa = parseInt(record["quantity defective"]) || 0;
      
      console.log('Quantidades extraídas:', {
        produzido: quantidadeProduzida,
        defeitos: quantidadeDefeituosa
      });
      
      // Somar às quantidades existentes
      dadosPorHora[hora].produzido += quantidadeProduzida;
      dadosPorHora[hora].defeitos += quantidadeDefeituosa;
      
      console.log('✅ Dados atualizados para hora', hora, ':', dadosPorHora[hora]);
      
    } catch (error) {
      console.log('❌ Erro ao processar registro:', error);
    }
  });

  console.log('\n=== DADOS AGRUPADOS POR HORA ===');
  console.log('Dados por hora:', dadosPorHora);

  // Calcular progresso para cada hora
  Object.values(dadosPorHora).forEach(dados => {
    dados.progresso = dados.meta > 0 ? Math.round((dados.produzido / dados.meta) * 100) : 0;
  });

  // Converter para array e ordenar por hora
  const dadosProcessados = Object.values(dadosPorHora).sort((a, b) => {
    return a.hora.localeCompare(b.hora);
  });

  console.log('\n=== RESULTADO FINAL ===');
  console.log('Dados processados por hora:', dadosProcessados);
  console.log('Quantidade de horas com dados:', dadosProcessados.length);
  
  return dadosProcessados;
};

const HourTable = ({ paperProps = {}, apiData = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  console.log('\n=== HOURTABLE COMPONENT ===');
  console.log('apiData recebido:', apiData);
  console.log('Tipo de apiData:', typeof apiData);
  console.log('É array?', Array.isArray(apiData));
  console.log('Tamanho:', apiData?.length);
  
  if (apiData && apiData.length > 0) {
    console.log('Primeiro item:', apiData[0]);
    console.log('Campos do primeiro item:', Object.keys(apiData[0]));
    console.log('Último item:', apiData[apiData.length - 1]);
    console.log('Campos do último item:', Object.keys(apiData[apiData.length - 1]));
  }
  
  // Se não há dados da API, usar dados de teste para demonstração
  let dadosParaProcessar = apiData;
  
  if (!apiData || apiData.length === 0) {
    console.log('⚠️ Usando dados de teste para demonstração');
    dadosParaProcessar = [
      {
        "record id": "test-1",
        "line": "line 2",
        "station": "station 2",
        "product": "product 3",
        "product order": "product order 1",
        "quantity produced": 6,
        "quantity defective": 0,
        "registered at": "2025-01-15T14:10:12"
      },
      {
        "record id": "test-2",
        "line": "line 2",
        "station": "station 2",
        "product": "product 3",
        "product order": "product order 1",
        "quantity produced": 4,
        "quantity defective": 1,
        "registered at": "2025-01-15T15:30:45"
      },
      {
        "record id": "test-3",
        "line": "line 2",
        "station": "station 2",
        "product": "product 3",
        "product order": "product order 1",
        "quantity produced": 8,
        "quantity defective": 2,
        "registered at": "2025-01-15T16:45:30"
      },
      {
        "record id": "test-4",
        "line": "line 2",
        "station": "station 2",
        "product": "product 3",
        "product order": "product order 1",
        "quantity produced": 5,
        "quantity defective": 1,
        "registered at": "2025-01-15T14:25:30"
      },
      {
        "record id": "test-5",
        "line": "line 2",
        "station": "station 2",
        "product": "product 3",
        "product order": "product order 1",
        "quantity produced": 7,
        "quantity defective": 0,
        "registered at": "2025-01-15T15:45:15"
      },
      {
        "total produced": 30,
        "total good units": 26,
        "total defective units": 4,
        "quantity planned": 8000,
        "FPY": 86.67,
        "Efficiency_to_planned": 0.38
      }
    ];
  }
  
  console.log('Dados que serão processados:', dadosParaProcessar);
  
  // Processar dados da API
  const dados = processarDadosHora(dadosParaProcessar);
  
  console.log('✅ Dados processados para tabela:', dados);
  console.log('Quantidade de linhas na tabela:', dados.length);
  
  // Se não há dados da API, mostrar mensagem
  if (dados.length === 0) {
    return (
      <Paper
        sx={{
          borderRadius: isMobile ? 2 : 4,
          background: isMobile ? '#fff' : '#fff',
          boxShadow: isMobile ? '0 1px 4px 0 rgba(0, 0, 0, 0.07)' : '0 2px 8px 0 rgba(0, 0, 0, 0.04)',
          border: isMobile ? '1px solid #eee' : 'none',
          height: isMobile ? 'auto' : 500,
          minHeight: isMobile ? 350 : 450,
          p: isMobile ? 1.2 : 2,
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          ...paperProps.sx
        }}
        {...paperProps}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: '#666',
          p: isMobile ? 3 : 2
        }}>
          <Box sx={{ 
            textAlign: 'center',
            p: isMobile ? 2 : 1
          }}>
            <Typography variant="body1" sx={{ 
              fontWeight: 600, 
              textAlign: 'center',
              fontSize: isMobile ? '1.1rem' : '1rem'
            }}>
              Nenhum dado disponível para este período
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#999',
              mt: 1,
              fontSize: isMobile ? '0.9rem' : '0.8rem'
            }}>
              Tente ajustar os filtros ou selecionar outra data
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        borderRadius: isMobile ? 2 : 4,
        background: isMobile ? '#fff' : '#fff',
        boxShadow: isMobile ? '0 1px 4px 0 rgba(0, 0, 0, 0.07)' : '0 2px 8px 0 rgba(0, 0, 0, 0.04)',
        border: isMobile ? '1px solid #eee' : 'none',
        height: isMobile ? 'auto' : 500,
        minHeight: isMobile ? 350 : 450,
        p: isMobile ? 1.2 : 2,
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...paperProps.sx
      }}
      {...paperProps}
    >
      {isMobile ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1.5, 
          maxHeight: 500, 
          overflowY: 'auto',
          p: 1
        }}>
          {dados.map((row, idx) => (
            <Box key={idx} sx={{
              borderRadius: 4,
              boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
              background: '#fff',
              p: 2.5,
              mb: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              borderLeft: `6px solid ${
                row.progresso > 65 ? '#43A047' :
                row.progresso > 35 ? '#FFD600' :
                '#BE3124'}`
            }}>
              {/* Header com Hora */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                mb: 1,
                pb: 1,
                borderBottom: '1px solid #eee'
              }}>
                <Typography variant="subtitle2" sx={{ 
                  fontWeight: 700, 
                  color: '#BE3124', 
                  fontSize: 16 
                }}>
                  Hora
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontWeight: 700, 
                  color: '#222', 
                  fontSize: 18 
                }}>
                  {row.hora}
                </Typography>
              </Box>
              
              {/* Grid de métricas */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 2,
                mb: 2
              }}>
                {/* Produzido */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  background: '#f8f9fa'
                }}>
                  <Typography variant="caption" sx={{ 
                    fontWeight: 600, 
                    color: '#1976d2',
                    mb: 0.5
                  }}>
                    Produzido
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: '#1976d2' 
                  }}>
                    {row.produzido}
                  </Typography>
                </Box>
                
                {/* Defeitos */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  background: '#f8f9fa'
                }}>
                  <Typography variant="caption" sx={{ 
                    fontWeight: 600, 
                    color: '#D32F2F',
                    mb: 0.5
                  }}>
                    Defeitos
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: '#D32F2F' 
                  }}>
                    {row.defeitos}
                  </Typography>
                </Box>
                
                {/* Meta */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  background: '#f8f9fa'
                }}>
                  <Typography variant="caption" sx={{ 
                    fontWeight: 600, 
                    color: '#BE3124',
                    mb: 0.5
                  }}>
                    Meta
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: '#BE3124' 
                  }}>
                    {row.meta}
                  </Typography>
                </Box>
                
                {/* Progresso */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  background: '#f8f9fa'
                }}>
                  <Typography variant="caption" sx={{ 
                    fontWeight: 600, 
                    color: (
                      row.progresso > 65 ? '#43A047' :
                      row.progresso > 35 ? '#FFD600' :
                      '#BE3124'
                    ),
                    mb: 0.5
                  }}>
                    Progresso
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: (
                      row.progresso > 65 ? '#43A047' :
                      row.progresso > 35 ? '#FFD600' :
                      '#BE3124'
                    )
                  }}>
                    {row.progresso}%
                  </Typography>
                </Box>
              </Box>
              
              {/* Barra de Progresso */}
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ 
                  fontWeight: 600, 
                  color: '#666',
                  mb: 1,
                  display: 'block'
                }}>
                  Progresso Visual
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={row.progresso}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: '#eee',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background: (
                        row.progresso > 65 ? '#43A047' :
                        row.progresso > 35 ? '#FFD600' :
                        '#BE3124'
                      )
                    }
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <TableContainer sx={{ maxHeight: 500, overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, 'th:first-of-type': { borderTopLeftRadius: 16 }, 'th:last-of-type': { borderTopRightRadius: 16 } }}>
                <TableCell sx={{ fontWeight: 700, background: '#BE3124', color: '#fff', fontSize: '1.1rem' }}>Hora</TableCell>
                <TableCell sx={{ fontWeight: 700, background: '#BE3124', color: '#fff', fontSize: '1.1rem' }}>Produzido</TableCell>
                <TableCell sx={{ fontWeight: 700, background: '#BE3124', color: '#fff', fontSize: '1.1rem' }}>Defeitos</TableCell>
                <TableCell sx={{ fontWeight: 700, background: '#BE3124', color: '#fff', fontSize: '1.1rem' }}>Meta</TableCell>
                <TableCell sx={{ fontWeight: 700, background: '#BE3124', color: '#fff', fontSize: '1.1rem' }}>Progresso</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dados.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#222' }}>{row.hora}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>{row.produzido}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#D32F2F' }}>{row.defeitos}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#BE3124' }}>{row.meta}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: (
                    row.progresso > 65 ? '#43A047' :
                    row.progresso > 35 ? '#FFD600' :
                    '#BE3124') }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {row.progresso}%
                      <LinearProgress
                        variant="determinate"
                        value={row.progresso}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          flex: 1,
                          minWidth: 40,
                          bgcolor: '#eee',
                          '& .MuiLinearProgress-bar': {
                            background: (
                              row.progresso > 65 ? '#43A047' :
                              row.progresso > 35 ? '#FFD600' :
                              '#BE3124'
                            )
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default HourTable; 