import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box,
  TextField,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const UserManagement = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock users data for now - will be replaced with actual API calls
  useEffect(() => {
    // Simulate loading users
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          name: 'Ahmed Mohammed',
          email: 'ahmed@example.com',
          roles: ['admin'],
          status: 'active',
          createdAt: '2024-01-15',
        },
        {
          id: 2,
          name: 'Sarah Ahmed',
          email: 'sarah@example.com',
          roles: ['sales_manager'],
          status: 'active',
          createdAt: '2024-01-10',
        },
        {
          id: 3,
          name: 'Mohammed Ali',
          email: 'mohammed@example.com',
          roles: ['salesperson'],
          status: 'active',
          createdAt: '2024-01-05',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getRoleColor = (roles) => {
    if (roles.includes('admin')) return 'error';
    if (roles.includes('sales_manager')) return 'warning';
    if (roles.includes('salesperson')) return 'info';
    return 'default';
  };

  const getRoleLabel = (roles) => {
    if (roles.includes('admin')) return 'Admin';
    if (roles.includes('sales_manager')) return 'Manager';
    if (roles.includes('salesperson')) return 'Sales Rep';
    return 'User';
  };

  const handleEditUser = (userId) => {
    // TODO: Implement user editing
    console.log('Edit user:', userId);
  };

  const handleDeleteUser = (userId) => {
    // TODO: Implement user deletion
    console.log('Delete user:', userId);
  };

  const handleAddUser = () => {
    // TODO: Implement add user
    console.log('Add new user');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">User Management</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleAddUser}
            size="small"
          >
            Add User
          </Button>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography>Loading users...</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {user.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleLabel(user.roles)}
                        color={getRoleColor(user.roles)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={user.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.createdAt}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit User">
                        <IconButton
                          size="small"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteUser(user.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserManagement; 