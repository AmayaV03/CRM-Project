import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import leadsSlice from './slices/leadsSlice';
import settingsSlice from './slices/settingsSlice';

// Configure the Redux store with all slices
export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    leads: leadsSlice,
    settings: settingsSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
}); 