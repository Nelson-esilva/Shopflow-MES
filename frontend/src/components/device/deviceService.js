import apiClient from '../../services/apiClient';

export const ESTADO_CHOICES = [
  { value: 'disponivel', label: 'Disponivel' },
  { value: 'em_uso', label: 'Em Uso' },
  { value: 'manutencao', label: 'Em Manutencao' },
];

export const TIPO_CHOICES = [
  { value: 'equipamento', label: 'Equipamento' },
  { value: 'ferramenta', label: 'Ferramenta' },
  { value: 'material', label: 'Material' },
  { value: 'outro', label: 'Outro' },
];

const normalizeDevices = (payload) => {
  let devices = [];
  if (Array.isArray(payload)) devices = payload;
  else if (Array.isArray(payload?.results)) devices = payload.results;
  else if (Array.isArray(payload?.data)) devices = payload.data;
  else if (payload && typeof payload === 'object') devices = [payload];

  return devices.map((device) => ({
    id: device.id,
    nome: device.nome || '',
    descricao: device.descricao || '',
    tipo: device.tipo || '',
    estado: device.estado || '',
  }));
};

export const listAllDevices = async () => {
  const { data } = await apiClient.get('/devices/');
  return normalizeDevices(data);
};

export const createDevice = async (deviceData) => {
  const { data } = await apiClient.post('/devices/', deviceData);
  return data;
};

export const updateDevice = async (deviceId, deviceData) => {
  const { data } = await apiClient.put(`/devices/${deviceId}/`, deviceData);
  return data;
};

export const deleteDevice = async (deviceId) => {
  await apiClient.delete(`/devices/${deviceId}/`);
};
