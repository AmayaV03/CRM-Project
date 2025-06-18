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
  Select,
  FormControl,
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
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toggleSidebar, selectSidebarOpen, selectLanguage, setLanguage } from '../../store/slices/uiSlice.jsx';
import { changeLanguage } from '../../utils/i18nUtils';
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

  if (canViewReports) {
    baseNavigation.splice(3, 0, { name: 'nav.reports', path: '/reports', icon: ReportsIcon });
  }

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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const language = useSelector(selectLanguage);
  const { user, logout, isAdmin, canManageUsers, canViewReports } = useAuth();
  const dispatch = useDispatch();

  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Check if current language is RTL (Arabic)
  const isRTL = language === 'ar';

  const handleDrawerToggle = () => {
    // dispatch(toggleSidebar());
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

  const handleLanguageChange = async (event) => {
    const newLanguage = event.target.value;
    try {
      await changeLanguage(newLanguage);
      dispatch(setLanguage(newLanguage));
      // Force a re-render by updating the document direction
      document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLanguage;
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

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
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ textAlign: isRTL ? 'right' : 'left' }}>
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
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '& .MuiListItemText-root': {
                      color: 'white',
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                <ListItemIcon>
                  <Icon color={isActive ? 'inherit' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary={t(item.name)} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary={t('nav.logout')} sx={{ color: 'white' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #FF6B3510 0%, #F7931E10 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { sm: sidebarOpen && !isRTL ? `${drawerWidth}px` : 0 },
          mr: { sm: sidebarOpen && isRTL ? `${drawerWidth}px` : 0 },
          background: 'linear-gradient(145deg,#FF6B35 0%, #F7931E50 100%)',
          color: 'white',
          boxShadow: 1,
          borderRadius: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ 
          background: 'linear-gradient(135deg, #FF6B3510 0%, #F7931E10 100%)',
          borderRadius: 0
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            width: '100%', 
            justifyContent: isRTL ? 'flex-start' : 'flex-end',
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }}>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Chip
                label={roleInfo.label}
                color="default"
                size="small"
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
            </Box>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={language}
                onChange={handleLanguageChange}
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '& .MuiSelect-icon': {
                    color: 'white',
                  },
                }}
                startAdornment={
                  <LanguageIcon sx={{ color: 'white', mr: 1, fontSize: 20 }} />
                }
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ar">العربية</MenuItem>
              </Select>
            </FormControl>

            <IconButton
              color="inherit"
              onClick={handleUserMenuClick}
              sx={{ p: 0 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                {user?.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose}
            transformOrigin={{ horizontal: isRTL ? 'left' : 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: isRTL ? 'left' : 'right', vertical: 'bottom' }}
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
                  right: isRTL ? 'auto' : 14,
                  left: isRTL ? 14 : 'auto',
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
              {t('nav.profile')}
            </MenuItem>

            {canManageUsers && (
              <MenuItem onClick={() => navigate('/admin')}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <SupervisorAccountIcon />
                </Avatar>
                {t('nav.admin')}
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
        sx={{ 
          width: { sm: sidebarOpen && !isRTL ? drawerWidth : 0 }, 
          flexShrink: { sm: 0 },
          order: isRTL ? 2 : 0,
          zIndex: (theme) => theme.zIndex.drawer,
        }}
      >
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          anchor={isRTL ? 'right' : 'left'}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              color: 'white',
              borderRadius: 0,
              direction: isRTL ? 'rtl' : 'ltr',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          open={sidebarOpen}
          anchor={isRTL ? 'right' : 'left'}
          sx={{
            display: { xs: 'none', sm: sidebarOpen ? 'block' : 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              color: 'white',
              borderRadius: 0,
              direction: isRTL ? 'rtl' : 'ltr',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: isRTL ? (sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%') : '100%' },
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          order: isRTL ? 1 : 0,
          direction: isRTL ? 'rtl' : 'ltr',
          textAlign: isRTL ? 'right' : 'left',
          ml: { sm: isRTL ? 0 : 0 },
          mr: { sm: sidebarOpen && isRTL ? `${drawerWidth}px` : 0 },
        }}
      >
        <Toolbar />
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 0,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          direction: isRTL ? 'rtl' : 'ltr',
          textAlign: isRTL ? 'right' : 'left',
        }}>
          {children}
        </Box>
      </Box>

      <UserProfile
        open={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
    </Box>
  );
};

export default AppLayout;
