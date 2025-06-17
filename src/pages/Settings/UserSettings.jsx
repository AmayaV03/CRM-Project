import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Avatar,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const UserSettings = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      avatar: 'JD'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'manager',
      status: 'active',
      avatar: 'JS'
    },
    {
      id: 3,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'user',
      status: 'inactive',
      avatar: 'BW'
    }
  ]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  });

  const handleOpen = (user = null) => {
    if (user) {
      setEditingUser(user);
      setNewUser({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      });
    } else {
      setEditingUser(null);
      setNewUser({
        name: '',
        email: '',
        role: 'user',
        status: 'active'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
    setNewUser({
      name: '',
      email: '',
      role: 'user',
      status: 'active'
    });
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              status: newUser.status,
              avatar: newUser.name.split(' ').map(n => n[0]).join('')
            }
          : user
      ));
    } else {
      setUsers([...users, { 
        id: Math.max(...users.map(u => u.id)) + 1,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        avatar: newUser.name.split(' ').map(n => n[0]).join('')
      }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">{t('settings.users.title')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          {t('common.add')}
        </Button>
      </Box>

      <Paper>
        <List>
          {users.map((user) => (
            <ListItem key={user.id}>
              <Avatar sx={{ mr: 2 }}>{user.avatar}</Avatar>
              <ListItemText
                primary={user.name}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                    <Chip
                      label={user.role}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={user.status}
                      size="small"
                      color={user.status === 'active' ? 'success' : 'default'}
                    />
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleOpen(user)} sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(user.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? t('settings.users.edit') : t('settings.users.add')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={t('common.name')}
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('common.email')}
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>{t('settings.users.role')}</InputLabel>
              <Select
                value={newUser.role}
                label={t('settings.users.role')}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <MenuItem value="admin">{t('settings.users.roles.admin')}</MenuItem>
                <MenuItem value="manager">{t('settings.users.roles.manager')}</MenuItem>
                <MenuItem value="user">{t('settings.users.roles.user')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('settings.users.status')}</InputLabel>
              <Select
                value={newUser.status}
                label={t('settings.users.status')}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
              >
                <MenuItem value="active">{t('settings.users.statuses.active')}</MenuItem>
                <MenuItem value="inactive">{t('settings.users.statuses.inactive')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          <Button onClick={handleSave} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserSettings; 