import axios from 'axios';

// Configuração da URL base da API
const API_URL = import.meta.env.VITE_API_URL;

// Constantes para os tipos e estados
export const ESTADO_CHOICES = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'em_uso', label: 'Em Uso' },
  { value: 'manutencao', label: 'Em Manutenção' }
];

export const TIPO_CHOICES = [
  { value: 'equipamento', label: 'Equipamento' },
  { value: 'ferramenta', label: 'Ferramenta' },
  { value: 'material', label: 'Material' },
  { value: 'outro', label: 'Outro' }
];

// Função para obter o token de autenticação
export const getAuthToken = () => {
  const normalToken = localStorage.getItem('access_token');
  const googleToken = localStorage.getItem('google_access_token');
  return normalToken || googleToken;
};

// Função para criar as options padrão do axios
const createAxiosOptions = (method, endpoint, data = null) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const options = {
    method,
    url: `${API_URL}/api${endpoint}`,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  if (data) {
    options.headers['Content-Type'] = 'application/json';
    options.data = data;
  }

  return options;
};

// Função para listar todos os dispositivos
export const listAllDevices = async () => {
  try {
    console.log('Iniciando busca de dispositivos...');
    
    const options = createAxiosOptions('GET', '/devices/');
    console.log('Options da requisição:', options);

    const response = await axios.request(options);
    console.log('Resposta completa:', response);
    console.log('Dados da resposta:', response.data);

    // Verifica se a resposta está no formato esperado
    let devices = [];
    
    if (response.data && Array.isArray(response.data)) {
      devices = response.data;
    } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
      devices = response.data.results;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      devices = response.data.data;
    } else if (response.data && typeof response.data === 'object') {
      devices = [response.data];
    } else {
      console.error('Formato não reconhecido:', response.data);
      throw new Error('Formato de resposta não reconhecido');
    }

    // Garante que todos os campos necessários existam
    devices = devices.map(device => ({
      id: device.id,
      nome: device.nome || '',
      descricao: device.descricao || '',
      tipo: device.tipo || '',
      estado: device.estado || ''
    }));

    console.log('Dispositivos processados:', devices);
    return devices;

  } catch (error) {
    console.error('Erro detalhado:', {
      mensagem: error.message,
      status: error.response?.status,
      dados: error.response?.data,
      headers: error.response?.headers,
      config: error.config
    });
    throw error;
  }
};

// Função para criar um novo dispositivo
export const createDevice = async (deviceData) => {
  try {
    console.log('Criando dispositivo:', deviceData);
    
    const options = createAxiosOptions('POST', '/devices/', deviceData);
    console.log('Options da requisição:', options);

    const response = await axios.request(options);
    console.log('Resposta da criação:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar dispositivo:', {
      mensagem: error.message,
      status: error.response?.status,
      dados: error.response?.data
    });
    throw error;
  }
};

// Função para atualizar um dispositivo
export const updateDevice = async (deviceId, deviceData) => {
  try {
    console.log('Atualizando dispositivo:', deviceId, deviceData);
    
    const options = createAxiosOptions('PUT', `/devices/${deviceId}/`, deviceData);
    console.log('Options da requisição:', options);

    const response = await axios.request(options);
    console.log('Resposta da atualização:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar dispositivo:', {
      mensagem: error.message,
      status: error.response?.status,
      dados: error.response?.data
    });
    throw error;
  }
};

// Função para deletar um dispositivo
export const deleteDevice = async (deviceId) => {
  try {
    console.log('Deletando dispositivo:', deviceId);
    
    const options = createAxiosOptions('DELETE', `/devices/${deviceId}/`);
    console.log('Options da requisição:', options);

    await axios.request(options);
    console.log('Dispositivo deletado com sucesso');
  } catch (error) {
    console.error('Erro ao deletar dispositivo:', {
      mensagem: error.message,
      status: error.response?.status,
      dados: error.response?.data
    });
    throw error;
  }
}; 