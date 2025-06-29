// LeadsList.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Chip,
  useTheme,
  styled,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import format from 'date-fns/format';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { selectAllLeads, selectLeadsLoading, selectLeadsError, selectFilteredLeads } from '../../store/slices/leadsSlice';
import { translateLeadName } from '../../utils/i18nUtils';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
    transform: 'scale(1.1)',
    transition: 'all 0.2s ease',
  },
  '&.Mui-disabled': {
    color: theme.palette.action.disabled,
  },
}));

const StyledDeleteIcon = styled(DeleteIcon)(({ theme }) => ({
  color: theme.palette.error.main,
}));

const StyledEditIcon = styled(EditIcon)(({ theme }) => ({
  color: theme.palette.warning.main,
}));

// Styled components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    transform: 'translateY(-2px)',
    transition: 'transform 0.2s ease-in-out',
  },
  '&:last-child td': {
    borderBottom: 0,
  },
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : '#ffffff',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontWeight: '500',
  fontSize: '0.95rem',
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
  '& .MuiTableCell-root': {
    fontWeight: '600',
    fontSize: '0.95rem',
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
    borderBottom: `2px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
    padding: theme.spacing(1.5, 2),
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    textAlign: 'center',
    backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
  },
}));

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  '&:first-child': {
    paddingLeft: theme.spacing(3),
  },
  '&:last-child': {
    paddingRight: theme.spacing(3),
  },
  backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 10px 20px rgba(0, 0, 0, 0.3), 0 6px 6px rgba(0, 0, 0, 0.2)'
    : '0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.04)',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : '#ffffff',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.palette.mode === 'dark'
      ? '0 15px 30px rgba(0, 0, 0, 0.4), 0 8px 8px rgba(0, 0, 0, 0.3)'
      : '0 15px 30px rgba(0, 0, 0, 0.15), 0 8px 8px rgba(0, 0, 0, 0.06)',
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 700,
  '& .MuiTable-root': {
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: '100%',
    overflowX: 'auto',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(2),
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: '48px',
  borderRadius: '8px',
  '& .MuiTabs-flexContainer': {
    padding: theme.spacing(0, 2),
  },
  '& .MuiTabs-scroller': {
    overflow: 'visible',
  },
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: '3px',
    borderRadius: '2px',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minWidth: '120px',
  minHeight: '48px',
  textTransform: 'none',
  fontWeight: '500',
  fontSize: '0.9rem',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: '0.75rem',
    fontWeight: 'bold',
    minWidth: '20px',
    height: '20px',
    borderRadius: '12px',
    padding: '0 4px',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  fontWeight: '500',
  color: theme.palette.text.primary,
}));

import LeadForm from './LeadForm';
import LeadDetails from './LeadDetails';

const GridItem = styled(Grid)(({ theme }) => ({
  width: '100%',
}));

const LeadsList = ({ createLead, updateLeadData, deleteLead, fetchLeads }) => {
  const { t } = useTranslation();
  const leads = useSelector(createSelector(
    [selectAllLeads],
    (leads) => leads
  ));
  const loading = useSelector(createSelector(
    [selectLeadsLoading],
    (loading) => loading
  ));
  const error = useSelector(createSelector(
    [selectLeadsError],
    (error) => error
  ));
  const [selectedLead, setSelectedLead] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [deletingLeadId, setDeletingLeadId] = useState(null);
  const today = new Date();

  // Helper functions
  const getStatusColor = (status) => {
    const statusMap = {
      'New': 'primary',
      'Contacted': 'info',
      'Follow-up': 'warning',
      'Won': 'success',
      'Lost': 'error'
    };
    return statusMap[status] || 'default';
  };

  // Helper functions for filtering
  const getFilteredLeads = (leads, filter) => {
    const today = new Date();
    switch (filter) {
      case 'followed':
        return leads.filter(lead => 
          // Show leads that have been contacted or are in follow-up status
          (lead.status === 'Contacted' || lead.status === 'Follow-up') &&
          // Either have a lastFollowupDate or nextFollowupDate (indicating some follow-up activity)
          (lead.lastFollowupDate || lead.nextFollowupDate)
        );
      case 'scheduled':
        return leads.filter(lead => 
          lead.nextFollowupDate && 
          new Date(lead.nextFollowupDate) > today
        );
      case 'notFollowed':
        return leads.filter(lead => 
          // Show leads that need follow-up but haven't been followed up on
          (lead.status === 'New' || 
           (lead.nextFollowupDate && new Date(lead.nextFollowupDate) < today) ||
           (lead.status === 'Contacted' && !lead.lastFollowupDate && !lead.nextFollowupDate))
        );
      default:
        return leads;
    }
  };

  // Get badge counts for tabs
  const allLeadsCount = leads.length;
  const followedCount = leads.filter(lead => 
    // Show leads that have been contacted or are in follow-up status
    (lead.status === 'Contacted' || lead.status === 'Follow-up') &&
    // Either have a lastFollowupDate or nextFollowupDate (indicating some follow-up activity)
    (lead.lastFollowupDate || lead.nextFollowupDate)
  ).length;
  const scheduledCount = leads.filter(lead => 
    lead.nextFollowupDate && 
    new Date(lead.nextFollowupDate) > today
  ).length;
  const notFollowedCount = leads.filter(lead => 
    // Show leads that need follow-up but haven't been followed up on
    (lead.status === 'New' || 
     (lead.nextFollowupDate && new Date(lead.nextFollowupDate) < today) ||
     (lead.status === 'Contacted' && !lead.lastFollowupDate && !lead.nextFollowupDate))
  ).length;

  // Event handlers
  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setOpenForm(true);
  };

  const handleDelete = async (leadId) => {
    try {
      setDeletingLeadId(leadId);
      await deleteLead(String(leadId));
      // Force a re-render by fetching fresh data
      await fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    } finally {
      setDeletingLeadId(null);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedLead(null);
  };

  const handleFormClose = () => {
    handleCloseForm();
  };

  const handleFormSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        id: selectedLead ? String(selectedLead.id) : undefined,
        nextFollowupDate: data.nextFollowupDate ? 
          data.nextFollowupDate : 
          null,
        lastActivity: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (selectedLead) {
        // Pass the complete data object with ID
        await updateLeadData({ 
          id: selectedLead.id,
          ...formattedData
        });
      } else {
        await createLead(formattedData);
      }

      // Only close form after successful submission
      handleCloseForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <StyledTabs value={filter} onChange={(event, newValue) => setFilter(newValue)}>
          <StyledTab value="all" label={
            <StyledBadge badgeContent={allLeadsCount} color="primary">
              <StyledTypography>{t('leads.allLeads')}</StyledTypography>
            </StyledBadge>
          } />
          <StyledTab value="followed" label={
            <StyledBadge badgeContent={followedCount} color="success">
              <StyledTypography>{t('leads.followed')}</StyledTypography>
            </StyledBadge>
          } />
          <StyledTab value="scheduled" label={
            <StyledBadge badgeContent={scheduledCount} color="warning">
              <StyledTypography>{t('leads.scheduled')}</StyledTypography>
            </StyledBadge>
          } />
          <StyledTab value="notFollowed" label={
            <StyledBadge badgeContent={notFollowedCount} color="error">
              <StyledTypography>{t('leads.notFollowed')}</StyledTypography>
            </StyledBadge>
          } />
        </StyledTabs>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedLead(null);
            setOpenForm(true);
          }}
        >
          {t('leads.addNew')}
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error.message || t('errors.generic')}
          </Alert>
        ) : (
          <TableContainer component={Paper} sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: 6,
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: 2,
            },
          }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeaderCell>{t('leads.table.name')}</StyledTableHeaderCell>
                  <StyledTableHeaderCell>{t('leads.table.email')}</StyledTableHeaderCell>
                  <StyledTableHeaderCell>{t('leads.table.phone')}</StyledTableHeaderCell>
                  <StyledTableHeaderCell>{t('leads.table.source')}</StyledTableHeaderCell>
                  <StyledTableHeaderCell>{t('leads.table.status')}</StyledTableHeaderCell>
                  <StyledTableHeaderCell>{t('leads.table.owner')}</StyledTableHeaderCell>
                  <StyledTableHeaderCell>{t('leads.table.actions')}</StyledTableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredLeads(leads, filter).map((lead, index) => (
                  <StyledTableRow key={lead.id.toString() + '-' + Date.now()}>
                    <StyledTableCell>{translateLeadName(lead.name, t)}</StyledTableCell>
                    <StyledTableCell>{lead.email}</StyledTableCell>
                    <StyledTableCell>{lead.phone}</StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        label={t(`leads.sources.${lead.source}`)}
                        color="info"
                        size="small"
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        label={t(`leads.statuses.${lead.status}`)}
                        color={getStatusColor(lead.status)}
                        size="small"
                      />
                    </StyledTableCell>
                    <StyledTableCell>{lead.owner}</StyledTableCell>
                    <StyledTableCell>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <StyledIconButton
                          onClick={() => handleEdit(lead)}
                          title={t('leads.actions.edit')}
                        >
                          <StyledEditIcon />
                        </StyledIconButton>
                        {deletingLeadId === lead.id ? (
                          <CircularProgress size={24} />
                        ) : (
                          <StyledIconButton
                            onClick={() => handleDelete(lead.id)}
                            title={t('leads.actions.delete')}
                          >
                            <StyledDeleteIcon />
                          </StyledIconButton>
                        )}
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
        aria-labelledby="lead-form-title"
        aria-describedby="lead-form-description"
      >
        <DialogTitle id="lead-form-title">
          {selectedLead ? t('leads.editLead') : t('leads.addNew')}
        </DialogTitle>
        <DialogContent>
          <Typography id="lead-form-description" variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {selectedLead ? t('leads.messages.updated') : t('leads.messages.created')}
          </Typography>
          <LeadForm
            lead={selectedLead}
            onSubmit={handleFormSubmit}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LeadsList;
