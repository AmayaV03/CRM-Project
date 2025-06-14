import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';

// Loading component
const LoadingScreen = () => {
  const { t } = useTranslation();
  
  return (
    <Fade in={true}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={48} thickness={4} />
        <Typography variant="body1" color="text.secondary">
          {t('common.loading')}
        </Typography>
      </Box>
    </Fade>
  );
};

// Unauthorized component
const UnauthorizedScreen = ({ requiredRole, requiredPermission }) => {
  const { t } = useTranslation();
  
  return (
    <Fade in={true}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          403 - {t('errors.unauthorized')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          You don't have permission to access this resource.
        </Typography>
        {requiredRole && (
          <Typography variant="body2" color="text.secondary">
            Required role: <strong>{requiredRole}</strong>
          </Typography>
        )}
        {requiredPermission && (
          <Typography variant="body2" color="text.secondary">
            Required permission: <strong>{requiredPermission}</strong>
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null,
  requireAny = false, // If true, user needs either role OR permission (not both)
}) => {
  const { 
    isAuthenticated, 
    loading, 
    user,
    hasRole,
    hasPermission,
    hasRoleOrHigher 
  } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRole || requiredPermission) {
    let hasAccess = false;

    if (requireAny) {
      // User needs either the role OR the permission
      hasAccess = (
        (requiredRole && hasRoleOrHigher(requiredRole)) ||
        (requiredPermission && hasPermission(requiredPermission))
      );
    } else {
      // User needs both role AND permission (if both are specified)
      const roleAccess = !requiredRole || hasRoleOrHigher(requiredRole);
      const permissionAccess = !requiredPermission || hasPermission(requiredPermission);
      hasAccess = roleAccess && permissionAccess;
    }

    if (!hasAccess) {
      return (
        <UnauthorizedScreen 
          requiredRole={requiredRole}
          requiredPermission={requiredPermission}
        />
      );
    }
  }

  // User is authenticated and authorized
  return children;
};

// Higher-order component for easy role-based route protection
export const withRoleProtection = (Component, requiredRole) => {
  return (props) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Higher-order component for permission-based route protection
export const withPermissionProtection = (Component, requiredPermission) => {
  return (props) => (
    <ProtectedRoute requiredPermission={requiredPermission}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Specific role-based components
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="admin">
    {children}
  </ProtectedRoute>
);

export const SalesManagerRoute = ({ children }) => (
  <ProtectedRoute requiredRole="sales_manager">
    {children}
  </ProtectedRoute>
);

export const SalespersonRoute = ({ children }) => (
  <ProtectedRoute requiredRole="salesperson">
    {children}
  </ProtectedRoute>
);

// Permission-based components
export const ManageLeadsRoute = ({ children }) => (
  <ProtectedRoute requiredPermission="manage_leads">
    {children}
  </ProtectedRoute>
);

export const ViewReportsRoute = ({ children }) => (
  <ProtectedRoute requiredPermission="view_reports">
    {children}
  </ProtectedRoute>
);

export const ManageUsersRoute = ({ children }) => (
  <ProtectedRoute requiredPermission="manage_users">
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute; 