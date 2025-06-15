import React, { useState, useEffect } from 'react';
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
  Chip,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Tooltip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  AdminPanelSettings as AdminIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Lock as LockIcon,
  LockReset as LockResetIcon,
  Password as PasswordIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  VpnKey as VpnKeyIcon,
  CheckCircle as CheckCircleIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';

const UserManagementPage = () => {
  const { t } = useTranslation();
  const { user: currentUser, canManageUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [fileInputRef, setFileInputRef] = useState(null);
  const [customPassword, setCustomPassword] = useState('');
  const [showCustomPasswordText, setShowCustomPasswordText] = useState(false);
  const [passwordSetSuccess, setPasswordSetSuccess] = useState(false);
  const [currentStoredPassword, setCurrentStoredPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Form for adding/editing users
  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      department: '',
      roles: [],
      status: 'active',
    },
  });

  // Load users data
  useEffect(() => {
    loadUsers();
  }, []);

  // Local storage functions
  const saveUsersToStorage = (usersData) => {
    try {
      localStorage.setItem('crm_users', JSON.stringify(usersData));
      // Dispatch custom event to notify other components of the update
      window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: { users: usersData } }));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  };

  const getUsersFromStorage = () => {
    try {
      const storedUsers = localStorage.getItem('crm_users');
      if (storedUsers) {
        return JSON.parse(storedUsers);
      }
    } catch (error) {
      console.error('Error loading users from localStorage:', error);
    }
    return null;
  };

  const clearUsersFromStorage = () => {
    try {
      localStorage.removeItem('crm_users');
      setNotification({
        open: true,
        message: 'User data cleared from local storage!',
        severity: 'info'
      });
    } catch (error) {
      console.error('Error clearing users from localStorage:', error);
      setNotification({
        open: true,
        message: 'Error clearing user data!',
        severity: 'error'
      });
    }
  };

  const exportUsersData = () => {
    try {
      const dataStr = JSON.stringify(users, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `crm_users_export_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setNotification({
        open: true,
        message: 'User data exported successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting users:', error);
      setNotification({
        open: true,
        message: 'Error exporting user data!',
        severity: 'error'
      });
    }
  };

  const handleImportUsers = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedUsers = JSON.parse(e.target.result);
            if (Array.isArray(importedUsers)) {
              setUsers(importedUsers);
              saveUsersToStorage(importedUsers);
              setNotification({
                open: true,
                message: `Successfully imported ${importedUsers.length} users!`,
                severity: 'success'
              });
            } else {
              throw new Error('Invalid file format');
            }
          } catch (error) {
            console.error('Error importing users:', error);
            setNotification({
              open: true,
              message: 'Error importing user data. Please check the file format.',
              severity: 'error'
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const loadUsers = async () => {
    setLoading(true);
    
    // Try to load from localStorage first
    const storedUsers = getUsersFromStorage();
    
    if (storedUsers && storedUsers.length > 0) {
      setUsers(storedUsers);
      setLoading(false);
    } else {
      // If no users in localStorage, initialize with default users
      const defaultUsers = [
        {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@crm.com',
          phone: '+1234567890',
          department: 'Administration',
          roles: ['admin'],
          permissions: authService.getRolePermissions(['admin']),
          status: 'active',
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: '2024-01-20T09:15:00Z',
          password: 'password',
          mustChangePassword: false,
          passwordLastChanged: '2024-01-15T10:30:00Z',
        },
        {
          id: 'manager-1',
          name: 'Sales Manager',
          email: 'sales.manager@crm.com',
          phone: '+1234567891',
          department: 'Sales',
          roles: ['sales_manager'],
          permissions: authService.getRolePermissions(['sales_manager']),
          status: 'active',
          createdAt: '2024-01-10T14:20:00Z',
          lastLogin: '2024-01-19T16:45:00Z',
          password: 'password',
          mustChangePassword: false,
          passwordLastChanged: '2024-01-10T14:20:00Z',
        },
        {
          id: 'rep-1',
          name: 'Sales Rep 1',
          email: 'rep1@crm.com',
          phone: '+1234567892',
          department: 'Sales',
          roles: ['salesperson'],
          permissions: authService.getRolePermissions(['salesperson']),
          status: 'active',
          createdAt: '2024-01-05T11:10:00Z',
          lastLogin: '2024-01-20T08:30:00Z',
          password: 'password',
          mustChangePassword: true,
          passwordLastChanged: '2024-01-05T11:10:00Z',
        },
        {
          id: 'rep-2',
          name: 'Sales Rep 2',
          email: 'rep2@crm.com',
          phone: '+1234567893',
          department: 'Sales',
          roles: ['salesperson'],
          permissions: authService.getRolePermissions(['salesperson']),
          status: 'inactive',
          createdAt: '2024-01-03T16:45:00Z',
          lastLogin: '2024-01-15T12:20:00Z',
          password: 'password',
          mustChangePassword: false,
          passwordLastChanged: '2024-01-03T16:45:00Z',
        },
      ];
      
      setUsers(defaultUsers);
      saveUsersToStorage(defaultUsers);
      setLoading(false);
    }
  };

  const getRoleColor = (roles) => {
    if (roles.includes('admin')) return 'error';
    if (roles.includes('sales_manager')) return 'warning';
    if (roles.includes('salesperson')) return 'info';
    return 'default';
  };

  const getRoleLabel = (roles) => {
    if (roles.includes('admin')) return 'Administrator';
    if (roles.includes('sales_manager')) return 'Sales Manager';
    if (roles.includes('salesperson')) return 'Salesperson';
    return 'User';
  };

  const getRoleIcon = (roles) => {
    if (roles.includes('admin')) return <AdminIcon />;
    if (roles.includes('sales_manager')) return <BusinessIcon />;
    return <PersonIcon />;
  };

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    reset({
      name: '',
      email: '',
      phone: '',
      department: '',
      roles: [],
      status: 'active',
    });
    setSelectedUser(null);
    setShowAddDialog(true);
  };

  const handleEditUser = (user) => {
    reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      roles: user.roles,
      status: user.status,
    });
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  // Password Management Functions
  const handlePasswordManagement = (user) => {
    setSelectedUser(user);
    setShowPasswordDialog(true);
    setCustomPassword('');
    setShowCustomPasswordText(false);
    setPasswordSetSuccess(false);
    setShowCurrentPassword(false);
    
    // Check if there's already a stored password for this user
    try {
      const userPasswords = JSON.parse(localStorage.getItem('crm_user_passwords') || '{}');
      if (userPasswords[user.id]) {
        setCurrentStoredPassword(userPasswords[user.id].password);
      } else {
        setCurrentStoredPassword('');
      }
    } catch (error) {
      console.error('Error loading stored password:', error);
      setCurrentStoredPassword('');
    }
  };

  const generateSecurePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    
    // Ensure password has at least one of each required character type
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // Uppercase
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // Lowercase
    password += "0123456789"[Math.floor(Math.random() * 10)]; // Number
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)]; // Special char
    
    // Fill remaining characters
    for (let i = password.length; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const setUserPassword = async () => {
    if (!selectedUser || !customPassword.trim()) {
      setNotification({
        open: true,
        message: 'Please enter a password',
        severity: 'error'
      });
      return;
    }

    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          password: customPassword,
          mustChangePassword: false, // Don't force change for admin-set passwords
          passwordLastChanged: new Date().toISOString(),
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);

    // Also store the password in a separate storage for admin reference
    const userPasswords = JSON.parse(localStorage.getItem('crm_user_passwords') || '{}');
    userPasswords[selectedUser.id] = {
      email: selectedUser.email,
      password: customPassword,
      setBy: currentUser?.name || 'Admin',
      setAt: new Date().toISOString()
    };
    localStorage.setItem('crm_user_passwords', JSON.stringify(userPasswords));

    setPasswordSetSuccess(true);
    
    setNotification({
      open: true,
      message: `Password successfully set for ${selectedUser.name}`,
      severity: 'success'
    });

    // Reset form after 2 seconds
    setTimeout(() => {
      setCustomPassword('');
      setPasswordSetSuccess(false);
      setShowPasswordDialog(false);
    }, 2000);
  };

  const closePasswordDialog = () => {
    setShowPasswordDialog(false);
    setSelectedUser(null);
    setCustomPassword('');
    setShowCustomPasswordText(false);
    setPasswordSetSuccess(false);
    setCurrentStoredPassword('');
    setShowCurrentPassword(false);
  };

  const onSubmitUser = async (data) => {
    try {
      setLoading(true);
      
      let updatedUsers;
      
      if (selectedUser) {
        // Update existing user
        updatedUsers = users.map(u => 
          u.id === selectedUser.id 
            ? { 
                ...u, 
                ...data, 
                permissions: authService.getRolePermissions(data.roles), // Update permissions based on new roles
                updatedAt: new Date().toISOString() 
              }
            : u
        );
        setUsers(updatedUsers);
        saveUsersToStorage(updatedUsers);
        setShowEditDialog(false);
      } else {
        // Create new user
        const newUser = {
          id: `user-${Date.now()}`,
          ...data,
          permissions: authService.getRolePermissions(data.roles), // Assign permissions based on roles
          createdAt: new Date().toISOString(),
          lastLogin: null,
          // Password management fields for new users
          password: 'password123', // Default password
          mustChangePassword: true, // Force password change on first login
          passwordLastChanged: new Date().toISOString(),
        };
        updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        saveUsersToStorage(updatedUsers);
        setShowAddDialog(false);
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setNotification({
        open: true,
        message: 'Error saving user. Please try again.',
        severity: 'error'
      });
    }
  };

  const confirmDeleteUser = async () => {
    try {
      setLoading(true);
      const updatedUsers = users.filter(u => u.id !== selectedUser.id);
      setUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);
      setShowDeleteDialog(false);
      setSelectedUser(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setNotification({
        open: true,
        message: 'Error deleting user. Please try again.',
        severity: 'error'
      });
    }
  };

  const UserFormDialog = ({ open, onClose, title }) => (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Full Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email format',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone Number"
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Department"
                    InputProps={{
                      startAdornment: <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="roles"
                control={control}
                rules={{ required: 'Role is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.roles}>
                    <InputLabel>Role</InputLabel>
                    <Select
                      {...field}
                      label="Role"
                      value={field.value[0] || ''}
                      onChange={(e) => field.onChange([e.target.value])}
                    >
                      <MenuItem value="admin">Administrator</MenuItem>
                      <MenuItem value="sales_manager">Sales Manager</MenuItem>
                      <MenuItem value="salesperson">Salesperson</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(onSubmitUser)}
          variant="contained"
          disabled={!isValid || loading}
          startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
        >
          {selectedUser ? 'Update' : 'Create'} User
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (!canManageUsers) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        You don't have permission to access user management.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" component="h1" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage system users, roles, and permissions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadUsers}
            disabled={loading}
            variant="outlined"
            size="small"
          >
            Refresh
          </Button>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleAddUser}
            size="small"
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* Search and Filter Controls */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Role</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Filter by Role"
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                  <MenuItem value="sales_manager">Sales Manager</MenuItem>
                  <MenuItem value="salesperson">Salesperson</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                Total Users: {filteredUsers.length}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer 
          component={Paper} 
          variant="outlined"
          sx={{ 
            maxHeight: 600,
            overflowX: 'auto',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '4px',
              '&:hover': {
                background: '#a8a8a8',
              },
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    minWidth: 200,
                    backgroundColor: 'background.paper',
                    fontWeight: 600,
                  }}
                >
                  User
                </TableCell>
                <TableCell 
                  sx={{ 
                    minWidth: 180,
                    backgroundColor: 'background.paper',
                    fontWeight: 600,
                  }}
                >
                  Contact
                </TableCell>
                <TableCell 
                  sx={{ 
                    minWidth: 140,
                    backgroundColor: 'background.paper',
                    fontWeight: 600,
                  }}
                >
                  Role
                </TableCell>
                <TableCell 
                  sx={{ 
                    minWidth: 160,
                    backgroundColor: 'background.paper',
                    fontWeight: 600,
                  }}
                >
                  Status
                </TableCell>
                <TableCell 
                  sx={{ 
                    minWidth: 120,
                    backgroundColor: 'background.paper',
                    fontWeight: 600,
                  }}
                >
                  Last Login
                </TableCell>
                <TableCell 
                  sx={{ 
                    minWidth: 120,
                    backgroundColor: 'background.paper',
                    fontWeight: 600,
                  }}
                >
                  Created
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    minWidth: 140,
                    backgroundColor: 'background.paper',
                    fontWeight: 600,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ minWidth: 200 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: getRoleColor(user.roles) === 'error' ? 'error.main' : 'primary.main' }}>
                        {getRoleIcon(user.roles)}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" fontWeight="medium" noWrap>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {user.department}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ minWidth: 180 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" noWrap>
                        {user.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {user.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ minWidth: 140 }}>
                    <Chip
                      label={getRoleLabel(user.roles)}
                      color={getRoleColor(user.roles)}
                      size="small"
                      variant="outlined"
                      icon={getRoleIcon(user.roles)}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 160 }}>
                    <Chip
                      label={user.status}
                      color={user.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 120 }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : 'Never'
                      }
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 120 }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 140 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <Tooltip title="Edit User">
                        <IconButton
                          size="small"
                          onClick={() => handleEditUser(user)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Set Password">
                        <IconButton
                          size="small"
                          onClick={() => handlePasswordManagement(user)}
                          color="primary"
                        >
                          <PasswordIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      {user.id !== currentUser?.id && (
                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteUser(user)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {filteredUsers.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No users found matching your criteria.
          </Typography>
        </Box>
      )}

      {/* Add User Dialog */}
      <UserFormDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        title="Add New User"
      />

      {/* Edit User Dialog */}
      <UserFormDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Edit User"
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{selectedUser?.name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteUser}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Management Dialog */}
      <Dialog
        open={showPasswordDialog}
        onClose={closePasswordDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PasswordIcon />
            Set Password - {selectedUser?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {!passwordSetSuccess ? (
              <>
                <Typography variant="body1" gutterBottom>
                  {currentStoredPassword ? 'Update password for this user:' : 'Set a custom password for this user:'}
                </Typography>

                {/* Current Password Section - Only show if password exists */}
                {currentStoredPassword && (
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Current Password:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PasswordIcon sx={{ color: 'text.secondary' }} />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontFamily: 'monospace', 
                            flexGrow: 1,
                            letterSpacing: showCurrentPassword ? 'normal' : '2px'
                          }}
                        >
                          {showCurrentPassword ? currentStoredPassword : '••••••••••••'}
                        </Typography>
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          size="small"
                        >
                          {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            navigator.clipboard.writeText(currentStoredPassword);
                            setNotification({
                              open: true,
                              message: 'Current password copied to clipboard!',
                              severity: 'success'
                            });
                          }}
                          size="small"
                          title="Copy Password"
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Box>
                )}
                
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label={currentStoredPassword ? "New Password" : "Password"}
                    type={showCustomPasswordText ? 'text' : 'password'}
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    helperText={currentStoredPassword ? "Enter a new password to replace the current one" : "Enter a secure password for the user"}
                    InputProps={{
                      startAdornment: <PasswordIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowCustomPasswordText(!showCustomPasswordText)}
                          edge="end"
                        >
                          {showCustomPasswordText ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Box>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    <strong>Note:</strong> {currentStoredPassword ? 'Setting a new password will replace the current one.' : 'The user will be able to log in immediately with this password.'} 
                    They will not be required to change it unless you specify otherwise.
                  </Typography>
                </Alert>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom color="success.main">
                  Password Set Successfully!
                </Typography>
                
                <Paper sx={{ p: 2, bgcolor: 'grey.100', mt: 2, mb: 2 }}>
                  <Typography variant="body1">
                    Password has been set for <strong>{selectedUser?.name}</strong>
                  </Typography>
                </Paper>

                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    The user can now log in with their email and the password you set.
                  </Typography>
                </Alert>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePasswordDialog}>
            {passwordSetSuccess ? 'Close' : 'Cancel'}
          </Button>
          {!passwordSetSuccess && (
            <Button
              variant="contained"
              onClick={setUserPassword}
              disabled={!customPassword.trim()}
              startIcon={<SaveIcon />}
            >
              {currentStoredPassword ? 'Update Password' : 'Set Password'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagementPage; 