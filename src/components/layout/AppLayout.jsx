import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Dialog,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ViewKanban as KanbanIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  AccountCircle as AccountCircleIcon,
  SupervisorAccount as SupervisorAccountIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toggleSidebar, selectSidebarOpen } from '../../store/slices/uiSlice.jsx';
import useAuth from '../../hooks/useAuth';
import UserProfile from '../auth/UserProfile';

const drawerWidth = 240;

const getNavigation = (isAdmin, canViewReports) => {
  const baseNavigation = [
    { name: 'nav.dashboard', path: '/dashboard', icon: DashboardIcon },
    { name: 'nav.leads', path: '/leads', icon: PeopleIcon },
    { name: 'nav.kanban', path: '/kanban', icon: KanbanIcon },
    { name: 'nav.settings', path: '/settings', icon: SettingsIcon },
  ];

  // Add reports for users who have permission to view reports (exclude salespeople)
  if (canViewReports) {
    baseNavigation.splice(3, 0, { name: 'nav.reports', path: '/reports', icon: ReportsIcon });
  }

  // Add admin route for admin users
  if (isAdmin) {
    baseNavigation.push({
      name: 'nav.admin',
      path: '/admin',
      icon: AdminIcon,
    });
  }

  return baseNavigation;
};

const AppLayout = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const { user, logout, isAdmin, canManageUsers, canViewReports } = useAuth();
  
  // Local state
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleDrawerToggle = () => {
    // dispatch(toggleSidebar()); // This will be implemented by Member 5
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    setShowUserProfile(true);
    handleUserMenuClose();
  };



  // Get role display info
  const getRoleInfo = () => {
    if (!user?.roles) return { label: 'User', color: 'default' };
    
    if (user.roles.includes('admin')) {
      return { label: 'Admin', color: 'error' };
    }
    if (user.roles.includes('sales_manager')) {
      return { label: 'Manager', color: 'warning' };
    }
    if (user.roles.includes('salesperson')) {
      return { label: 'Sales Rep', color: 'info' };
    }
    
    return { label: 'User', color: 'default' };
  };

  const roleInfo = getRoleInfo();
  const navigation = getNavigation(isAdmin, canViewReports);

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          LeadOrbit
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>
                  <Icon color={isActive ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary={t(item.name)} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={t('nav.logout')} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { sm: sidebarOpen ? `${drawerWidth}px` : 0 },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            LeadOrbit
          </Typography>
          
          {/* User Info and Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Chip
                label={roleInfo.label}
                color={roleInfo.color}
                size="small"
                variant="outlined"
                sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.5)' }}
              />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                {user?.name}
              </Typography>
            </Box>
            
            <IconButton
              color="inherit"
              onClick={handleUserMenuClick}
              sx={{ p: 0 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                {user?.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
              </Avatar>
            </IconButton>
          </Box>

          {/* User Menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 8,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                minWidth: 200,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <AccountCircleIcon />
              </Avatar>
              Profile
            </MenuItem>
            
            {canManageUsers && (
              <MenuItem onClick={() => navigate('/admin')}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <SupervisorAccountIcon />
                </Avatar>
                Admin Panel
              </MenuItem>
            )}
            
            <Divider />
            
            <MenuItem onClick={handleLogout}>
              <Avatar sx={{ bgcolor: 'error.main' }}>
                <LogoutIcon />
              </Avatar>
              {t('nav.logout')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: sidebarOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              '&[inert]': {
                visibility: 'hidden',
                display: 'none',
              }
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          sx={{
            display: { xs: 'none', sm: sidebarOpen ? 'block' : 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              '&[aria-hidden="true"]': {
                visibility: 'hidden',
                display: 'none',
              }
            },
          }}
          open={sidebarOpen}
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {children}
        </Box>
      </Box>

      {/* User Profile Dialog */}
      <UserProfile
        open={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />


    </Box>
  );
};

export default AppLayout; 