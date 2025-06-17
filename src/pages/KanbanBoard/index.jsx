import React, { useState, useCallback } from 'react';
import { Box, Typography, Container, CircularProgress, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DragDropProvider } from '../../components/Kanban/DragDropProvider';
import KanbanColumn from '../../components/Kanban/KanbanColumn';
import { useLeads } from '../../hooks/useLeads';

// Define the columns for the Kanban board
const COLUMNS = [
  { id: 'new', title: 'New' },
  { id: 'contacted', title: 'Contacted' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'converted', title: 'Won' },
  { id: 'lost', title: 'Lost' },
];

// Map status to column ID (normalize statuses to handle variations)
const statusToColumnId = {
  'New': 'new',
  'New Lead': 'new',
  'Contacted': 'contacted',
  'In Progress': 'in_progress',
  'InProgress': 'in_progress',
  'Converted': 'converted',
  'Won': 'converted',
  'Lost': 'lost',
};

// Map column ID to status (use consistent status values)
const columnIdToStatus = {
  'new': 'New',
  'contacted': 'Contacted',
  'in_progress': 'In Progress',
  'converted': 'Converted',
  'lost': 'Lost',
};

// Function to normalize lead status
const getNormalizedStatus = (status) => {
  if (!status) return 'New'; // Default status if not provided
  
  const normalizedStatus = status.toString().trim();
  
  // Map variations to standard statuses
  const statusMap = {
    'Won': 'Converted',
    'InProgress': 'In Progress',
    'In Progress': 'In Progress',
    'Qualified': 'In Progress',  // Map 'Qualified' to 'In Progress'
    'New Lead': 'New',
    'New': 'New',
    'Contacted': 'Contacted',
    'Converted': 'Converted',
    'Lost': 'Lost'
  };
  
  return statusMap[normalizedStatus] || 'New'; // Default to 'New' if status not recognized
};

const KanbanBoard = () => {
  const { t } = useTranslation();
  const { leads, loading, error, updateLeadData } = useLeads();
  const [selectedLead, setSelectedLead] = useState(null);

  // Filter leads by status for each column
  const getLeadsByStatus = useCallback((status) => {
    if (!status) return [];
    
    return leads.filter(lead => {
      if (!lead) return false;
      
      const leadStatus = getNormalizedStatus(lead.status);
      return leadStatus === status;
    });
  }, [leads]);

  // Handle drag end event
  const handleDragEnd = useCallback(async (result) => {
    const { source, destination, draggableId } = result;

    // Dropped outside the list or no change in status
    if (!destination || source.droppableId === destination.droppableId) {
      return;
    }

    try {
      // Find the lead being moved
      const lead = leads.find(lead => lead.id === draggableId);
      if (!lead) {
        console.error('Lead not found:', draggableId);
        return;
      }

      // Get the new status from the destination column
      const newStatus = columnIdToStatus[destination.droppableId];
      if (!newStatus) {
        console.error('Invalid destination column:', destination.droppableId);
        return;
      }
      
      console.log(`Moving lead ${lead.id} to status: ${newStatus}`);
      
      // Update the lead status
      const updatedLead = {
        ...lead,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };
      
      await updateLeadData(updatedLead);
      
    } catch (error) {
      console.error('Error updating lead status:', error);
      // You might want to show an error notification here
      // For example: enqueueSnackbar('Failed to update lead status', { variant: 'error' });
    }
  }, [leads, updateLeadData]);

  // Handle lead click to show details
  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    // Here you can open a modal or navigate to lead details
    console.log('Selected lead:', lead);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }


  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error loading leads: {error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('kanban.title')}
        </Typography>
        <Typography variant="body1" color="text.orange" sx={{ mb: 4 }}>
          {t('kanban.subtitle')}
        </Typography>
      </Box>

      <DragDropProvider onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {COLUMNS.map((column) => {
            const columnLeads = getLeadsByStatus(columnIdToStatus[column.id]);
            
            return (
              <Box 
                key={column.id} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  gap: 2,
                  minHeight: 220,
                  width: '100%',
                  p: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1,
                  
                }}
              >
                {/* Status Label */}
                <Box 
                  sx={{ 
                    width: 160, 
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    height: '100%',
                    minHeight: 265,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" mt={8} color='#FF6B35' >
                    {column.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {columnLeads.length} {columnLeads.length === 1 ? 'lead' : 'leads'}
                  </Typography>
                </Box>
                
                {/* Cards Container */}
                <Box 
                  sx={{ 
                    display: 'flex',
                    flex: 1,
                    overflowX: 'auto',
                    gap: 2,
                    p: 1,
                    '&::-webkit-scrollbar': {
                      height: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      borderRadius: '4px',
                    },
                  }}
                >
                  {columnLeads.length > 0 ? (
                    columnLeads.map((lead, index) => (
                      <Box 
                        key={lead.id} 
                        draggable 
                        onClick={() => handleLeadClick(lead)}
                        sx={{
                          minWidth: 280,
                          maxWidth: 280,
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.9,
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s ease-in-out',
                          },
                          '& .MuiPaper-root': {
                            boxShadow: 'none',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%',
                            m: 0,
                          },
                          '&:hover .MuiPaper-root': {
                            boxShadow: 2,
                          }
                        }}
                      >
                        <KanbanColumn
                          column={column}
                          leads={[lead]}
                          onLeadClick={handleLeadClick}
                          hideHeader
                        />
                      </Box>
                    ))
                  ) : (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        minHeight: 100,
                        width: '100%',
                        color: 'text.secondary',
                        fontStyle: 'italic',
                      }}
                    >
                      No {column.title.toLowerCase()} leads
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </DragDropProvider>

      {/* Add Lead Detail Modal/Dialog here */}
    </Container>
  );
};

export default KanbanBoard; 