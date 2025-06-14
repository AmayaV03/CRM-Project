import { format } from 'date-fns';

// Storage keys
const STORAGE_KEYS = {
  LEADS: 'crm_leads',
  SETTINGS: 'crm_settings',
  USER_PREFERENCES: 'crm_user_preferences',
  AUTH_TOKEN: 'crm_auth_token',
  CACHE_VERSION: 'crm_cache_version',
  BACKUP_DATA: 'crm_backup_data',
};

// Current cache version - increment when data structure changes
const CACHE_VERSION = '1.0.0';

class StorageService {
  constructor() {
    this.initializeStorage();
  }

  // Initialize storage with default values
  initializeStorage() {
    try {
      // Check if this is the first time or if cache version has changed
      const currentVersion = localStorage.getItem(STORAGE_KEYS.CACHE_VERSION);
      if (!currentVersion || currentVersion !== CACHE_VERSION) {
        this.migrateData(currentVersion);
        localStorage.setItem(STORAGE_KEYS.CACHE_VERSION, CACHE_VERSION);
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  // Migrate data when cache version changes
  migrateData(oldVersion) {
    try {
      // Backup existing data before migration
      this.createBackup();
      
      // Add migration logic here when needed
      console.log(`Migrating data from version ${oldVersion} to ${CACHE_VERSION}`);
    } catch (error) {
      console.error('Error migrating data:', error);
    }
  }

  // Generic storage methods
  setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  }

  // Lead-specific methods
  getLeads() {
    return this.getItem(STORAGE_KEYS.LEADS, []);
  }

  saveLeads(leads) {
    return this.setItem(STORAGE_KEYS.LEADS, leads);
  }

  addLead(lead) {
    const leads = this.getLeads();
    const newLead = {
      ...lead,
      id: lead.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };
    leads.push(newLead);
    this.saveLeads(leads);
    return newLead;
  }

  updateLead(leadId, updates) {
    const leads = this.getLeads();
    const leadIndex = leads.findIndex(lead => lead.id === leadId);
    
    if (leadIndex !== -1) {
      leads[leadIndex] = {
        ...leads[leadIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveLeads(leads);
      return leads[leadIndex];
    }
    return null;
  }

  deleteLead(leadId) {
    const leads = this.getLeads();
    const filteredLeads = leads.filter(lead => lead.id !== leadId);
    this.saveLeads(filteredLeads);
    return filteredLeads.length !== leads.length;
  }

  getLeadById(leadId) {
    const leads = this.getLeads();
    return leads.find(lead => lead.id === leadId) || null;
  }

  // Settings methods
  getSettings() {
    return this.getItem(STORAGE_KEYS.SETTINGS, {});
  }

  saveSettings(settings) {
    return this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  updateSettings(updates) {
    const currentSettings = this.getSettings();
    const newSettings = { ...currentSettings, ...updates };
    this.saveSettings(newSettings);
    return newSettings;
  }

  // User preferences methods
  getUserPreferences() {
    return this.getItem(STORAGE_KEYS.USER_PREFERENCES, {
      theme: 'light',
      language: 'en',
      sidebarOpen: true,
      dateFormat: 'MM/dd/yyyy',
      timeFormat: '12h',
    });
  }

  saveUserPreferences(preferences) {
    return this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  updateUserPreferences(updates) {
    const currentPreferences = this.getUserPreferences();
    const newPreferences = { ...currentPreferences, ...updates };
    this.saveUserPreferences(newPreferences);
    return newPreferences;
  }

  // Authentication methods
  getAuthToken() {
    return this.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  saveAuthToken(token) {
    return this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  removeAuthToken() {
    return this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Backup and restore methods
  createBackup() {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        version: CACHE_VERSION,
        data: {
          leads: this.getLeads(),
          settings: this.getSettings(),
          userPreferences: this.getUserPreferences(),
        },
      };
      
      this.setItem(STORAGE_KEYS.BACKUP_DATA, backupData);
      return backupData;
    } catch (error) {
      console.error('Error creating backup:', error);
      return null;
    }
  }

  restoreFromBackup() {
    try {
      const backupData = this.getItem(STORAGE_KEYS.BACKUP_DATA);
      if (!backupData) {
        throw new Error('No backup data found');
      }

      const { data } = backupData;
      this.saveLeads(data.leads || []);
      this.saveSettings(data.settings || {});
      this.saveUserPreferences(data.userPreferences || {});
      
      return true;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      return false;
    }
  }

  exportData() {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        version: CACHE_VERSION,
        leads: this.getLeads(),
        settings: this.getSettings(),
        userPreferences: this.getUserPreferences(),
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `crm-export-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.json`;
      link.click();
      
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      return false;
    }
  }

  importData(jsonData) {
    try {
      const importData = JSON.parse(jsonData);
      
      if (importData.leads) {
        this.saveLeads(importData.leads);
      }
      if (importData.settings) {
        this.saveSettings(importData.settings);
      }
      if (importData.userPreferences) {
        this.saveUserPreferences(importData.userPreferences);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Storage statistics
  getStorageStats() {
    try {
      const stats = {
        totalLeads: this.getLeads().length,
        storageUsed: this.calculateStorageSize(),
        lastBackup: this.getItem(STORAGE_KEYS.BACKUP_DATA)?.timestamp || null,
        cacheVersion: CACHE_VERSION,
      };
      return stats;
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return null;
    }
  }

  calculateStorageSize() {
    let totalSize = 0;
    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length;
        }
      }
      return Math.round(totalSize / 1024); // Size in KB
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  // Clear all data
  clearAllData() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }

  // Check if storage is available
  isStorageAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create and export singleton instance
const storageService = new StorageService();
export default storageService; 