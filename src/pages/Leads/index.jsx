import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLeads } from '../../hooks/useLeads.jsx';
import LeadsList from '../../components/leads/LeadsList';

const Leads = () => {
  const { t } = useTranslation();
  const { leads, loading, error, createLead, updateLeadData, deleteLead, fetchLeads } = useLeads();

  React.useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('leads.title')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Manage your leads, track their status, and assign them to team members
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <LeadsList
          leads={leads}
          loading={loading}
          error={error}
          createLead={createLead}
          updateLeadData={updateLeadData}
          deleteLead={deleteLead}
          fetchLeads={fetchLeads}
        />
      </Box>
    </Container>
  );
};

export default Leads;