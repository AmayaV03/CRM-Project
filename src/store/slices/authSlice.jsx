import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  roles: [],
  permissions: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.roles = user.roles || [];
      state.permissions = user.permissions || [];
      state.loading = false;
      state.error = null;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.roles = [];
      state.permissions = [];
      state.loading = false;
      state.error = null;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  logout,
  updateUser,
  clearError,
} = authSlice.actions;

// Selectors
export const selectUser = state => state.auth.user;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectAuthLoading = state => state.auth.loading;
export const selectAuthError = state => state.auth.error;
export const selectUserRoles = state => state.auth.roles;
export const selectUserPermissions = state => state.auth.permissions;

// Role-based selectors
export const selectIsAdmin = state => 
  state.auth.roles.includes('admin');
export const selectIsSalesManager = state => 
  state.auth.roles.includes('sales_manager') || state.auth.roles.includes('admin');
export const selectIsSalesperson = state => 
  state.auth.roles.includes('salesperson') || 
  state.auth.roles.includes('sales_manager') || 
  state.auth.roles.includes('admin');

// Permission-based selectors
export const selectCanManageLeads = state =>
  state.auth.permissions.includes('manage_leads') || selectIsAdmin(state);
export const selectCanReassignLeads = state =>
  state.auth.permissions.includes('reassign_leads') || selectIsSalesManager(state);
export const selectCanViewReports = state =>
  state.auth.permissions.includes('view_reports') || selectIsSalesManager(state);
export const selectCanManageUsers = state =>
  state.auth.permissions.includes('manage_users') || selectIsAdmin(state);

export default authSlice.reducer; 