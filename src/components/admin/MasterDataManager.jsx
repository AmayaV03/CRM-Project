import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const MasterDataManager = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({
    leadSources: [],
    leadStatuses: [],
    industries: [],
  });
  const [selectedType, setSelectedType] = useState('leadSources');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  // Load data from localStorage on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const storedData = localStorage.getItem('crm_master_data');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading master data:', error);
      setError('Failed to load master data');
    }
  };

  const saveData = (newData) => {
    try {
      localStorage.setItem('crm_master_data', JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error saving master data:', error);
      setError('Failed to save master data');
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setNewItem({ name: '', description: '' });
    setOpenDialog(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem({ ...item });
    setOpenDialog(true);
  };

  const handleDelete = (item) => {
    const newData = {
      ...data,
      [selectedType]: data[selectedType].filter(i => i.id !== item.id)
    };
    saveData(newData);
  };

  const handleSave = () => {
    if (!newItem.name.trim()) {
      setError('Name is required');
      return;
    }

    const newData = { ...data };
    if (editingItem) {
      // Update existing item
      newData[selectedType] = data[selectedType].map(item =>
        item.id === editingItem.id ? { ...newItem, id: item.id } : item
      );
    } else {
      // Add new item
      newData[selectedType] = [
        ...data[selectedType],
        { ...newItem, id: Date.now() }
      ];
    }
    saveData(newData);
    setOpenDialog(false);
    setError('');
  };

  const handleClose = () => {
    setOpenDialog(false);
    setError('');
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Data Type Selection */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant={selectedType === 'leadSources' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedType('leadSources')}
                >
                  Lead Sources
                </Button>
                <Button
                  variant={selectedType === 'leadStatuses' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedType('leadStatuses')}
                >
                  Lead Statuses
                </Button>
                <Button
                  variant={selectedType === 'industries' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedType('industries')}
                >
                  Industries
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  {selectedType === 'leadSources' && 'Lead Sources'}
                  {selectedType === 'leadStatuses' && 'Lead Statuses'}
                  {selectedType === 'industries' && 'Industries'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAdd}
                >
                  Add New
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data[selectedType].map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(item)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(item)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingItem ? 'Save Changes' : 'Add Item'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MasterDataManager; 