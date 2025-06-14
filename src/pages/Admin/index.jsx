import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Paper,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  SupervisorAccount as SupervisorIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import UserManagementPage from './UserManagementPage';
import SystemSettings from './SystemSettings';
import SecuritySettings from './SecuritySettings';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, canManageUsers } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [userCounts, setUserCounts] = useState({
    total: 0,
    admin: 0,
    salesManager: 0,
    salesperson: 0,
  });

  // Function to get users from localStorage
  const getUsersFromStorage = () => {
    try {
      const storedUsers = localStorage.getItem('crm_users');
      if (storedUsers) {
        return JSON.parse(storedUsers);
      }
    } catch (error) {
      console.error('Error loading users from localStorage:', error);
    }
    return [];
  };

  // Function to calculate user counts by role
  const calculateUserCounts = () => {
    const users = getUsersFromStorage();
    const counts = {
      total: users.length,
      admin: 0,
      salesManager: 0,
      salesperson: 0,
    };

    users.forEach(user => {
      if (user.roles && Array.isArray(user.roles)) {
        if (user.roles.includes('admin')) {
          counts.admin++;
        } else if (user.roles.includes('sales_manager')) {
          counts.salesManager++;
        } else if (user.roles.includes('salesperson')) {
          counts.salesperson++;
        }
      }
    });

    return counts;
  };

  // Load user counts on component mount
  useEffect(() => {
    const counts = calculateUserCounts();
    setUserCounts(counts);
  }, []);

  // Static admin metrics
  const adminMetrics = [
    {
      title: 'Total Users',
      value: userCounts.total.toString(),
      icon: <PeopleIcon />,
      color: 'primary',
      description: 'Active system users',
    },
    {
      title: 'Admin Users',
      value: userCounts.admin.toString(),
      icon: <SupervisorIcon />,
      color: 'error',
      description: 'Administrator accounts',
    },
    {
      title: 'Sales Managers',
      value: userCounts.salesManager.toString(),
      icon: <SettingsIcon />,
      color: 'warning',
      description: 'Sales management roles',
    },
    {
      title: 'Sales Reps',
      value: userCounts.salesperson.toString(),
      icon: <PersonAddIcon />,
      color: 'info',
      description: 'Sales representatives',
    },
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  if (!canManageUsers) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Access Denied: You don't have permission to access the admin panel.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage users, system settings, and monitor platform activities
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="User Management" />
          <Tab label="System Settings" />
          <Tab label="Security" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Box>
          {/* Overview Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              User Statistics Overview
            </Typography>
          </Box>

          {/* Admin Metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {adminMetrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: `${metric.color}.main`,
                          width: 56,
                          height: 56,
                        }}
                      >
                        {metric.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h3" 
                          component="div"
                          sx={{ 
                            fontWeight: 'bold',
                            background: `linear-gradient(45deg, ${metric.color === 'primary' ? '#1976d2' : metric.color === 'error' ? '#d32f2f' : metric.color === 'warning' ? '#ed6c02' : '#0288d1'}, ${metric.color === 'primary' ? '#42a5f5' : metric.color === 'error' ? '#ef5350' : metric.color === 'warning' ? '#ff9800' : '#29b6f6'})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {metric.value}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          {metric.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {metric.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Typography variant="h5" component="h2" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PeopleIcon />
                    </Avatar>
                    <Typography variant="h6">User Management</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add, edit, or remove users from the system. Manage roles and permissions.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => setSelectedTab(1)}
                    variant="contained"
                  >
                    Manage Users
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <SettingsIcon />
                    </Avatar>
                    <Typography variant="h6">System Settings</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Configure system-wide settings, preferences, and application behavior.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => setSelectedTab(2)}
                    variant="outlined"
                  >
                    Configure
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'error.main' }}>
                      <SecurityIcon />
                    </Avatar>
                    <Typography variant="h6">Security Settings</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Manage security policies, authentication settings, and access controls.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => setSelectedTab(3)}
                    variant="outlined"
                  >
                    Security
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {selectedTab === 1 && <UserManagementPage />}

      {selectedTab === 2 && <SystemSettings />}

      {selectedTab === 3 && <SecuritySettings />}
    </Container>
  );
};

export default AdminDashboard; 