import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Language as LanguageIcon,
  Backup as BackupIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // Application Settings
    appName: 'LeadFlow CRM',
    appVersion: '1.0.0',
    defaultLanguage: 'en',
    enableNotifications: true,
    enableAutoSave: true,
    autoSaveInterval: 30,
    
    // Data Management
    dataRetentionDays: 365,
    enableDataBackup: true,
    backupFrequency: 'weekly',
    maxLeadsPerPage: 50,
    enableDataExport: true,
    
    // Performance Settings
    enableCaching: true,
    cacheExpiration: 24,
    enableLazyLoading: true,
    maxConcurrentRequests: 5,
    
    // UI/UX Settings
    defaultTheme: 'light',
    enableAnimations: true,
    showAdvancedFeatures: false,
    compactMode: false,
  });

  const [savedSettings, setSavedSettings] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [resetDialog, setResetDialog] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('crm_system_settings');
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        setSettings(parsed);
        setSavedSettings(parsed);
      } catch (error) {
        console.error('Error loading system settings:', error);
      }
    } else {
      setSavedSettings(settings);
    }
  }, []);

  // Check if settings have been modified
  useEffect(() => {
    if (savedSettings) {
      const modified = JSON.stringify(settings) !== JSON.stringify(savedSettings);
      setIsModified(modified);
    }
  }, [settings, savedSettings]);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('crm_system_settings', JSON.stringify(settings));
      setSavedSettings(settings);
      setSaveStatus('success');
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('systemSettingsUpdated', {
        detail: settings
      }));
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving system settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleResetSettings = () => {
    setSettings(savedSettings);
    setResetDialog(false);
  };

  const handleFactoryReset = () => {
    const defaultSettings = {
      appName: 'LeadFlow CRM',
      appVersion: '1.0.0',
      defaultLanguage: 'en',
      enableNotifications: true,
      enableAutoSave: true,
      autoSaveInterval: 30,
      dataRetentionDays: 365,
      enableDataBackup: true,
      backupFrequency: 'weekly',
      maxLeadsPerPage: 50,
      enableDataExport: true,
      enableCaching: true,
      cacheExpiration: 24,
      enableLazyLoading: true,
      maxConcurrentRequests: 5,
      defaultTheme: 'light',
      enableAnimations: true,
      showAdvancedFeatures: false,
      compactMode: false,
    };
    
    setSettings(defaultSettings);
    setResetDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          System Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure system-wide settings and preferences
        </Typography>
      </Box>

      {/* Save Status Alert */}
      {saveStatus && (
        <Alert 
          severity={saveStatus === 'success' ? 'success' : 'error'} 
          sx={{ mb: 3 }}
        >
          {saveStatus === 'success' 
            ? 'Settings saved successfully!' 
            : 'Error saving settings. Please try again.'
          }
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={!isModified}
        >
          Save Changes
        </Button>
        <Button
          variant="outlined"
          startIcon={<RestoreIcon />}
          onClick={() => setResetDialog(true)}
          disabled={!isModified}
        >
          Reset Changes
        </Button>
        {isModified && (
          <Chip
            label="Unsaved Changes"
            color="warning"
            size="small"
          />
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Application Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<SettingsIcon />}
              title="Application Settings"
              subheader="General application configuration"
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Application Name"
                  value={settings.appName}
                  onChange={(e) => handleSettingChange('app', 'appName', e.target.value)}
                  fullWidth
                />
                
                <FormControl fullWidth>
                  <InputLabel>Default Language</InputLabel>
                  <Select
                    value={settings.defaultLanguage}
                    onChange={(e) => handleSettingChange('app', 'defaultLanguage', e.target.value)}
                    label="Default Language"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="ar">Arabic</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableNotifications}
                      onChange={(e) => handleSettingChange('app', 'enableNotifications', e.target.checked)}
                    />
                  }
                  label="Enable Notifications"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableAutoSave}
                      onChange={(e) => handleSettingChange('app', 'enableAutoSave', e.target.checked)}
                    />
                  }
                  label="Enable Auto-Save"
                />

                {settings.enableAutoSave && (
                  <Box>
                    <Typography gutterBottom>
                      Auto-Save Interval: {settings.autoSaveInterval} seconds
                    </Typography>
                    <Slider
                      value={settings.autoSaveInterval}
                      onChange={(e, value) => handleSettingChange('app', 'autoSaveInterval', value)}
                      min={10}
                      max={300}
                      step={10}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Management */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<StorageIcon />}
              title="Data Management"
              subheader="Data retention and backup settings"
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Data Retention (Days)"
                  type="number"
                  value={settings.dataRetentionDays}
                  onChange={(e) => handleSettingChange('data', 'dataRetentionDays', parseInt(e.target.value))}
                  fullWidth
                  InputProps={{ inputProps: { min: 30, max: 3650 } }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableDataBackup}
                      onChange={(e) => handleSettingChange('data', 'enableDataBackup', e.target.checked)}
                    />
                  }
                  label="Enable Data Backup"
                />

                {settings.enableDataBackup && (
                  <FormControl fullWidth>
                    <InputLabel>Backup Frequency</InputLabel>
                    <Select
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange('data', 'backupFrequency', e.target.value)}
                      label="Backup Frequency"
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                )}

                <TextField
                  label="Max Leads Per Page"
                  type="number"
                  value={settings.maxLeadsPerPage}
                  onChange={(e) => handleSettingChange('data', 'maxLeadsPerPage', parseInt(e.target.value))}
                  fullWidth
                  InputProps={{ inputProps: { min: 10, max: 200 } }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableDataExport}
                      onChange={(e) => handleSettingChange('data', 'enableDataExport', e.target.checked)}
                    />
                  }
                  label="Enable Data Export"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<SpeedIcon />}
              title="Performance Settings"
              subheader="System performance optimization"
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableCaching}
                      onChange={(e) => handleSettingChange('performance', 'enableCaching', e.target.checked)}
                    />
                  }
                  label="Enable Caching"
                />

                {settings.enableCaching && (
                  <TextField
                    label="Cache Expiration (Hours)"
                    type="number"
                    value={settings.cacheExpiration}
                    onChange={(e) => handleSettingChange('performance', 'cacheExpiration', parseInt(e.target.value))}
                    fullWidth
                    InputProps={{ inputProps: { min: 1, max: 168 } }}
                  />
                )}

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableLazyLoading}
                      onChange={(e) => handleSettingChange('performance', 'enableLazyLoading', e.target.checked)}
                    />
                  }
                  label="Enable Lazy Loading"
                />

                <TextField
                  label="Max Concurrent Requests"
                  type="number"
                  value={settings.maxConcurrentRequests}
                  onChange={(e) => handleSettingChange('performance', 'maxConcurrentRequests', parseInt(e.target.value))}
                  fullWidth
                  InputProps={{ inputProps: { min: 1, max: 20 } }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* UI/UX Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<LanguageIcon />}
              title="UI/UX Settings"
              subheader="User interface preferences"
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Default Theme</InputLabel>
                  <Select
                    value={settings.defaultTheme}
                    onChange={(e) => handleSettingChange('ui', 'defaultTheme', e.target.value)}
                    label="Default Theme"
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="auto">Auto (System)</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableAnimations}
                      onChange={(e) => handleSettingChange('ui', 'enableAnimations', e.target.checked)}
                    />
                  }
                  label="Enable Animations"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.showAdvancedFeatures}
                      onChange={(e) => handleSettingChange('ui', 'showAdvancedFeatures', e.target.checked)}
                    />
                  }
                  label="Show Advanced Features"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.compactMode}
                      onChange={(e) => handleSettingChange('ui', 'compactMode', e.target.checked)}
                    />
                  }
                  label="Compact Mode"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Reset Dialog */}
      <Dialog open={resetDialog} onClose={() => setResetDialog(false)}>
        <DialogTitle>Reset Settings</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all changes? This will revert all settings to their last saved state.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialog(false)}>Cancel</Button>
          <Button onClick={handleResetSettings} color="primary">
            Reset Changes
          </Button>
          <Button onClick={handleFactoryReset} color="error">
            Factory Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SystemSettings; 