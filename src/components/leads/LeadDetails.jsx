// LeadDetails.jsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  Event as EventIcon,
  Note as NoteIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { translateLeadName, translateCompanyName } from '../../utils/i18nUtils';

const LeadDetails = ({ lead, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [openNote, setOpenNote] = useState(false);
  const [note, setNote] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'primary';
      case 'Contacted':
        return 'info';
      case 'Qualified':
        return 'success';
      case 'Lost':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleNoteSubmit = () => {
    if (note.trim()) {
      // Add note to lead (implementation depends on your data structure)
      // For now, we'll just close the dialog
      setOpenNote(false);
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Lead Details
            </Typography>
            <Box>
              <IconButton color="primary" onClick={onEdit}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Company:</strong> {translateCompanyName(lead.company, t)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Email:</strong> {lead.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Phone:</strong> {lead.phone}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Source:</strong> {lead.source}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Assigned To:</strong> {lead.assignedTo ? translateLeadName(lead.assignedTo, t) : t('common.unassigned')}
                  </Typography>
                  {lead.lastFollowupDate && (
                    <Typography variant="body2" color="textSecondary">
                      <strong>Last Follow-up:</strong> {format(new Date(lead.lastFollowupDate), 'MMM d, yyyy')}
                    </Typography>
                  )}
                  <Typography variant="body2" color="textSecondary">
                    <strong>Created:</strong> {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Status Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip
                    label={lead.status}
                    color={getStatusColor(lead.status)}
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  {lead.nextFollowupDate && (
                    <Chip
                      label={`Next Follow-up: ${format(new Date(lead.nextFollowupDate), 'MMM d, yyyy')}`}
                      color={new Date(lead.nextFollowupDate) < new Date() ? 'error' : 'default'}
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Status History
          </Typography>
          <List>
            {lead.statusHistory?.map((history, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Chip
                    label={history.status}
                    color={getStatusColor(history.status)}
                    size="small"
                    sx={{ height: 'auto' }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={format(new Date(history.timestamp), 'MMM d, yyyy')}
                  secondary={history.notes || ''}
                />
              </ListItem>
            ))}
          </List>
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Engagement Timeline
          </Typography>
          <Timeline>
            {lead.engagementTimeline?.map((event, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    <EventIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="body2">
                    {event.type} - {format(new Date(event.timestamp), 'MMM d, yyyy')}
                  </Typography>
                  {event.notes && (
                    <Typography variant="body2" color="textSecondary">
                      {event.notes}
                    </Typography>
                  )}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notes
          </Typography>
          <Box>
            {lead.notes && (
              <Alert severity="info" sx={{ mb: 2 }}>
                {lead.notes}
              </Alert>
            )}
            <Button
              variant="outlined"
              startIcon={<NoteIcon />}
              onClick={() => setOpenNote(true)}
            >
              Add Note
            </Button>
          </Box>
        </Card>
      </Box>

      {/* Add Note Dialog */}
      <Dialog open={openNote} onClose={() => setOpenNote(false)}>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter your note..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNote(false)}>
            Cancel
          </Button>
          <Button onClick={handleNoteSubmit} variant="contained">
            Add Note
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default LeadDetails;
