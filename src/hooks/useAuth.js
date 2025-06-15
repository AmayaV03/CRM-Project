import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { 
  loginSuccess, 
  logout as logoutAction, 
  setLoading, 
  setError, 
  updateUser,
  clearError,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRoles,
  selectUserPermissions,
  selectIsAdmin,
  selectIsSalesManager,
  selectIsSalesperson,
  selectCanManageLeads,
  selectCanReassignLeads,
  selectCanViewReports,
  selectCanManageUsers
} from '../store/slices/authSlice.jsx';
import authService from '../services/authService';

const useAuth = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const roles = useSelector(selectUserRoles);
  const permissions = useSelector(selectUserPermissions);
  
  // Role-based selectors
  const isAdmin = useSelector(selectIsAdmin);
  const isSalesManager = useSelector(selectIsSalesManager);
  const isSalesperson = useSelector(selectIsSalesperson);
  
  // Permission-based selectors
  const canManageLeads = useSelector(selectCanManageLeads);
  const canReassignLeads = useSelector(selectCanReassignLeads);
  const canViewReports = useSelector(selectCanViewReports);
  const canManageUsers = useSelector(selectCanManageUsers);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const authData = authService.getAuthData();
        if (authData && authService.isAuthenticated()) {
          dispatch(loginSuccess({
            user: authData.user,
            token: authData.token
          }));
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        authService.clearAuthData();
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Login function
  const login = useCallback(async (email, password) => {
    console.log('Login called with:', { email, password });
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      console.log('Calling authService.authenticate...');
      const authData = await authService.authenticate(email, password);
      console.log('Authentication successful:', authData);
      
      dispatch(loginSuccess({
        user: authData.user,
        token: authData.token
      }));
      return authData;
    } catch (error) {
      console.error('Authentication error:', error);
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  // Logout function
  const logout = useCallback(async () => {
    dispatch(setLoading(true));
    
    try {
      await authService.logout();
      dispatch(logoutAction());
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout even if there's an error
      dispatch(logoutAction());
    }
  }, [dispatch]);

  // Update user profile
  const updateProfile = useCallback(async (updates) => {
    if (!user) throw new Error('No authenticated user');
    
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const updatedUser = await authService.updateUserProfile(user.id, updates);
      dispatch(updateUser(updatedUser));
      return updatedUser;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch, user]);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    if (!user) throw new Error('No authenticated user');
    
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const result = await authService.changePassword(user.id, currentPassword, newPassword);
      dispatch(setLoading(false));
      return result;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch, user]);

  // Clear error
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Role checking utilities
  const hasRole = useCallback((role) => {
    return authService.hasRole(user, role);
  }, [user]);

  const hasPermission = useCallback((permission) => {
    return authService.hasPermission(user, permission);
  }, [user]);

  const hasRoleOrHigher = useCallback((role) => {
    return authService.hasRoleOrHigher(user, role);
  }, [user]);

  // Check if user can perform specific actions
  const canEditUser = useCallback((targetUserId) => {
    if (!user) return false;
    
    // Users can edit themselves, admins can edit anyone
    return user.id === targetUserId || isAdmin;
  }, [user, isAdmin]);

  const canDeleteUser = useCallback((targetUserId) => {
    if (!user) return false;
    
    // Only admins can delete users, but not themselves
    return isAdmin && user.id !== targetUserId;
  }, [user, isAdmin]);

  const canAssignLeads = useCallback(() => {
    return isSalesManager || isAdmin;
  }, [isSalesManager, isAdmin]);

  const canViewAllLeads = useCallback(() => {
    return isSalesManager || isAdmin;
  }, [isSalesManager, isAdmin]);

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    roles,
    permissions,
    
    // Role flags
    isAdmin,
    isSalesManager,
    isSalesperson,
    
    // Permission flags
    canManageLeads,
    canReassignLeads,
    canViewReports,
    canManageUsers,
    
    // Actions
    login,
    logout,
    updateProfile,
    changePassword,
    clearAuthError,
    
    // Utilities
    hasRole,
    hasPermission,
    hasRoleOrHigher,
    canEditUser,
    canDeleteUser,
    canAssignLeads,
    canViewAllLeads,
  };
};

export default useAuth; 