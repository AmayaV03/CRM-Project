import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  InputAdornment,
  IconButton,
  Tooltip,
  Fade,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Security as SecurityIcon,
  Visibility,
  VisibilityOff,
  Key as KeyIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';

const UserProfile = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { user, updateProfile, changePassword, loading, error, clearAuthError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Profile form
  const profileForm = useForm({
    mode: 'onChange',
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || '',
    },
  });

  // Password form
  const passwordForm = useForm({
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Get role display name
  const getRoleDisplayName = (roles) => {
    if (!roles || roles.length === 0) return t('settings.users.roles.noRole');
    const roleMap = {
      admin: t('settings.users.roles.admin'),
      sales_manager: t('settings.users.roles.sales_manager'),
      salesperson: t('settings.users.roles.salesperson'),
    };
    return roles.map(role => roleMap[role] || role).join(', ');
  };

  // Get role color
  const getRoleColor = (roles) => {
    if (!roles || roles.length === 0) return 'default';
    if (roles.includes('admin')) return 'error';
    if (roles.includes('sales_manager')) return 'warning';
    return 'info';
  };

  // Handle profile update
  const handleProfileUpdate = async (data) => {
    try {
      clearAuthError();
      await updateProfile(data);
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  // Handle password change
  const handlePasswordChange = async (data) => {
    setPasswordError('');
    setPasswordSuccess('');

    if (data.newPassword !== data.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (data.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    try {
      await changePassword(data.currentPassword, data.newPassword);
      setPasswordSuccess('Password changed successfully');
      passwordForm.reset();
      setTimeout(() => {
        setShowPasswordDialog(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (!user) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'primary.main',
              fontSize: '1.5rem',
            }}
          >
            {user.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
          </Avatar>
          <Box>
            <Typography variant="h5" component="h1">
              {t('profile.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('profile.subtitle')}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Error Alert */}
        {error && (
          <Fade in={Boolean(error)}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Fade>
        )}

        <Grid container spacing={3}>
          {/* Profile Information */}
          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {t('profile.information')}
                  </Typography>
                  <Button
                    startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                    onClick={() => {
                      if (isEditing) {
                        profileForm.reset();
                        setIsEditing(false);
                      } else {
                        setIsEditing(true);
                      }
                    }}
                    variant={isEditing ? "outlined" : "contained"}
                    size="small"
                  >
                    {isEditing ? t('common.cancel') : t('common.edit')}
                  </Button>
                </Box>

                <Box component="form" onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="name"
                        control={profileForm.control}
                        rules={{ required: t('validation.required') }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label={t('common.name')}
                            disabled={!isEditing}
                            error={!!error}
                            helperText={error?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="email"
                        control={profileForm.control}
                        rules={{
                          required: t('validation.required'),
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: t('validation.email'),
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label={t('common.email')}
                            disabled={!isEditing}
                            error={!!error}
                            helperText={error?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="phone"
                        control={profileForm.control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label={t('common.phone')}
                            disabled={!isEditing}
                            error={!!error}
                            helperText={error?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="department"
                        control={profileForm.control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label={t('profile.department')}
                            disabled={!isEditing}
                            error={!!error}
                            helperText={error?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <WorkIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  {isEditing && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                        disabled={loading || !profileForm.formState.isValid}
                      >
                        {loading ? <CircularProgress size={24} /> : t('common.save')}
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Role and Security Information */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {t('profile.security')}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={getRoleDisplayName(user.roles)}
                    color={getRoleColor(user.roles)}
                    sx={{ mb: 1 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Permissions:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {user.permissions?.map(permission => (
                    <Chip
                      key={permission}
                      label={permission.replace('_', ' ')}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Security section - only visible for admin users */}
            {user.roles?.includes('admin') && (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {t('profile.changePassword')}
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SecurityIcon />}
                    onClick={() => setShowPasswordDialog(true)}
                    sx={{ mb: 1 }}
                  >
                    {t('profile.changePassword')}
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {new Date().toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          {t('common.close')}
        </Button>
      </DialogActions>

      {/* Password Change Dialog - only for admin users */}
      {user.roles?.includes('admin') && (
        <Dialog
          open={showPasswordDialog}
          onClose={() => {
            setShowPasswordDialog(false);
            setPasswordError('');
            setPasswordSuccess('');
            passwordForm.reset();
          }}
          maxWidth="sm"
          fullWidth
        >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon />
            {t('profile.changePassword')}
          </Box>
        </DialogTitle>

        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          
          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {passwordSuccess}
            </Alert>
          )}

          <Box component="form" onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
            <Controller
              name="currentPassword"
              control={passwordForm.control}
              rules={{ required: 'Current password is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('profile.currentPassword')}
                  type={showPasswords.current ? 'text' : 'password'}
                  margin="dense"
                  error={!!passwordForm.formState.errors.currentPassword}
                  helperText={passwordForm.formState.errors.currentPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('current')}
                          edge="end"
                        >
                          {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="newPassword"
              control={passwordForm.control}
              rules={{
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('profile.newPassword')}
                  type={showPasswords.new ? 'text' : 'password'}
                  margin="dense"
                  error={!!passwordForm.formState.errors.newPassword}
                  helperText={passwordForm.formState.errors.newPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('new')}
                          edge="end"
                        >
                          {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={passwordForm.control}
              rules={{ required: 'Please confirm your new password' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('profile.confirmPassword')}
                  type={showPasswords.confirm ? 'text' : 'password'}
                  margin="dense"
                  error={!!passwordForm.formState.errors.confirmPassword}
                  helperText={passwordForm.formState.errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirm')}
                          edge="end"
                        >
                          {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={passwordForm.handleSubmit(handlePasswordChange)}
            variant="contained"
            disabled={loading || !passwordForm.formState.isValid}
            startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
          >
            {loading ? <CircularProgress size={24} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
      )}
    </Dialog>
  );
};

export default UserProfile; 