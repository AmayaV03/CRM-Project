import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Container, Paper, Tabs, Tab } from '@mui/material';
import LanguageSettings from '../settings/LanguageSettings';
import ThemeSettings from '../settings/ThemeSettings';
import RegionalSettings from '../settings/RegionalSettings';
import PreferenceSettings from './PreferenceSettings';

const Settings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('settings.title')}
        </Typography>

        <Paper sx={{ width: '100%', mt: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label={t('settings.tabs.general')} />
            <Tab label={t('settings.tabs.preferences')} />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <LanguageSettings />
                <ThemeSettings />
                <RegionalSettings />
              </Box>
            )}
            {activeTab === 1 && <PreferenceSettings />}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Settings; 