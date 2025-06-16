import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Leads = () => {
  const { t, i18n } = useTranslation();

  return (
    <Box sx={{ 
      width: '100%',
      direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
      textAlign: i18n.language === 'ar' ? 'right' : 'left'
    }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('leads.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Leads management page coming soon...
      </Typography>
    </Box>
  );
};

export default Leads; 