import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';

const LoginPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('admin@crm.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Simple demo authentication
    if (email === 'admin@crm.com' && password === 'password') {
      const user = {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@crm.com',
        roles: ['admin'],
        permissions: ['manage_leads', 'view_reports', 'manage_users'],
      };
      
      dispatch(loginSuccess({ user, token: 'demo-token' }));
    } else {
      setError(t('auth.loginError'));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
            LeadFlow CRM
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
            {t('auth.login')}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label={t('auth.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('auth.loginButton')}
            </Button>
          </Box>

          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Demo Credentials:</strong><br />
              Email: admin@crm.com<br />
              Password: password
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage; 