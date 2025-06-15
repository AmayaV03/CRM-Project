import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice.jsx';
import uiSlice from './slices/uiSlice.jsx';
import leadsSlice from './slices/leadsSlice.jsx';
import settingsSlice from './slices/settingsSlice.jsx';

// Configure the Redux store with all slices
export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    leads: leadsSlice,
    settings: settingsSlice,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    }),
  devTools: process.env.NODE_ENV !== 'production',
});