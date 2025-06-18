import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { leadService } from '../../services/leadService';

const initialState = {
  items: JSON.parse(localStorage.getItem('crm_leads')) || [
    // Sample data - if translations aren't working, clear localStorage to refresh this data
    {
      id: '1',
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      company: 'شركة المثال',
      status: 'New',
      source: 'Website',
      assignedTo: 'علي أحمد',
      nextFollowupDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      notes: []
    },
    {
      id: '2',
      name: 'سارة أحمد',
      email: 'sarah@example.com',
      company: 'حلول التقنية',
      status: 'Contacted',
      source: 'Referral',
      assignedTo: 'فاطمة محمد',
      nextFollowupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastFollowupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      notes: []
    },
    {
      id: '3',
      name: 'Mohammed Ali',
      email: 'mohammed@example.com',
      company: 'حلول رقمية',
      status: 'Won',
      source: 'Trade Show',
      assignedTo: 'فاطمة محمد',
      nextFollowupDate: null,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '4',
      name: 'نورا محمد',
      email: 'noura@example.com',
      company: 'تقنيات الابتكار',
      status: 'Lost',
      source: 'Cold Call',
      assignedTo: 'علي أحمد',
      nextFollowupDate: null,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '5',
      name: 'عمر خالد',
      email: 'omar@example.com',
      company: 'الابتكارات التقنية',
      status: 'Follow-up',
      source: 'Email Campaign',
      assignedTo: 'فاطمة محمد',
      nextFollowupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '6',
      name: 'كريم أحمد',
      email: 'kareem@example.com',
      company: 'مشاريع التقنية',
      status: 'Follow-up',
      source: 'Cold Call',
      assignedTo: 'فاطمة محمد',
      nextFollowupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '7',
      name: 'ليلى محمد',
      email: 'layla@example.com',
      company: 'الابتكارات التقنية',
      status: 'Contacted',
      source: 'Email Campaign',
      assignedTo: 'فاطمة محمد',
      nextFollowupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastFollowupDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '8',
      name: 'نورا محمد',
      email: 'noura@example.com',
      company: 'تقنيات الابتكار',
      status: 'Lost',
      source: 'Cold Call',
      assignedTo: 'علي أحمد',
      nextFollowupDate: null,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '9',
      name: 'عمر خالد',
      email: 'omar@example.com',
      company: 'الابتكارات التقنية',
      status: 'Follow-up',
      source: 'Email Campaign',
      assignedTo: 'فاطمة محمد',
      nextFollowupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '10',
      name: 'كريم أحمد',
      email: 'kareem@example.com',
      company: 'مشاريع التقنية',
      status: 'Follow-up',
      source: 'Cold Call',
      assignedTo: 'فاطمة محمد',
      nextFollowupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '11',
      name: 'ليلى محمد',
      email: 'layla@example.com',
      company: 'الابتكارات التقنية',
      status: 'Contacted',
      source: 'Email Campaign',
      assignedTo: 'فاطمة محمد',
      nextFollowupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '12',
      name: 'حسين وليام',
      email: 'hussain@example.com',
      company: 'تقنيات الابتكار',
      status: 'Lost',
      source: 'Cold Call',
      assignedTo: 'علي أحمد',
      nextFollowupDate: null,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '13',
      name: 'أوليفيا داس',
      email: 'olivia@example.com',
      company: 'Tech Innovations',
      status: 'Follow-up',
      source: 'Email Campaign',
      assignedTo: 'سارة أحمد',
      nextFollowupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '14',
      name: 'مايكل تشين',
      email: 'david@example.com',
      company: 'StartupCorp',
      status: 'Contacted',
      source: 'LinkedIn',
      assignedTo: 'روبرت وليام',
      nextFollowupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Overdue
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    }
  ],
  loading: false,
  error: null,
  filter: 'all',
  searchQuery: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  selectedLead: null,
  isFormOpen: false,
  isDetailsOpen: false,
  isDeleteDialogOpen: false,
  leadToDelete: null,
  isReassignDialogOpen: false,
  leadToReassign: null,
  isExportDialogOpen: false,
  exportFormat: 'csv',
  isImportDialogOpen: false,
  importFile: null,
  importProgress: 0,
  importStatus: null,
  isBulkActionDialogOpen: false,
  selectedLeads: [],
  bulkAction: null,
  isFilterDrawerOpen: false,
  filters: {
    status: [],
    source: [],
    assignedTo: [],
    dateRange: {
      start: null,
      end: null
    }
  }
};

// Initialize localStorage with dummy data if it's empty
if (!localStorage.getItem('crm_leads')) {
  const dummyLeads = initialState.items;
  localStorage.setItem('crm_leads', JSON.stringify(dummyLeads));
}

// Middleware to persist data to localStorage
// Async thunks for CRUD operations with persistence
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async () => {
    const leads = await leadService.getAll();
    return leads;
  }
);

export const addLead = createAsyncThunk(
  'leads/addLead',
  async (leadData, thunkAPI) => {
    try {
      // leadService.create() already handles saving to localStorage
      const newLead = await leadService.create(leadData);
      return newLead;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async (data, thunkAPI) => {
    try {
      // leadService.update() already handles saving to localStorage
      const updatedLead = await leadService.update(data);
      return updatedLead;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async (id, thunkAPI) => {
    try {
      const deleted = await leadService.remove(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to delete');
    }
  }
);

// Synchronous reducers for UI state
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
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: [],
        source: [],
        assignedTo: [],
        dateRange: { start: null, end: null }
      };
    },
    setSort: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setSelectedLead: (state, action) => {
      state.selectedLead = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch Leads
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add Lead
      .addCase(addLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLead.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
        state.loading = false;
        state.error = null;
      })
      .addCase(addLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Lead
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.items = state.items.map(lead => 
          lead.id === action.payload.id ? action.payload : lead
        );
        state.loading = false;
        state.error = null;
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Lead
      .addCase(deleteLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.items = state.items.filter(lead => lead.id !== action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const { setLoading, setError, setFilters, clearFilters, setSort, setSelectedLead } = leadsSlice.actions;

// Export slice and reducer
export { leadsSlice };
export default leadsSlice.reducer;

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
  if (filters.source) {
    filteredLeads = filteredLeads.filter(lead => lead.source === filters.source);
  }
  if (filters.assignedTo) {
    filteredLeads = filteredLeads.filter(lead => filters.assignedTo.includes(lead.assignedTo));
  }
  if (filters.dateRange.start && filters.dateRange.end) {
    filteredLeads = filteredLeads.filter(lead => {
      const date = new Date(lead.createdAt);
      return date >= new Date(filters.dateRange.start) && date <= new Date(filters.dateRange.end);
    });
  }
  if (filters.searchQuery) {
    const searchTerm = filters.searchQuery.toLowerCase();
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