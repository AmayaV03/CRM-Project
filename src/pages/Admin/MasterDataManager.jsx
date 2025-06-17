import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const MasterDataManager = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItemName, setNewItemName] = useState('');

  // Sample data - in a real app, this would come from your backend
  const [masterData, setMasterData] = useState({
    statuses: [
      { id: 1, key: 'new', name: t('masterData.status.new') },
      { id: 2, key: 'contacted', name: t('masterData.status.contacted') },
      { id: 3, key: 'qualified', name: t('masterData.status.qualified') },
      { id: 4, key: 'proposal', name: t('masterData.status.proposal') },
      { id: 5, key: 'negotiation', name: t('masterData.status.negotiation') },
      { id: 6, key: 'closed', name: t('masterData.status.closed') },
      { id: 7, key: 'lost', name: t('masterData.status.lost') }
    ],
    sources: [
      { id: 1, key: 'website', name: t('masterData.source.website') },
      { id: 2, key: 'referral', name: t('masterData.source.referral') },
      { id: 3, key: 'social', name: t('masterData.source.social') },
      { id: 4, key: 'email', name: t('masterData.source.email') },
      { id: 5, key: 'phone', name: t('masterData.source.phone') },
      { id: 6, key: 'other', name: t('masterData.source.other') }
    ],
    categories: [
      { id: 1, key: 'hot', name: t('masterData.category.hot') },
      { id: 2, key: 'warm', name: t('masterData.category.warm') },
      { id: 3, key: 'cold', name: t('masterData.category.cold') }
    ]
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setNewItemName('');
    setOpenDialog(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setOpenDialog(true);
  };

  const handleDeleteItem = (item) => {
    // In a real app, this would make an API call
    const category = ['statuses', 'sources', 'categories'][activeTab];
    setMasterData(prev => ({
      ...prev,
      [category]: prev[category].filter(i => i.id !== item.id)
    }));
  };

  const handleSaveItem = () => {
    const category = ['statuses', 'sources', 'categories'][activeTab];
    if (editingItem) {
      // Update existing item
      setMasterData(prev => ({
        ...prev,
        [category]: prev[category].map(item =>
          item.id === editingItem.id ? { ...item, name: newItemName } : item
        )
      }));
    } else {
      // Add new item
      const newItem = {
        id: Date.now(),
        key: newItemName.toLowerCase().replace(/\s+/g, '_'),
        name: newItemName
      };
      setMasterData(prev => ({
        ...prev,
        [category]: [...prev[category], newItem]
      }));
    }
    setOpenDialog(false);
  };

  const getCategoryTitle = () => {
    switch (activeTab) {
      case 0:
        return t('masterData.titles.statuses');
      case 1:
        return t('masterData.titles.sources');
      case 2:
        return t('masterData.titles.categories');
      default:
        return '';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('masterData.title')}
      </Typography>
      
      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={t('masterData.tabs.statuses')} />
          <Tab label={t('masterData.tabs.sources')} />
          <Tab label={t('masterData.tabs.categories')} />
        </Tabs>

        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {getCategoryTitle()}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
            >
              {t('masterData.actions.add')}
            </Button>
          </Box>

          <List>
            {masterData[['statuses', 'sources', 'categories'][activeTab]].map((item) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <Box>
                    <IconButton edge="end" onClick={() => handleEditItem(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteItem(item)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingItem ? t('masterData.dialog.edit') : t('masterData.dialog.add')}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('masterData.dialog.name')}
            fullWidth
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSaveItem} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MasterDataManager; 