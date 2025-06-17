import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider,
  Avatar,
  Container,
  CircularProgress,
  Fade,
  Slide,
  Tab,
  Tabs,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  Person,
  Business,
  AdminPanelSettings,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const LoginForm = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { login, loading, error, clearAuthError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Watch form values
  const watchedValues = watch();

  // Demo accounts for role selection
  const demoAccounts = [
    { 
      email: 'admin@crm.com', 
      password: 'password', 
      role: 'Admin',
      icon: <AdminPanelSettings />
    },
    { 
      email: 'sales.manager@crm.com', 
      password: 'password', 
      role: 'Sales Manager',
      icon: <Business />
    },
    { 
      email: 'rep1@crm.com', 
      password: 'password', 
      role: 'Salesperson',
      icon: <Person />
    },
  ];

  // Load saved credentials if "Remember Me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('leadflow_saved_email');
    const savedRemember = localStorage.getItem('leadflow_remember_me') === 'true';
    
    if (savedEmail && savedRemember) {
      setValue('email', savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearAuthError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearAuthError]);

  // Debug form state (can be removed in production)
  // useEffect(() => {
  //   console.log('Form state - isValid:', isValid, 'isDirty:', isDirty, 'errors:', errors, 'values:', watchedValues);
  // }, [isValid, isDirty, errors, watchedValues]);

  const onSubmit = async (data) => {
    try {
      clearAuthError();
      































      
      const result = await login(data.email, data.password);
      
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('leadflow_saved_email', data.email);
        localStorage.setItem('leadflow_remember_me', 'true');
      } else {
        localStorage.removeItem('leadflow_saved_email');
        localStorage.removeItem('leadflow_remember_me');
      }
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the auth hook
      console.error('Login failed:', err);
    }
  };

  const handleRoleSelect = (event, newValue) => {
    setSelectedRole(newValue);
    // Note: Auto-fill functionality removed - users must manually enter credentials
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    alert('Forgot password functionality will be implemented soon. Please contact your administrator for password reset assistance.');
  };

  // Decorative shapes for left side
  const DecorativeShapes = () => (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          width: 80,
          height: 80,
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.08)',
          transform: 'rotate(45deg)',
          animation: 'float 4s ease-in-out infinite reverse',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '20%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.06)',
          animation: 'float 5s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          left: '10%',
          width: 40,
          height: 40,
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          transform: 'rotate(25deg)',
          animation: 'float 7s ease-in-out infinite',
        }}
      />
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </>
  );

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '100%',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      overflowX: 'hidden',
      overflowY: 'auto',
    }}>
      {/* Left Side - Branding Section */}
      <Box
        sx={{
          flex: isMobile ? '0 0 auto' : '0 0 60%',
          minHeight: isMobile ? '300px' : '100vh',
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FF8C42 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
          p: isMobile ? 3 : 5,
          pt: isMobile ? 3 : 6,
        }}
      >
        <DecorativeShapes />
        
        <Box
          sx={{
            textAlign: 'center',
            zIndex: 2,
            maxWidth: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: isMobile ? 2 : 3,
            boxSizing: 'border-box',
          }}
        >
          <Fade in={true} timeout={800}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{
                  mx: 'auto',
                  mb: isMobile ? 2 : 3,
                  width: isMobile ? 64 : 80,
                  height: isMobile ? 64 : 80,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: isMobile ? '2rem' : '2.5rem',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
                }}
              >
                <Business sx={{ fontSize: 'inherit' }} />
              </Avatar>
              
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                component="h1" 
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  mb: isMobile ? 1 : 2,
                  textAlign: 'center'
                }}
              >
                Welcome Back
              </Typography>
              
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                component="h2" 
                fontWeight="600" 
                gutterBottom
                sx={{ 
                  mb: isMobile ? 2 : 3,
                  textAlign: 'center'
                }}
              >
                LeadOrbit
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  opacity: 0.9,
                  lineHeight: 1.5,
                  fontSize: isMobile ? '0.8rem' : '0.95rem',
                  textAlign: 'center',
                  px: isMobile ? 1 : 0.5,
                  fontStyle: 'italic',
                  fontWeight: 300,
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  maxWidth: '600px'
                }}
              >
                Transform your sales journey with intelligent lead management and accelerate your business growth.
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Box>

      {/* Right Side - Form Section */}
      <Box
        sx={{
          flex: isMobile ? '1' : '0 0 40%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8fafc',
          p: isMobile ? 3 : 4,
          minHeight: isMobile ? 'calc(100vh - 300px)' : '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <Paper
          elevation={12}
          sx={{
            p: isMobile ? 4 : 5,
            width: '100%',
            maxWidth: isMobile ? 400 : 480,
            bgcolor: 'white',
            borderRadius: 4,
            boxShadow: '0 20px 50px rgba(255, 107, 53, 0.15)',
            border: '1px solid rgba(255, 107, 53, 0.1)',
            my: isMobile ? 2 : 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4, width: '100%' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              mb: 3,
              position: 'relative'
            }}>
              <Typography 
                variant="h5" 
                component="h2" 
                fontWeight="bold" 
                color="text.primary"
                sx={{ 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Login to Your Account
              </Typography>
              <IconButton 
                size="small" 
                sx={{ 
                  color: 'text.secondary',
                  position: 'absolute',
                  right: 0
                }}
              >
                <LanguageIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Role Information */}
          <Box sx={{ mb: 4, width: '100%' }}>
            <Tabs
              value={selectedRole}
              onChange={handleRoleSelect}
              variant="fullWidth"
              centered
              sx={{
                mb: 0,
                '& .MuiTab-root': {
                  minHeight: 48,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: '#FF6B35',
                  },
                },
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              {demoAccounts.map((account, index) => (
                <Tab
                  key={index}
                  icon={account.icon}
                  label={account.role}
                  iconPosition="top"
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.2rem',
                      mb: 0.5,
                    },
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Login Form */}
          <Box 
            component="form" 
            onSubmit={handleSubmit(onSubmit)}
            sx={{ 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              alignItems: 'center'
            }}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: t('validation.required'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('validation.email'),
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('auth.email')}
                  type="email"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FF6B35',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FF6B35',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#FF6B35',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: t('validation.required'),
                minLength: {
                  value: 6,
                  message: t('validation.minLength', { min: 6 }),
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('auth.password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FF6B35',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FF6B35',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#FF6B35',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Remember Me & Forgot Password */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              width: '100%',
              mt: 1
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                    sx={{
                      '&.Mui-checked': {
                        color: '#FF6B35',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.rememberMe')}
                  </Typography>
                }
              />
              <Button 
                variant="text" 
                size="small" 
                sx={{ 
                  textTransform: 'none', 
                  fontSize: '0.875rem',
                  color: '#FF6B35',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 53, 0.04)',
                  }
                }} 
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </Button>
            </Box>

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || (!watchedValues.email || !watchedValues.password)}
              startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
              sx={{
                py: 1.5,
                mt: 2,
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 2,
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #E55A2B 0%, #E0841A 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                },
              }}
            >
              {loading ? t('common.loading') : t('auth.loginButton')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginForm; 