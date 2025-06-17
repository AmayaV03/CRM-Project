import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar, 
  Chip,
  Tooltip,
  IconButton,
  Divider,
  LinearProgress
} from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

// Format currency with compact notation for large numbers
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'N/A';
  
  // Convert string numbers to actual numbers
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return 'N/A';
  
  // For amounts over 1 million, use compact notation (e.g., $1.2M)
  if (Math.abs(numAmount) >= 1000000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(numAmount);
  }
  
  // For amounts over 10,000, use compact notation (e.g., $12K)
  if (Math.abs(numAmount) >= 10000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  }
  
  // For smaller amounts, use standard currency format
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

// Format probability to percentage (handles both decimal 0-1 and percentage 0-100 values)
const formatProbability = (probability) => {
  if (probability === undefined || probability === null) return '0%';
  // If probability is greater than 1, assume it's already a percentage
  const percentage = probability > 1 ? Math.round(probability) : Math.round(probability * 100);
  return `${percentage}%`;
};

// Get probability color (handles both decimal 0-1 and percentage 0-100 values)
const getProbabilityColor = (probability) => {
  if (!probability) return 'info';
  // Convert to decimal if it's a percentage
  const decimalValue = probability > 1 ? probability / 100 : probability;
  if (decimalValue >= 0.8) return 'success';
  if (decimalValue >= 0.5) return 'warning';
  return 'error';
};

// Get initials from name
const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const getStatusColor = (status) => {
  if (!status) return 'default';
  
  // Normalize status for comparison
  const normalizedStatus = status.trim();
  
  const colors = {
    'New': 'primary',
    'New Lead': 'primary',
    'Contacted': 'info',
    'In Progress': 'warning',
    'InProgress': 'warning',
    'Qualified': 'info',  // Same as Contacted
    'Won': 'success',
    'Lost': 'error'
  };
  
  return colors[normalizedStatus] || 'default';
};

// Function to get display status text
const getDisplayStatus = (status) => {
  if (!status) return 'Unknown';
  
  const statusMap = {
    'New Lead': 'New',
    'InProgress': 'In Progress',
    'Won': 'Won'
  };
  
  return statusMap[status] || status;
};

const KanbanCard = ({ lead, index, onClick }) => {
  // Get the display status
  const displayStatus = getDisplayStatus(lead.status);
  
  // Calculate days until follow-up
  const daysUntilFollowup = lead.nextFollowupDate 
    ? formatDistanceToNow(new Date(lead.nextFollowupDate), { addSuffix: true })
    : null;
  
  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          onClick={onClick}
          elevation={0}
          sx={{
            mb: 1,
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            opacity: snapshot.isDragging ? 0.8 : 1,
            transform: snapshot.isDragging ? 'scale(1.02)' : 'none',
            border: 'none',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
            '&:hover': {
              transform: snapshot.isDragging ? 'scale(1.02)' : 'translateY(-2px)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            },
          }}
        >
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            {/* Drag handle and status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box 
                {...provided.dragHandleProps}
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mr: 1,
                  cursor: 'grab',
                  '&:active': {
                    cursor: 'grabbing',
                  },
                }}
              >
                <DragIndicatorIcon color="action" />
              </Box>
              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                {lead.name}
              </Typography>
            </Box>
            <Chip 
              label={displayStatus} 
              size="small" 
              color={getStatusColor(lead.status)}
              sx={{ 
                height: 20, 
                fontSize: '0.7rem',
                fontWeight: 'bold',
                ml: 1,
                minWidth: 80,
                justifyContent: 'center'
              }} 
            />
          </Box>
          
          {/* Company and source */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar 
              sx={{ 
                width: 24, 
                height: 24, 
                mr: 1,
                bgcolor: 'primary.main',
                fontSize: '0.8rem',
                flexShrink: 0
              }}
            >
              {lead.company?.charAt(0)?.toUpperCase() || 'C'}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" noWrap>
                {lead.company || 'No company'}
              </Typography>
              {lead.source && (
                <Chip 
                  label={lead.source} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    height: 18, 
                    fontSize: '0.6rem',
                    mt: 0.5,
                    '& .MuiChip-label': {
                      px: 0.5
                    }
                  }}
                />
              )}
            </Box>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          {/* Sales details */}
          <Box sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoneyIcon color="primary" sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  Deal Size:
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight="medium">
                {formatCurrency(lead.dealAmount || lead.amount || lead.value || lead.total || 0)}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Win Probability:
                </Typography>
                <Typography variant="caption" fontWeight="bold" color={`${getProbabilityColor(lead.winProbability || lead.probability)}.main`}>
                  {formatProbability(lead.winProbability || lead.probability)}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(() => {
                  const prob = lead.winProbability || lead.probability || 0;
                  // If probability is already a percentage (greater than 1), use as is, otherwise convert to percentage
                  return prob > 1 ? Math.min(prob, 100) : Math.round(prob * 100);
                })()} 
                color={getProbabilityColor(lead.winProbability || lead.probability)}
                sx={{ 
                  height: 4, 
                  borderRadius: 2,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 2
                  }
                }} 
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventAvailableIcon color="action" sx={{ fontSize: 14, mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  Expected Close:
                </Typography>
              </Box>
              <Typography variant="caption" fontWeight="medium">
                {lead.expectedCloseDate 
                  ? format(new Date(lead.expectedCloseDate), 'MMM d, yyyy')
                  : 'Not set'}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          {/* Footer with assignee and follow-up */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title={lead.assignedTo || 'Unassigned'}>
                <Avatar 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    mr: 1,
                    bgcolor: 'secondary.main',
                    fontSize: '0.7rem'
                  }}
                >
                  {getInitials(lead.assignedTo || '??')}
                </Avatar>
              </Tooltip>
              <Typography variant="caption" color="text.secondary" noWrap>
                {lead.assignedTo?.split(' ')[0] || 'Unassigned'}
              </Typography>
            </Box>
            
            {lead.nextFollowupDate && (
              <Tooltip title={`Follow-up ${daysUntilFollowup}`}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  bgcolor: 'action.hover',
                  px: 1,
                  py: 0.25,
                  borderRadius: 1
                }}>
                  <EventAvailableIcon color="action" sx={{ fontSize: 12, mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(lead.nextFollowupDate), 'MMM d')}
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default KanbanCard;
