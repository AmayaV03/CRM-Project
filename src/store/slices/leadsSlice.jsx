import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { leadService } from '../../services/leadService';

const initialState = {
  items: JSON.parse(localStorage.getItem('crm_leads')) || [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Example Corp',
      status: 'New',
      source: 'Website',
      assignedTo: 'John Smith',
      nextFollowupDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      notes: []
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      company: 'Tech Solutions',
      status: 'Contacted',
      source: 'Referral',
      assignedTo: 'Sarah Johnson',
      nextFollowupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      notes: []
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      company: 'Digital Solutions',
      status: 'Won',
      source: 'Trade Show',
      assignedTo: 'Sarah Johnson',
      nextFollowupDate: null,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      company: 'Innovate Tech',
      status: 'Lost',
      source: 'Cold Call',
      assignedTo: 'John Smith',
      nextFollowupDate: null,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '5',
      name: 'Robert Wilson',
      email: 'robert@example.com',
      company: 'Tech Innovations',
      status: 'Follow-up',
      source: 'Email Campaign',
      assignedTo: 'Sarah Johnson',
      nextFollowupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '6',
      name: 'Michael Chen',
      email: 'michael@example.com',
      company: 'Tech Ventures',
      status: 'Follow-up',
      source: 'Cold Call',
      assignedTo: 'Sarah Johnson',
      nextFollowupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '7',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      company: 'Tech Innovations',
      status: 'Contacted',
      source: 'Email Campaign',
      assignedTo: 'Sarah Johnson',
      nextFollowupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '8',
      name: 'Emily Davis',
      email: 'emily@example.com',
      company: 'Innovate Tech',
      status: 'Lost',
      source: 'Cold Call',
      assignedTo: 'John Smith',
      nextFollowupDate: null,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '9',
      name: 'Robert William',
      email: 'robert@example.com',
      company: 'Tech Innovations',
      status: 'Follow-up',
      source: 'Email Campaign',
      assignedTo: 'Sarah Johnson',
      nextFollowupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '10',
      name: 'Michael Chen',
      email: 'michael@example.com',
      company: 'Tech Ventures',
      status: 'Follow-up',
      source: 'Cold Call',
      assignedTo: 'Sarah Johnson',
      nextFollowupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '11',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      company: 'Tech Innovations',
      status: 'Contacted',
      source: 'Email Campaign',
      assignedTo: 'Sarah Johnson',
      nextFollowupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '12',
      name: 'Henry Williams',
      email: 'henry@example.com',
      company: 'Innovate Tech',
      status: 'Lost',
      source: 'Cold Call',
      assignedTo: 'John Smith',
      nextFollowupDate: null,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '13',
      name: 'Olivia Davis',
      email: 'olivia@example.com',
      company: 'Tech Innovations',
      status: 'Follow-up',
      source: 'Email Campaign',
      assignedTo: 'Sarah Johnson',
      nextFollowupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    }


    
  ],
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

// Initialize localStorage with dummy data if it's empty
if (!localStorage.getItem('crm_leads')) {
  const dummyLeads = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Example Corp',
      status: 'New',
      source: 'Website',
      assignedTo: 'John Smith',
      nextFollowupDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      notes: []
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      company: 'Tech Solutions',
      status: 'Contacted',
      source: 'Referral',
      assignedTo: 'Sarah Johnson',
      nextFollowupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      notes: []
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      company: 'Digital Solutions',
      status: 'Won',
      source: 'Trade Show',
      assignedTo: 'Sarah Johnson',
      nextFollowupDate: null,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      company: 'Innovate Tech',
      status: 'Lost',
      source: 'Cold Call',
      assignedTo: 'John Smith',
      nextFollowupDate: null,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    },
    {
      id: '5',
      name: 'Robert Wilson',
      email: 'robert@example.com',
      company: 'Tech Innovations',
      status: 'Follow-up',
      source: 'Email Campaign',
      assignedTo: 'Sarah Johnson',
      nextFollowupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    }
  ];
  localStorage.setItem('crm_leads', JSON.stringify(dummyLeads));
}

// Middleware to persist data to localStorage
// Async thunks for CRUD operations with persistence
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async () => {
    const leads = await leadService.getAll();
    localStorage.setItem('crm_leads', JSON.stringify(leads));
    return leads;
  }
);

export const addLead = createAsyncThunk(
  'leads/addLead',
  async (leadData, thunkAPI) => {
    try {
      const newLead = await leadService.create(leadData);
      const currentLeads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
      const updatedLeads = [...currentLeads, newLead];
      localStorage.setItem('crm_leads', JSON.stringify(updatedLeads));
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
      const updatedLead = await leadService.update(data);
      const currentLeads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
      const updatedLeads = currentLeads.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      );
      localStorage.setItem('crm_leads', JSON.stringify(updatedLeads));
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
        status: '',
        owner: '',
        source: '',
        dateRange: { start: null, end: null },
        searchTerm: ''
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