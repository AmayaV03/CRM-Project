import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectAllLeads } from '../../store/slices/leadsSlice';

const Dashboard = () => {
  const { t } = useTranslation();
  const leads = useSelector(selectAllLeads);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('dashboard.title')}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="primary">
              {t('dashboard.metrics.totalLeads')}
            </Typography>
            <Typography variant="h3">
              {leads.length}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="secondary">
              {t('dashboard.metrics.newThisWeek')}
            </Typography>
            <Typography variant="h3">
              0
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="success.main">
              {t('dashboard.metrics.converted')}
            </Typography>
            <Typography variant="h3">
              0
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="error.main">
              {t('dashboard.metrics.lost')}
            </Typography>
            <Typography variant="h3">
              0
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome to LeadFlow CRM
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your comprehensive lead management system is ready to use. 
          Start by adding some leads or explore the different features.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard; 