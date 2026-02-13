// This module provides utility functions for formatting and cleaning phone numbers and CPF (Brazilian individual taxpayer registry) strings.
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  if (cleanNumber.length <= 2) return cleanNumber;
  if (cleanNumber.length <= 6) return `(${cleanNumber.substring(0, 2)}) ${cleanNumber.substring(2)}`;
  if (cleanNumber.length <= 10) return `(${cleanNumber.substring(0, 2)}) ${cleanNumber.substring(2, 6)}-${cleanNumber.substring(6)}`;
  return `(${cleanNumber.substring(0, 2)}) ${cleanNumber.substring(2, 7)}-${cleanNumber.substring(7, 11)}`;
};

export const cleanPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  return phoneNumber.replace(/\D/g, '');
};

export const formatCpf = (cpf) => {
  if (!cpf) return '';
  const cleanCpf = cpf.replace(/\D/g, '');
  if (cleanCpf.length <= 3) return cleanCpf;
  if (cleanCpf.length <= 6) return `${cleanCpf.substring(0, 3)}.${cleanCpf.substring(3)}`;
  if (cleanCpf.length <= 9) return `${cleanCpf.substring(0, 3)}.${cleanCpf.substring(3, 6)}.${cleanCpf.substring(6)}`;
  return `${cleanCpf.substring(0, 3)}.${cleanCpf.substring(3, 6)}.${cleanCpf.substring(6, 9)}-${cleanCpf.substring(9, 11)}`;
};

export const cleanCpf = (cpf) => {
  if (!cpf) return '';
  return cpf.replace(/\D/g, '');
};