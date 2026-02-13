import { toast } from 'react-toastify';

export const toastSuccess = (message, options = {}) =>
  toast.success(message, { className: 'custom-toast-success', bodyClassName: 'custom-toast-body', ...options });

export const toastError = (message, options = {}) =>
  toast.error(message, { className: 'custom-toast-error', bodyClassName: 'custom-toast-body', ...options });

export const toastInfo = (message, options = {}) =>
  toast.info(message, { className: 'custom-toast-info', bodyClassName: 'custom-toast-body', ...options }); 