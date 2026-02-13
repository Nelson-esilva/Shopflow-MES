// Utilitário para mensagens de sucesso de usuário

export const getUserSuccessMessage = (action) => {
  switch (action) {
    case 'create':
      return 'Usuário criado com sucesso!';
    case 'edit':
      return 'Usuário modificado com sucesso!';
    case 'delete':
      return 'Usuário excluído com sucesso!';
    default:
      return '';
  }
}; 