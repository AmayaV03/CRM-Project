import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { AdminPanelSettings, PeopleAlt, Settings } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const AdminTools = () => {
  const { t } = useTranslation();

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 3,
        borderLeft: '4px solid',
        borderColor: 'primary.main',
        backgroundColor: 'background.paper'
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <AdminPanelSettings color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2">
          {t('admin.tools.title', 'Admin Tools')}
        </Typography>
      </Box>
      
      <Box display="flex" gap={2} flexWrap="wrap">
        <Button 
          variant="outlined" 
          startIcon={<PeopleAlt />}
          href="/admin/users"
        >
          {t('admin.tools.manageUsers', 'Manage Users')}
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<Settings />}
          href="/admin/settings"
        >
          {t('admin.tools.systemSettings', 'System Settings')}
        </Button>
      </Box>
    </Paper>
  );
};

export default AdminTools;
