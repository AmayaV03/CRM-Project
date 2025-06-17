import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ column, leads, onLeadClick, hideHeader = false }) => {
  // If hideHeader is true, return just the cards without any container
  if (hideHeader) {
    return (
      <Droppable droppableId={column.id} direction="horizontal">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              height: '100%',
            }}
          >
            {leads.map((lead, index) => (
              <Box key={lead.id}>
                <KanbanCard 
                  lead={lead} 
                  index={index} 
                  onClick={() => onLeadClick(lead)}
                />
              </Box>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    );
  }

  // Original column with header
  return (
    <Box sx={{ minWidth: 300, margin: 1 }}>
      <Paper elevation={0} sx={{ p: 2, backgroundColor: 'transparent' }}>
        <Box sx={{ textAlign: 'center', mb: 2 , }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {column.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
          </Typography>
        </Box>
        <Droppable droppableId={column.id}>
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                minHeight: '60vh',
                maxHeight: '70vh',
                overflowY: 'auto',
                p: 1,
                backgroundColor: 'transparent',
              }}
            >
              {leads.map((lead, index) => (
                <Box key={lead.id}>
                  <KanbanCard 
                    lead={lead} 
                    index={index} 
                    onClick={() => onLeadClick(lead)}
                  />
                </Box>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Paper>
    </Box>
  );
};

export default KanbanColumn;
