import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider
} from '@mui/material';

const PreferenceSettings = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      browser: true,
      desktop: false,
      sound: true
    },
    display: {
      density: 'comfortable',
      fontSize: 'medium',
      showAvatars: true,
      showStatus: true
    },
    data: {
      itemsPerPage: 25,
      defaultView: 'list',
      autoRefresh: true,
      refreshInterval: 5
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    }
  });

  const handleNotificationChange = (setting) => (event) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: event.target.checked
      }
    }));
  };

  const handleDisplayChange = (setting) => (event) => {
    setPreferences(prev => ({
      ...prev,
      display: {
        ...prev.display,
        [setting]: event.target.value
      }
    }));
  };

  const handleDataChange = (setting) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setPreferences(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [setting]: value
      }
    }));
  };

  const handleSecurityChange = (setting) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setPreferences(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically save the preferences to your backend
    console.log('Saving preferences:', preferences);
  };

  return (
    <Box dir={isRTL ? 'rtl' : 'ltr'} sx={{ textAlign: isRTL ? 'right' : 'left' }}>
      <Typography variant="h6" gutterBottom>
        {t('settings.preferences.title')}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Notifications Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {t('settings.preferences.notifications.title')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications.email}
                      onChange={handleNotificationChange('email')}
                    />
                  }
                  label={t('settings.preferences.notifications.email')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications.browser}
                      onChange={handleNotificationChange('browser')}
                    />
                  }
                  label={t('settings.preferences.notifications.browser')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications.desktop}
                      onChange={handleNotificationChange('desktop')}
                    />
                  }
                  label={t('settings.preferences.notifications.desktop')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications.sound}
                      onChange={handleNotificationChange('sound')}
                    />
                  }
                  label={t('settings.preferences.notifications.sound')}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Display Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {t('settings.preferences.display.title')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('settings.preferences.display.density')}</InputLabel>
                  <Select
                    value={preferences.display.density}
                    label={t('settings.preferences.display.density')}
                    onChange={handleDisplayChange('density')}
                  >
                    <MenuItem value="compact">{t('settings.preferences.display.densities.compact')}</MenuItem>
                    <MenuItem value="comfortable">{t('settings.preferences.display.densities.comfortable')}</MenuItem>
                    <MenuItem value="spacious">{t('settings.preferences.display.densities.spacious')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('settings.preferences.display.fontSize')}</InputLabel>
                  <Select
                    value={preferences.display.fontSize}
                    label={t('settings.preferences.display.fontSize')}
                    onChange={handleDisplayChange('fontSize')}
                  >
                    <MenuItem value="small">{t('settings.preferences.display.fontSizes.small')}</MenuItem>
                    <MenuItem value="medium">{t('settings.preferences.display.fontSizes.medium')}</MenuItem>
                    <MenuItem value="large">{t('settings.preferences.display.fontSizes.large')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.display.showAvatars}
                      onChange={(e) => handleDisplayChange('showAvatars')(e)}
                    />
                  }
                  label={t('settings.preferences.display.showAvatars')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.display.showStatus}
                      onChange={(e) => handleDisplayChange('showStatus')(e)}
                    />
                  }
                  label={t('settings.preferences.display.showStatus')}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Data Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {t('settings.preferences.data.title')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('settings.preferences.data.itemsPerPage')}
                  value={preferences.data.itemsPerPage}
                  onChange={handleDataChange('itemsPerPage')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('settings.preferences.data.defaultView')}</InputLabel>
                  <Select
                    value={preferences.data.defaultView}
                    label={t('settings.preferences.data.defaultView')}
                    onChange={handleDataChange('defaultView')}
                  >
                    <MenuItem value="list">{t('settings.preferences.data.views.list')}</MenuItem>
                    <MenuItem value="grid">{t('settings.preferences.data.views.grid')}</MenuItem>
                    <MenuItem value="kanban">{t('settings.preferences.data.views.kanban')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.data.autoRefresh}
                      onChange={handleDataChange('autoRefresh')}
                    />
                  }
                  label={t('settings.preferences.data.autoRefresh')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('settings.preferences.data.refreshInterval')}
                  value={preferences.data.refreshInterval}
                  onChange={handleDataChange('refreshInterval')}
                  disabled={!preferences.data.autoRefresh}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Security Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {t('settings.preferences.security.title')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.security.twoFactor}
                      onChange={handleSecurityChange('twoFactor')}
                    />
                  }
                  label={t('settings.preferences.security.twoFactor')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('settings.preferences.security.sessionTimeout')}
                  value={preferences.security.sessionTimeout}
                  onChange={handleSecurityChange('sessionTimeout')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('settings.preferences.security.passwordExpiry')}
                  value={preferences.security.passwordExpiry}
                  onChange={handleSecurityChange('passwordExpiry')}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: isRTL ? 'flex-start' : 'flex-end' }}>
          <Button variant="contained" onClick={handleSave}>
            {t('common.save')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PreferenceSettings; 