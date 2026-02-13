import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { createPlan } from '../plansApi';
import { listProducts } from '../../products/productsApi';
import { listOrders } from '../../productionorder/orderApi';
import lineApi from '../../productionline/service/lineApi';
import { CalendarMonth } from '@mui/icons-material';

const shiftOptions = [
  { key: 'Morning', label: 'Manhã', init_time: '07:00', stop_time: '11:59' },
  { key: 'Afternoon', label: 'Tarde', init_time: '12:00', stop_time: '17:59' },
  { key: 'Evening', label: 'Noite', init_time: '18:00', stop_time: '05:59' }
];

const CreateProductionPlanModal = ({ open, onClose, onPlanCreated, selectedDate }) => {
  const [planCode, setPlanCode] = useState('');
  const [productionDay, setProductionDay] = useState('');
  const [productOrder, setProductOrder] = useState(null);
  const [product, setProduct] = useState(null);
  const [productionLine, setProductionLine] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState('');
  const [shifts, setShifts] = useState({});
  const [shiftQuantities, setShiftQuantities] = useState({});
  const [quantityError, setQuantityError] = useState('');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Buscar dados reais ao abrir o modal
  useEffect(() => {
    if (open) {
      setFetching(true);
      Promise.all([
        listProducts(),
        listOrders(),
        lineApi.getAllLines()
      ]).then(([prodResp, orderResp, lineResp]) => {
        setProducts(Array.isArray(prodResp?.results) ? prodResp.results : prodResp);
        setOrders(Array.isArray(orderResp) ? orderResp : orderResp?.results || []);
        setLines(Array.isArray(lineResp) ? lineResp : lineResp?.results || []);
      }).catch(() => setError('Erro ao buscar dados!'))
        .finally(() => setFetching(false));
    }
  }, [open]);

  useEffect(() => {
    if (open && selectedDate && selectedDate !== productionDay) {
      setProductionDay(selectedDate);
    }
  }, [open, selectedDate]);

  const handleClose = () => {
    setPlanCode('');
    setProductionDay('');
    setProductOrder(null);
    setProduct(null);
    setProductionLine(null);
    setTotalQuantity('');
    setShifts({});
    setShiftQuantities({});
    setError('');
    setSuccess('');
    onClose();
  };

  const handleShiftToggle = (key) => {
    setShifts((prev) => {
      if (prev[key]) {
        const { [key]: omit, ...rest } = prev;
        setShiftQuantities(q => {
          const { [key]: omitQ, ...restQ } = q;
          return restQ;
        });
        return rest;
      } else {
        const option = shiftOptions.find(s => s.key === key);
        setShiftQuantities(q => ({ ...q, [key]: '' }));
        return {
          ...prev,
          [key]: { init_time: option.init_time, stop_time: option.stop_time }
        };
      }
    });
  };

  const handleShiftQuantityChange = (key, value) => {
    // Permite apenas números positivos
    let val = value.replace(/[^\d]/g, '');
    if (val.startsWith('0')) val = val.replace(/^0+/, '');
    setShiftQuantities(q => ({ ...q, [key]: val }));
  };

  React.useEffect(() => {
    const total = Number(totalQuantity) || 0;
    const soma = Object.values(shiftQuantities).reduce((acc, v) => acc + (Number(v) || 0), 0);
    if (Object.keys(shifts).length > 0 && soma !== total) {
      setQuantityError(`A soma das quantidades dos turnos (${soma}) deve ser igual à quantidade total (${total}).`);
    } else {
      setQuantityError('');
    }
  }, [shiftQuantities, totalQuantity, shifts]);

  const isFormValid = planCode && productionDay && productOrder && product && productionLine && totalQuantity && Object.keys(shifts).length > 0 && !quantityError && Object.keys(shifts).every(key => shiftQuantities[key]);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const shiftsWithQty = {};
      Object.entries(shifts).forEach(([key, val]) => {
        shiftsWithQty[key] = {
          ...val,
          total_quantity_per_shift: Number(shiftQuantities[key]) || 0
        };
      });
      const payload = {
        plan_code: planCode,
        production_day: productionDay,
        product_order: String(productOrder.id || productOrder),
        product: String(product.id || product),
        production_line: String(productionLine.id || productionLine),
        total_quantity: Number(totalQuantity),
        shifts: shiftsWithQty
      };
      const response = await createPlan(payload);
      setSuccess('Plano criado com sucesso!');
      if (onPlanCreated) onPlanCreated();
      setTimeout(() => {
        setLoading(false);
    handleClose();
      }, 1000);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'Erro ao criar plano!');
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isMobile ? 0 : '10px',
          m: isMobile ? 0 : undefined,
          width: isMobile ? '100vw' : undefined,
          minHeight: isMobile ? '100vh' : undefined
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#FFF5F5',
        borderBottom: '1px solid #E2D9D9',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontSize: isMobile ? 18 : 22,
        py: isMobile ? 1.2 : 2,
        px: isMobile ? 2 : 3
      }}>
      <CalendarMonth sx={{ color: '#000', mr: 1, fontSize: isMobile ? 22 : 28 }} />
      Criar Plano de Produção
      </DialogTitle>
      <DialogContent sx={{ pt: isMobile ? 2 : 3, pb: isMobile ? 1.5 : 2, px: isMobile ? 1.5 : 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component={Paper} elevation={2} sx={{ p: isMobile ? 1.5 : 3, borderRadius: isMobile ? 0 : 3, background: '#fafbfc' }}>
            <Grid container spacing={isMobile ? 1.5 : 3} sx={{ mb: 2 }}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: isMobile ? 14 : 16 }}>Código do Plano</Typography>
                <TextField
                  value={planCode}
                  onChange={e => setPlanCode(e.target.value)}
                  fullWidth
                  required
                  sx={{ minHeight: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: isMobile ? 14 : 16 }}>Data de Produção</Typography>
                <TextField
                  type="date"
                  value={productionDay}
                  onChange={e => setProductionDay(e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ minHeight: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 }}
                />
              </Grid>
                <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: isMobile ? 14 : 16 }}>Quantidade Total</Typography>
                <TextField
                  type="number"
                  value={totalQuantity}
                  onChange={e => {
                    let val = e.target.value.replace(/[^\d]/g, '');
                    if (val.startsWith('0')) val = val.replace(/^0+/, '');
                    setTotalQuantity(val);
                  }}
                  fullWidth
                  required
                  inputProps={{ min: 1, step: 1, pattern: '[0-9]*' }}
                  sx={{ minHeight: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 }}
                />
                <Typography variant="caption" sx={{ color: '#555', mt: 0.5, ml: 0.5, fontSize: isMobile ? 12 : 13 }}>
                  Somente números positivos
                            </Typography>
              </Grid>
                </Grid>
                
            <Grid container spacing={isMobile ? 1.5 : 3} sx={{ mb: 2 }}>
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: isMobile ? 14 : 16 }}>Ordem de Produção</Typography>
                <Autocomplete
                  options={orders}
                  getOptionLabel={o => {
                    const id = o.id || '';
                    const orderCode = o.order_code || o.codigo || o.code || '';
                    const planCode = o.plan_code || '';
                    let label = id;
                    if (orderCode && planCode) label += ` | ${orderCode} | ${planCode}`;
                    else if (orderCode) label += ` | ${orderCode}`;
                    else if (planCode) label += ` | ${planCode}`;
                    return label;
                  }}
                  value={orders.find(o => o.id === (productOrder?.id || productOrder)) || null}
                  onChange={(_, newValue) => setProductOrder(newValue)}
                  fullWidth
                  sx={{
                    width: isMobile ? '100%' : '250px',
                    minHeight: isMobile ? 44 : 56,
                    '& .MuiInputBase-root': { minHeight: isMobile ? 44 : 56, height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 },
                    '& .MuiOutlinedInput-root': { minHeight: isMobile ? 44 : 56, height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Selecione a ordem"
                      fullWidth
                      required
                      InputProps={{
                        ...params.InputProps,
                        sx: { minHeight: isMobile ? 44 : 56, height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 }
                      }}
                      inputProps={{
                        ...params.inputProps,
                        style: { minHeight: isMobile ? 44 : 56, height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: isMobile ? 14 : 16 }}>Linha de Produção</Typography>
                <Autocomplete
                  options={lines}
                  getOptionLabel={l => `${l.id} - ${l.name || l.nome || l.codigo || l.code || ''}`}
                  value={lines.find(l => l.id === (productionLine?.id || productionLine)) || null}
                  onChange={(_, newValue) => setProductionLine(newValue)}
                  fullWidth
                  sx={{
                    width: isMobile ? '100%' : '250px',
                    minHeight: isMobile ? 44 : 56,
                    '& .MuiInputBase-root': { minHeight: isMobile ? 44 : 56, height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 },
                    '& .MuiOutlinedInput-root': { minHeight: isMobile ? 44 : 56, height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 }
                  }}
                  renderInput={(params) => (
                  <TextField
                      {...params}
                      placeholder="Selecione a linha"
                    fullWidth
                      required
                      InputProps={{
                        ...params.InputProps,
                        sx: { minHeight: isMobile ? 44 : 56, height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 }
                    }}
                      inputProps={{
                        ...params.inputProps,
                        style: { minHeight: isMobile ? 44 : 56, height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 }
                              }}
                            />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: isMobile ? 14 : 16 }}>Produto</Typography>
                <Autocomplete
                  options={products}
                  getOptionLabel={p => `${p.id} - ${p.name || p.nome || p.codigo || p.code || ''}`}
                  value={products.find(p => p.id === (product?.id || product)) || null}
                  onChange={(_, newValue) => setProduct(newValue)}
                  fullWidth
                      sx={{ 
                    width: isMobile ? '100%' : '250px',
                    minHeight: isMobile ? 44 : 56,
                    '& .MuiInputBase-root': { minHeight: isMobile ? 44 : 56, height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 },
                    '& .MuiOutlinedInput-root': { minHeight: isMobile ? 44 : 56, height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 }
                      }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Selecione o produto"
                      fullWidth
                      required
                      InputProps={{
                        ...params.InputProps,
                        sx: { minHeight: isMobile ? 44 : 56, height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 }
                      }}
                      inputProps={{
                        ...params.inputProps,
                        style: { minHeight: isMobile ? 44 : 56, height: isMobile ? 44 : 56, fontSize: isMobile ? 14 : 16 }
                              }}
                            />
                  )}
                />
              </Grid>
          </Grid>

            <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, fontSize: isMobile ? 14 : 16 }}>Turnos</Typography>
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 2 }}>
                  {shiftOptions.map(shift => (
                    <Button
                      key={shift.key}
                      variant={shifts[shift.key] ? 'contained' : 'outlined'}
                      color={shifts[shift.key] ? 'primary' : 'inherit'}
                      onClick={() => handleShiftToggle(shift.key)}
                      sx={{ minWidth: isMobile ? '100%' : 120, fontSize: isMobile ? 14 : 16 }}
                      fullWidth={isMobile}
                    >
                      {shift.label}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ mt: 2, ml: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Object.entries(shifts).map(([key, val]) => (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 90, fontSize: isMobile ? 13 : 15 }}>
                        <b>{shiftOptions.find(s => s.key === key)?.label}:</b> {val.init_time} - {val.stop_time}
              </Typography>
                  <TextField
                    type="number"
                        label="Quantidade"
                        value={shiftQuantities[key] || ''}
                        onChange={e => handleShiftQuantityChange(key, e.target.value)}
                        size="small"
                        sx={{ width: isMobile ? '100%' : 120, fontSize: isMobile ? 14 : 16 }}
                        fullWidth={isMobile}
                        inputProps={{ min: 1, step: 1, pattern: '[0-9]*' }}
                        required
                      />
                    </Box>
                  ))}
                  {quantityError && (
                    <Typography color="error" sx={{ mt: 1, fontWeight: 600, fontSize: isMobile ? 13 : 15 }}>
                      {quantityError}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
          )}
      </DialogContent>
      <DialogActions sx={{ p: isMobile ? 1.2 : 2, borderTop: '1px solid #E2D9D9', gap: isMobile ? 1 : 2 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          fullWidth={isMobile}
          sx={{ 
            color: '#666',
            fontSize: isMobile ? 14 : 16,
            py: isMobile ? 1 : 1.5,
            px: isMobile ? 1.5 : 2.5,
            borderRadius: 2,
            minWidth: isMobile ? 90 : 120,
            '&:hover': {
              backgroundColor: '#F5F5F5'
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          fullWidth={isMobile}
          sx={{ 
            backgroundColor: '#BE3124',
            fontSize: isMobile ? 14 : 16,
            py: isMobile ? 1 : 1.5,
            px: isMobile ? 1.5 : 2.5,
            borderRadius: 2,
            minWidth: isMobile ? 110 : 140,
            '&:hover': { 
              backgroundColor: '#A6281D' 
            }
          }}
        >
          {loading ? 'Criando...' : 'Criar Plano'}
        </Button>

      </DialogActions>
    </Dialog>
  );
};

export default CreateProductionPlanModal; 