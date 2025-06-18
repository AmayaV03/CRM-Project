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
import { useTranslation } from 'react-i18next';

const SystemSettings = () => {
  const { t } = useTranslation();
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
    };
    
    setSettings(defaultSettings);
    setResetDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('systemSettings.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('systemSettings.description')}
        </Typography>
      </Box>

      {/* Save Status Alert */}
      {saveStatus && (
        <Alert 
          severity={saveStatus === 'success' ? 'success' : 'error'} 
          sx={{ mb: 3 }}
        >
          {saveStatus === 'success' 
            ? t('systemSettings.saveSuccess') 
            : t('systemSettings.saveError')
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
          {t('systemSettings.saveChanges')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<RestoreIcon />}
          onClick={() => setResetDialog(true)}
          disabled={!isModified}
        >
          {t('systemSettings.resetChanges')}
        </Button>
        {isModified && (
          <Chip
            label={t('systemSettings.unsavedChanges')}
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
              title={t('systemSettings.applicationSettings')}
              subheader={t('systemSettings.generalApplicationConfiguration')}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label={t('systemSettings.applicationName')}
                  value={settings.appName}
                  onChange={(e) => handleSettingChange('app', 'appName', e.target.value)}
                  fullWidth
                />
                
                <FormControl fullWidth>
                  <InputLabel>{t('systemSettings.defaultLanguage')}</InputLabel>
                  <Select
                    value={settings.defaultLanguage}
                    onChange={(e) => handleSettingChange('app', 'defaultLanguage', e.target.value)}
                    label={t('systemSettings.defaultLanguage')}
                  >
                    <MenuItem value="en">{t('systemSettings.languages.english')}</MenuItem>
                    <MenuItem value="ar">{t('systemSettings.languages.arabic')}</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableNotifications}
                      onChange={(e) => handleSettingChange('app', 'enableNotifications', e.target.checked)}
                    />
                  }
                  label={t('systemSettings.enableNotifications')}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableAutoSave}
                      onChange={(e) => handleSettingChange('app', 'enableAutoSave', e.target.checked)}
                    />
                  }
                  label={t('systemSettings.enableAutoSave')}
                />

                {settings.enableAutoSave && (
                  <Box>
                    <Typography gutterBottom>
                      {t('systemSettings.autoSaveInterval')}: {settings.autoSaveInterval} {t('systemSettings.seconds')}
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
              title={t('systemSettings.dataManagement')}
              subheader={t('systemSettings.dataRetentionAndBackupSettings')}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label={t('systemSettings.dataRetentionDays')}
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
                  label={t('systemSettings.enableDataBackup')}
                />

                {settings.enableDataBackup && (
                  <FormControl fullWidth>
                    <InputLabel>{t('systemSettings.backupFrequency')}</InputLabel>
                    <Select
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange('data', 'backupFrequency', e.target.value)}
                      label={t('systemSettings.backupFrequency')}
                    >
                      <MenuItem value="daily">{t('systemSettings.daily')}</MenuItem>
                      <MenuItem value="weekly">{t('systemSettings.weekly')}</MenuItem>
                      <MenuItem value="monthly">{t('systemSettings.monthly')}</MenuItem>
                    </Select>
                  </FormControl>
                )}

                <TextField
                  label={t('systemSettings.maxLeadsPerPage')}
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
                  label={t('systemSettings.enableDataExport')}
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
              title={t('systemSettings.performanceSettings')}
              subheader={t('systemSettings.systemPerformanceOptimization')}
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
                  label={t('systemSettings.enableCaching')}
                />

                {settings.enableCaching && (
                  <TextField
                    label={t('systemSettings.cacheExpirationHours')}
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
                  label={t('systemSettings.enableLazyLoading')}
                />

                <TextField
                  label={t('systemSettings.maxConcurrentRequests')}
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
      </Grid>

      {/* Reset Dialog */}
      <Dialog open={resetDialog} onClose={() => setResetDialog(false)}>
        <DialogTitle>{t('systemSettings.resetSettings')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('systemSettings.resetConfirmation')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialog(false)}>{t('systemSettings.cancel')}</Button>
          <Button onClick={handleResetSettings} color="primary">
            {t('systemSettings.resetChanges')}
          </Button>
          <Button onClick={handleFactoryReset} color="error">
            {t('systemSettings.factoryReset')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SystemSettings; 