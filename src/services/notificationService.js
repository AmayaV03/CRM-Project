import { useSnackbar } from 'notistack';

let snackbarRef;

export const NotificationProvider = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  
  // Store the enqueue function for global access
  snackbarRef = { enqueueSnackbar, closeSnackbar };
  
  return children;
};

export const enqueueSnackbar = (message, options = {}) => {
  if (!snackbarRef?.enqueueSnackbar) {
    console.warn('NotificationProvider not initialized');
    return;
  }
  
  return snackbarRef.enqueueSnackbar(message, {
    variant: 'default',
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    autoHideDuration: 6000,
    ...options
  });
};

export const closeSnackbar = (key) => {
  if (!snackbarRef?.closeSnackbar) {
    console.warn('NotificationProvider not initialized');
    return;
  }
  
  snackbarRef.closeSnackbar(key);
};
