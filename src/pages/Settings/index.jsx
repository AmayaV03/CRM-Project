import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('settings.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Settings page coming soon...
      </Typography>
    </Box>
  );
};

export default Settings; 