import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Password as PasswordIcon,
  Shield as ShieldIcon,
  AccessTime as AccessTimeIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const SecuritySettings = () => {
  const [securitySettings, setSecuritySettings] = useState({
    // Password Policy
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    passwordExpirationDays: 90,
    passwordHistoryCount: 5,
    passwordMaxAttempts: 5,
    
    // Session Management
    sessionTimeoutMinutes: 480, // 8 hours
    enableSessionTimeout: true,
    maxConcurrentSessions: 3,
    enableRememberMe: true,
    rememberMeDays: 30,
    
    // Access Control
    enableTwoFactor: false,
    enableIPWhitelist: false,
    ipWhitelist: [],
    enableAuditLog: true,
    enableLoginNotifications: true,
    enableAccountLockout: true,
    lockoutDurationMinutes: 30,
    
    // Data Protection
    enableDataEncryption: true,
    enableSecureHeaders: true,
    enableCSRFProtection: true,
    enableXSSProtection: true,
  });

  const [activeSessions, setActiveSessions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [savedSettings, setSavedSettings] = useState(null);

  // Load security settings from localStorage on component mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('crm_security_settings');
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        setSecuritySettings(parsed);
        setSavedSettings(parsed);
      } catch (error) {
        console.error('Error loading security settings:', error);
      }
    } else {
      setSavedSettings(securitySettings);
    }

    // Load mock active sessions
    loadActiveSessions();
    
    // Load audit logs
    loadAuditLogs();
  }, []);

  // Check if settings have been modified
  useEffect(() => {
    if (savedSettings) {
      const modified = JSON.stringify(securitySettings) !== JSON.stringify(savedSettings);
      setIsModified(modified);
    }
  }, [securitySettings, savedSettings]);

  const loadActiveSessions = () => {
    // Mock active sessions data
    const mockSessions = [
      {
        id: '1',
        userId: 'admin@leadflow.com',
        loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120.0.0.0',
        location: 'New York, NY',
        isCurrentSession: true,
      },
      {
        id: '2',
        userId: 'john.doe@leadflow.com',
        loginTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        ipAddress: '192.168.1.101',
        userAgent: 'Firefox 121.0.0.0',
        location: 'San Francisco, CA',
        isCurrentSession: false,
      },
    ];
    setActiveSessions(mockSessions);
  };

  const loadAuditLogs = () => {
    // Mock audit logs data
    const mockLogs = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        action: 'LOGIN_SUCCESS',
        userId: 'admin@leadflow.com',
        ipAddress: '192.168.1.100',
        details: 'Successful login',
        severity: 'info',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        action: 'PASSWORD_CHANGE',
        userId: 'john.doe@leadflow.com',
        ipAddress: '192.168.1.101',
        details: 'Password changed successfully',
        severity: 'info',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        action: 'LOGIN_FAILED',
        userId: 'unknown@test.com',
        ipAddress: '192.168.1.200',
        details: 'Failed login attempt - invalid credentials',
        severity: 'warning',
      },
    ];
    setAuditLogs(mockLogs);
  };

  const handleSettingChange = (key, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('crm_security_settings', JSON.stringify(securitySettings));
      setSavedSettings(securitySettings);
      setSaveStatus('success');
      
      // Log security settings change
      const newLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        action: 'SECURITY_SETTINGS_CHANGE',
        userId: 'admin@leadflow.com',
        ipAddress: '192.168.1.100',
        details: 'Security settings updated',
        severity: 'info',
      };
      setAuditLogs(prev => [newLog, ...prev]);
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving security settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleTerminateSession = (sessionId) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    
    // Log session termination
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action: 'SESSION_TERMINATED',
      userId: 'admin@leadflow.com',
      ipAddress: '192.168.1.100',
      details: `Session ${sessionId} terminated by admin`,
      severity: 'warning',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const getPasswordStrengthInfo = () => {
    const requirements = [];
    if (securitySettings.passwordMinLength >= 8) requirements.push('Minimum 8 characters');
    if (securitySettings.passwordRequireUppercase) requirements.push('Uppercase letters');
    if (securitySettings.passwordRequireLowercase) requirements.push('Lowercase letters');
    if (securitySettings.passwordRequireNumbers) requirements.push('Numbers');
    if (securitySettings.passwordRequireSpecialChars) requirements.push('Special characters');
    
    return requirements;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Security Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure security policies and monitor system access
        </Typography>
      </Box>

      {/* Save Status Alert */}
      {saveStatus && (
        <Alert 
          severity={saveStatus === 'success' ? 'success' : 'error'} 
          sx={{ mb: 3 }}
        >
          {saveStatus === 'success' 
            ? 'Security settings saved successfully!' 
            : 'Error saving security settings. Please try again.'
          }
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<SecurityIcon />}
          onClick={handleSaveSettings}
          disabled={!isModified}
        >
          Save Security Settings
        </Button>
        {isModified && (
          <Chip
            label="Unsaved Changes"
            color="warning"
            size="small"
          />
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Password Policy */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<PasswordIcon />}
              title="Password Policy"
              subheader="Configure password requirements and security"
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography gutterBottom>
                    Minimum Password Length: {securitySettings.passwordMinLength}
                  </Typography>
                  <Slider
                    value={securitySettings.passwordMinLength}
                    onChange={(e, value) => handleSettingChange('passwordMinLength', value)}
                    min={6}
                    max={20}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.passwordRequireUppercase}
                      onChange={(e) => handleSettingChange('passwordRequireUppercase', e.target.checked)}
                    />
                  }
                  label="Require Uppercase Letters"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.passwordRequireLowercase}
                      onChange={(e) => handleSettingChange('passwordRequireLowercase', e.target.checked)}
                    />
                  }
                  label="Require Lowercase Letters"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.passwordRequireNumbers}
                      onChange={(e) => handleSettingChange('passwordRequireNumbers', e.target.checked)}
                    />
                  }
                  label="Require Numbers"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.passwordRequireSpecialChars}
                      onChange={(e) => handleSettingChange('passwordRequireSpecialChars', e.target.checked)}
                    />
                  }
                  label="Require Special Characters"
                />

                <TextField
                  label="Password Expiration (Days)"
                  type="number"
                  value={securitySettings.passwordExpirationDays}
                  onChange={(e) => handleSettingChange('passwordExpirationDays', parseInt(e.target.value))}
                  InputProps={{ inputProps: { min: 30, max: 365 } }}
                />

                <TextField
                  label="Password History Count"
                  type="number"
                  value={securitySettings.passwordHistoryCount}
                  onChange={(e) => handleSettingChange('passwordHistoryCount', parseInt(e.target.value))}
                  InputProps={{ inputProps: { min: 1, max: 10 } }}
                />

                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Current Password Requirements:
                  </Typography>
                  {getPasswordStrengthInfo().map((req, index) => (
                    <Chip
                      key={index}
                      label={req}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                      icon={<CheckCircleIcon />}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Session Management */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<AccessTimeIcon />}
              title="Session Management"
              subheader="Configure session timeouts and limits"
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.enableSessionTimeout}
                      onChange={(e) => handleSettingChange('enableSessionTimeout', e.target.checked)}
                    />
                  }
                  label="Enable Session Timeout"
                />

                {securitySettings.enableSessionTimeout && (
                  <Box>
                    <Typography gutterBottom>
                      Session Timeout: {Math.floor(securitySettings.sessionTimeoutMinutes / 60)}h {securitySettings.sessionTimeoutMinutes % 60}m
                    </Typography>
                    <Slider
                      value={securitySettings.sessionTimeoutMinutes}
                      onChange={(e, value) => handleSettingChange('sessionTimeoutMinutes', value)}
                      min={30}
                      max={1440} // 24 hours
                      step={30}
                      marks={[
                        { value: 30, label: '30m' },
                        { value: 240, label: '4h' },
                        { value: 480, label: '8h' },
                        { value: 1440, label: '24h' },
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                )}

                <TextField
                  label="Max Concurrent Sessions"
                  type="number"
                  value={securitySettings.maxConcurrentSessions}
                  onChange={(e) => handleSettingChange('maxConcurrentSessions', parseInt(e.target.value))}
                  InputProps={{ inputProps: { min: 1, max: 10 } }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.enableRememberMe}
                      onChange={(e) => handleSettingChange('enableRememberMe', e.target.checked)}
                    />
                  }
                  label="Enable Remember Me"
                />

                {securitySettings.enableRememberMe && (
                  <TextField
                    label="Remember Me Duration (Days)"
                    type="number"
                    value={securitySettings.rememberMeDays}
                    onChange={(e) => handleSettingChange('rememberMeDays', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 1, max: 90 } }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Access Control */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<ShieldIcon />}
              title="Access Control"
              subheader="Advanced security and access controls"
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.enableAccountLockout}
                      onChange={(e) => handleSettingChange('enableAccountLockout', e.target.checked)}
                    />
                  }
                  label="Enable Account Lockout"
                />

                {securitySettings.enableAccountLockout && (
                  <>
                    <TextField
                      label="Max Failed Login Attempts"
                      type="number"
                      value={securitySettings.passwordMaxAttempts}
                      onChange={(e) => handleSettingChange('passwordMaxAttempts', parseInt(e.target.value))}
                      InputProps={{ inputProps: { min: 3, max: 10 } }}
                    />

                    <TextField
                      label="Lockout Duration (Minutes)"
                      type="number"
                      value={securitySettings.lockoutDurationMinutes}
                      onChange={(e) => handleSettingChange('lockoutDurationMinutes', parseInt(e.target.value))}
                      InputProps={{ inputProps: { min: 5, max: 1440 } }}
                    />
                  </>
                )}

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.enableTwoFactor}
                      onChange={(e) => handleSettingChange('enableTwoFactor', e.target.checked)}
                    />
                  }
                  label="Enable Two-Factor Authentication"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.enableLoginNotifications}
                      onChange={(e) => handleSettingChange('enableLoginNotifications', e.target.checked)}
                    />
                  }
                  label="Enable Login Notifications"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.enableAuditLog}
                      onChange={(e) => handleSettingChange('enableAuditLog', e.target.checked)}
                    />
                  }
                  label="Enable Audit Logging"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Protection */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<LockIcon />}
              title="Data Protection"
              subheader="Data security and protection settings"
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.enableDataEncryption}
                      onChange={(e) => handleSettingChange('enableDataEncryption', e.target.checked)}
                    />
                  }
                  label="Enable Data Encryption"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.enableSecureHeaders}
                      onChange={(e) => handleSettingChange('enableSecureHeaders', e.target.checked)}
                    />
                  }
                  label="Enable Security Headers"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.enableCSRFProtection}
                      onChange={(e) => handleSettingChange('enableCSRFProtection', e.target.checked)}
                    />
                  }
                  label="Enable CSRF Protection"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.enableXSSProtection}
                      onChange={(e) => handleSettingChange('enableXSSProtection', e.target.checked)}
                    />
                  }
                  label="Enable XSS Protection"
                />

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    These security features help protect against common web vulnerabilities and ensure data integrity.
                  </Typography>
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Sessions */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              avatar={<VisibilityIcon />}
              title="Active Sessions"
              subheader="Monitor and manage active user sessions"
              action={
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={loadActiveSessions}
                  size="small"
                >
                  Refresh
                </Button>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Login Time</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>User Agent</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          {session.userId}
                          {session.isCurrentSession && (
                            <Chip label="Current" size="small" color="primary" sx={{ ml: 1 }} />
                          )}
                        </TableCell>
                        <TableCell>{session.loginTime.toLocaleString()}</TableCell>
                        <TableCell>{session.ipAddress}</TableCell>
                        <TableCell>{session.userAgent}</TableCell>
                        <TableCell>
                          {!session.isCurrentSession && (
                            <Tooltip title="Terminate Session">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleTerminateSession(session.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Audit Logs */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              avatar={<WarningIcon />}
              title="Security Audit Logs"
              subheader="Recent security events and activities"
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell>Severity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditLogs.slice(0, 10).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp.toLocaleString()}</TableCell>
                        <TableCell>{log.action.replace(/_/g, ' ')}</TableCell>
                        <TableCell>{log.userId}</TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                        <TableCell>{log.details}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.severity.toUpperCase()}
                            size="small"
                            color={getSeverityColor(log.severity)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SecuritySettings; 