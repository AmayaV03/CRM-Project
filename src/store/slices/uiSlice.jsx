import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  language: 'en',
  sidebarOpen: true,
  notifications: [],
  loading: {},
  modals: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: state => {
      state.notifications = [];
    },
    setLoading: (state, action) => {
      const { key, isLoading } = action.payload;
      if (isLoading) {
        state.loading[key] = true;
      } else {
        delete state.loading[key];
      }
    },
    openModal: (state, action) => {
      const { modalId, props } = action.payload;
      state.modals[modalId] = { open: true, props };
    },
    closeModal: (state, action) => {
      const { modalId } = action.payload;
      if (state.modals[modalId]) {
        state.modals[modalId].open = false;
      }
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLanguage,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  openModal,
  closeModal,
} = uiSlice.actions;

// Selectors
export const selectTheme = state => state.ui.theme;
export const selectLanguage = state => state.ui.language;
export const selectSidebarOpen = state => state.ui.sidebarOpen;
export const selectNotifications = state => state.ui.notifications;
export const selectLoading = state => state.ui.loading;
export const selectModals = state => state.ui.modals;

export default uiSlice.reducer;
