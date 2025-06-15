// LeadService.js
// Service for handling lead CRUD operations with localStorage
import { v4 as uuidv4 } from 'uuid';

const LEADS_KEY = 'crm_leads';

export const leadService = {
  // Get all leads from localStorage
  getAll: async () => {
    try {
      const leads = localStorage.getItem(LEADS_KEY);
      return leads ? JSON.parse(leads) : [];
    } catch (error) {
      console.error('Error getting leads:', error);
      throw new Error('Failed to get leads', { cause: error });
    }
  },

  // Get a single lead by ID
  getById: async (leadId) => {
    try {
      const leads = await leadService.getAll();
      return leads.find(lead => String(lead.id) === String(leadId)) || null;
    } catch (error) {
      console.error('Error getting lead:', error);
      throw new Error('Failed to get lead', { cause: error });
    }
  },

  // Create a new lead
  create: async (lead) => {
    try {
      const leads = await leadService.getAll();
      const hasDuplicate = leads.some(existingLead => 
        existingLead.email === lead.email
      );
      
      if (hasDuplicate) {
        throw new Error('Lead with this email already exists');
      }
      
      const newLead = {
        ...lead,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        notes: lead.notes || []
      };
      
      const updatedLeads = [...leads, newLead];
      localStorage.setItem(LEADS_KEY, JSON.stringify(updatedLeads));
      return newLead;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw new Error('Failed to create lead', { cause: error });
    }
  },

  // Update an existing lead
  update: async (data) => {
    try {
      const leads = await leadService.getAll();
      
      // Handle both formats: {id: '123', data: {...}} or {id: '123', ...}
      const leadId = data.id || (data && data.id);
      const updateData = data.data || data;
      
      if (!leadId) {
        console.error('No lead ID provided:', data);
        throw new Error('No lead ID provided');
      }

      const leadIndex = leads.findIndex(l => String(l.id) === String(leadId));
      
      if (leadIndex === -1) {
        console.error('Lead not found:', leadId);
        throw new Error('Lead not found');
      }

      // Get the existing lead
      const existingLead = leads[leadIndex];

      // Create updated lead object
      const updatedLead = {
        ...existingLead,
        ...updateData,
        id: String(leadId), // Ensure ID remains consistent
        updatedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      // Update the leads array
      const updatedLeads = [...leads];
      updatedLeads[leadIndex] = updatedLead;

      // Save to localStorage
      localStorage.setItem(LEADS_KEY, JSON.stringify(updatedLeads));
      return updatedLead;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw new Error('Failed to update lead', { cause: error });
    }
  },

  // Delete a lead
  remove: async (id) => {
    try {
      const leads = JSON.parse(localStorage.getItem(LEADS_KEY)) || [];
      const index = leads.findIndex(lead => String(lead.id) === String(id));
      
      if (index === -1) {
        throw new Error('Lead not found');
      }
      
      leads.splice(index, 1);
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
      return true;
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  },

  // Check if lead exists by email
  checkDuplicate: async (email) => {
    try {
      const leads = await leadService.getAll();
      return leads.some(lead => lead.email === email);
    } catch (error) {
      console.error('Error checking for duplicate lead:', error);
      throw new Error('Failed to check for duplicate lead', { cause: error });
      console.error('Error checking duplicate lead:', error);
      throw error;
    }
  }
};
