export const produtosExemplo = [
  { id: 1, nome: 'Produto A', categoria: 'Eletrônicos', cor: '#2196F3' },
  { id: 2, nome: 'Produto B', categoria: 'Mecânicos', cor: '#4CAF50' },
  { id: 3, nome: 'Produto C', categoria: 'Químicos', cor: '#FF9800' },
  { id: 4, nome: 'Produto D', categoria: 'Têxteis', cor: '#9C27B0' }
];

export const ordensProducao = [
  { id: 1, numero: 'OP-001', descricao: 'Ordem de Produção 001', status: 'Pendente' },
  { id: 2, numero: 'OP-002', descricao: 'Ordem de Produção 002', status: 'Em Andamento' },
  { id: 3, numero: 'OP-003', descricao: 'Ordem de Produção 003', status: 'Pendente' },
  { id: 4, numero: 'OP-004', descricao: 'Ordem de Produção 004', status: 'Concluída' },
  { id: 5, numero: 'OP-005', descricao: 'Ordem de Produção 005', status: 'Pendente' }
];

export const linhasProducao = [
  { id: 1, nome: 'Linha A', descricao: 'Linha de Produção Principal', capacidade: 1000 },
  { id: 2, nome: 'Linha B', descricao: 'Linha de Produção Secundária', capacidade: 800 },
  { id: 3, nome: 'Linha C', descricao: 'Linha de Produção Especializada', capacidade: 500 },
  { id: 4, nome: 'Linha D', descricao: 'Linha de Produção Rápida', capacidade: 1200 }
];

export const turnos = [
  { id: 'manha', nome: 'Manhã', inicio: '08:00', fim: '16:00' },
  { id: 'tarde', nome: 'Tarde', inicio: '16:00', fim: '00:00' },
  { id: 'noite', nome: 'Noite', inicio: '00:00', fim: '08:00' }
]; 