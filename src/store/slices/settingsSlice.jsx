import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  leadStatuses: [
    { id: 'open', name: 'Open', color: '#2196F3', displayOrder: 1, active: true },
    { id: 'contacted', name: 'Contacted', color: '#FF9800', displayOrder: 2, active: true },
    { id: 'qualified', name: 'Qualified', color: '#9C27B0', displayOrder: 3, active: true },
    { id: 'proposal', name: 'Proposal', color: '#3F51B5', displayOrder: 4, active: true },
    { id: 'negotiation', name: 'Negotiation', color: '#795548', displayOrder: 5, active: true },
    { id: 'closed-won', name: 'Closed Won', color: '#4CAF50', displayOrder: 6, active: true },
    { id: 'closed-lost', name: 'Closed Lost', color: '#F44336', displayOrder: 7, active: true },
    { id: 'cold', name: 'Cold', color: '#607D8B', displayOrder: 8, active: true },
  ],
  leadSources: [
    { id: 'website', name: 'Website', active: true },
    { id: 'referral', name: 'Referral', active: true },
    { id: 'social-media', name: 'Social Media', active: true },
    { id: 'email-campaign', name: 'Email Campaign', active: true },
    { id: 'phone-call', name: 'Phone Call', active: true },
    { id: 'trade-show', name: 'Trade Show', active: true },
    { id: 'advertisement', name: 'Advertisement', active: true },
    { id: 'other', name: 'Other', active: true },
  ],
  users: [
    { 
      id: 'admin-1', 
      name: 'Admin User', 
      email: 'admin@crm.com', 
      roles: ['admin'], 
      active: true 
    },
    { 
      id: 'sales-1', 
      name: 'Sales Manager', 
      email: 'sales.manager@crm.com', 
      roles: ['sales_manager'], 
      active: true 
    },
    { 
      id: 'rep-1', 
      name: 'Sales Rep 1', 
      email: 'rep1@crm.com', 
      roles: ['salesperson'], 
      active: true 
    },
    { 
      id: 'rep-2', 
      name: 'Sales Rep 2', 
      email: 'rep2@crm.com', 
      roles: ['salesperson'], 
      active: true 
    },
  ],
  appSettings: {
    companyName: 'LeadFlow CRM',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    timezone: 'UTC',
    currency: 'USD',
    defaultLanguage: 'en',
    coldLeadThreshold: 15, // days
    autoBackup: true,
    emailNotifications: true,
  },
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    // Lead Status Management
    addLeadStatus: (state, action) => {
      const newStatus = {
        id: uuidv4(),
        ...action.payload,
        displayOrder: state.leadStatuses.length + 1,
        active: true,
      };
      state.leadStatuses.push(newStatus);
    },
    updateLeadStatus: (state, action) => {
      const { id, ...updates } = action.payload;
      const statusIndex = state.leadStatuses.findIndex(status => status.id === id);
      if (statusIndex !== -1) {
        state.leadStatuses[statusIndex] = { ...state.leadStatuses[statusIndex], ...updates };
      }
    },
    deleteLeadStatus: (state, action) => {
      const statusId = action.payload;
      state.leadStatuses = state.leadStatuses.filter(status => status.id !== statusId);
    },
    reorderLeadStatuses: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.leadStatuses.splice(sourceIndex, 1);
      state.leadStatuses.splice(destinationIndex, 0, removed);
      
      // Update display order
      state.leadStatuses.forEach((status, index) => {
        status.displayOrder = index + 1;
      });
    },
    // Lead Source Management
    addLeadSource: (state, action) => {
      const newSource = {
        id: uuidv4(),
        ...action.payload,
        active: true,
      };
      state.leadSources.push(newSource);
    },
    updateLeadSource: (state, action) => {
      const { id, ...updates } = action.payload;
      const sourceIndex = state.leadSources.findIndex(source => source.id === id);
      if (sourceIndex !== -1) {
        state.leadSources[sourceIndex] = { ...state.leadSources[sourceIndex], ...updates };
      }
    },
    deleteLeadSource: (state, action) => {
      const sourceId = action.payload;
      state.leadSources = state.leadSources.filter(source => source.id !== sourceId);
    },
    // User Management
    addUser: (state, action) => {
      const newUser = {
        id: uuidv4(),
        ...action.payload,
        active: true,
      };
      state.users.push(newUser);
    },
    updateUser: (state, action) => {
      const { id, ...updates } = action.payload;
      const userIndex = state.users.findIndex(user => user.id === id);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...updates };
      }
    },
    deactivateUser: (state, action) => {
      const userId = action.payload;
      const userIndex = state.users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        state.users[userIndex].active = false;
      }
    },
    // App Settings
    updateAppSettings: (state, action) => {
      state.appSettings = { ...state.appSettings, ...action.payload };
    },
    resetAppSettings: state => {
      state.appSettings = initialState.appSettings;
    },
  },
});

export const {
  setLoading,
  setError,
  addLeadStatus,
  updateLeadStatus,
  deleteLeadStatus,
  reorderLeadStatuses,
  addLeadSource,
  updateLeadSource,
  deleteLeadSource,
  addUser,
  updateUser,
  deactivateUser,
  updateAppSettings,
  resetAppSettings,
} = settingsSlice.actions;

// Selectors
export const selectLeadStatuses = state => state.settings.leadStatuses;
export const selectActiveLeadStatuses = state => 
  state.settings.leadStatuses.filter(status => status.active);
export const selectLeadSources = state => state.settings.leadSources;
export const selectActiveLeadSources = state => 
  state.settings.leadSources.filter(source => source.active);
export const selectUsers = state => state.settings.users;
export const selectActiveUsers = state => 
  state.settings.users.filter(user => user.active);
export const selectAppSettings = state => state.settings.appSettings;
export const selectSettingsLoading = state => state.settings.loading;
export const selectSettingsError = state => state.settings.error;

// Utility selectors
export const selectLeadStatusById = (state, statusId) =>
  state.settings.leadStatuses.find(status => status.id === statusId);
export const selectLeadSourceById = (state, sourceId) =>
  state.settings.leadSources.find(source => source.id === sourceId);
export const selectUserById = (state, userId) =>
  state.settings.users.find(user => user.id === userId);

export default settingsSlice.reducer; 