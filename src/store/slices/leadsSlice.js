import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    status: '',
    owner: '',
    source: '',
    dateRange: { start: null, end: null },
    searchTerm: '',
  },
  selectedLead: null,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLeads: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addLead: (state, action) => {
      const newLead = {
        id: uuidv4(),
        ...action.payload,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        notes: [],
      };
      state.items.push(newLead);
    },
    updateLead: (state, action) => {
      const { id, ...updates } = action.payload;
      const leadIndex = state.items.findIndex(lead => lead.id === id);
      if (leadIndex !== -1) {
        state.items[leadIndex] = {
          ...state.items[leadIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    updateLeadStatus: (state, action) => {
      const { id, status } = action.payload;
      const leadIndex = state.items.findIndex(lead => lead.id === id);
      if (leadIndex !== -1) {
        state.items[leadIndex].status = status;
        state.items[leadIndex].updatedAt = new Date().toISOString();
        state.items[leadIndex].lastActivity = new Date().toISOString();
      }
    },
    addLeadNote: (state, action) => {
      const { leadId, content } = action.payload;
      const leadIndex = state.items.findIndex(lead => lead.id === leadId);
      if (leadIndex !== -1) {
        const note = {
          id: uuidv4(),
          content,
          createdAt: new Date().toISOString(),
        };
        state.items[leadIndex].notes.push(note);
        state.items[leadIndex].updatedAt = new Date().toISOString();
        state.items[leadIndex].lastActivity = new Date().toISOString();
      }
    },
    markLeadAsCold: (state, action) => {
      const leadId = action.payload;
      const leadIndex = state.items.findIndex(lead => lead.id === leadId);
      if (leadIndex !== -1) {
        state.items[leadIndex].status = 'cold';
        state.items[leadIndex].updatedAt = new Date().toISOString();
      }
    },
    deleteLead: (state, action) => {
      const leadId = action.payload;
      state.items = state.items.filter(lead => lead.id !== leadId);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: state => {
      state.filters = {
        status: '',
        owner: '',
        source: '',
        dateRange: { start: null, end: null },
        searchTerm: '',
      };
    },
    setSelectedLead: (state, action) => {
      state.selectedLead = action.payload;
    },
    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;
    },
  },
});

export const {
  setLoading,
  setError,
  setLeads,
  addLead,
  updateLead,
  updateLeadStatus,
  addLeadNote,
  markLeadAsCold,
  deleteLead,
  setFilters,
  clearFilters,
  setSelectedLead,
  setSorting,
} = leadsSlice.actions;

// Selectors
export const selectAllLeads = state => state.leads.items;
export const selectLeadsLoading = state => state.leads.loading;
export const selectLeadsError = state => state.leads.error;
export const selectLeadFilters = state => state.leads.filters;
export const selectSelectedLead = state => state.leads.selectedLead;
export const selectLeadsSorting = state => ({
  sortBy: state.leads.sortBy,
  sortOrder: state.leads.sortOrder,
});

// Filtered leads selector
export const selectFilteredLeads = state => {
  const { items, filters, sortBy, sortOrder } = state.leads;
  let filteredLeads = [...items];

  // Apply filters
  if (filters.status) {
    filteredLeads = filteredLeads.filter(lead => lead.status === filters.status);
  }
  if (filters.owner) {
    filteredLeads = filteredLeads.filter(lead => lead.owner === filters.owner);
  }
  if (filters.source) {
    filteredLeads = filteredLeads.filter(lead => lead.source === filters.source);
  }
  if (filters.searchTerm) {
    const searchTerm = filters.searchTerm.toLowerCase();
    filteredLeads = filteredLeads.filter(
      lead =>
        lead.name.toLowerCase().includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm) ||
        lead.phone.includes(searchTerm)
    );
  }

  // Apply sorting
  filteredLeads.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return filteredLeads;
};

export default leadsSlice.reducer; 