// AuthService - JWT token management and authentication
class AuthService {
  constructor() {
    this.tokenKey = 'leadflow_auth_token';
    this.userKey = 'leadflow_user_data';
    this.refreshTokenKey = 'leadflow_refresh_token';
    
    // Mock user database for demo purposes
    this.users = [
      {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@crm.com',
        password: 'password',
        roles: ['admin'],
        permissions: ['manage_leads', 'manage_users', 'view_reports', 'reassign_leads'],
        active: true,
        avatar: null,
        phone: '+1-555-0101',
        department: 'Administration',
        createdAt: new Date('2024-01-01').toISOString(),
      },
      {
        id: 'sales-manager-1',
        name: 'Sales Manager',
        email: 'sales.manager@crm.com',
        password: 'password',
        roles: ['sales_manager'],
        permissions: ['manage_leads', 'view_reports', 'reassign_leads'],
        active: true,
        avatar: null,
        phone: '+1-555-0102',
        department: 'Sales',
        createdAt: new Date('2024-01-01').toISOString(),
      },
      {
        id: 'salesperson-1',
        name: 'Sales Rep 1',
        email: 'rep1@crm.com',
        password: 'password',
        roles: ['salesperson'],
        permissions: ['manage_leads'],
        active: true,
        avatar: null,
        phone: '+1-555-0103',
        department: 'Sales',
        createdAt: new Date('2024-01-01').toISOString(),
      },
      {
        id: 'salesperson-2',
        name: 'Sales Rep 2',
        email: 'rep2@crm.com',
        password: 'password',
        roles: ['salesperson'],
        permissions: ['manage_leads'],
        active: true,
        avatar: null,
        phone: '+1-555-0104',
        department: 'Sales',
        createdAt: new Date('2024-01-01').toISOString(),
      },
    ];
  }

  // Generate mock JWT token
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    };
    
    // In real app, this would be a proper JWT
    return btoa(JSON.stringify(payload));
  }

  // Generate refresh token
  generateRefreshToken(user) {
    const refreshPayload = {
      id: user.id,
      iat: Date.now(),
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    };
    
    return btoa(JSON.stringify(refreshPayload));
  }

  // Decode token
  decodeToken(token) {
    try {
      return JSON.parse(atob(token));
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(token) {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;
    
    return Date.now() > decoded.exp;
  }

  // Authenticate user
  async authenticate(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => 
          u.email === email && 
          u.password === password && 
          u.active
        );

        if (user) {
          const token = this.generateToken(user);
          const refreshToken = this.generateRefreshToken(user);
          
          // Remove password from user object
          const { password: _, ...userWithoutPassword } = user;
          
          const authData = {
            user: userWithoutPassword,
            token,
            refreshToken
          };

          // Store in localStorage
          this.setAuthData(authData);
          
          resolve(authData);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000); // Simulate network delay
    });
  }

  // Store authentication data
  setAuthData({ user, token, refreshToken }) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  // Get stored authentication data
  getAuthData() {
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);
    const refreshToken = localStorage.getItem(this.refreshTokenKey);

    if (!token || !userStr) {
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      return { user, token, refreshToken };
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.clearAuthData();
      return null;
    }
  }

  // Clear authentication data
  clearAuthData() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  // Check if user is authenticated
  isAuthenticated() {
    const authData = this.getAuthData();
    if (!authData) return false;

    // Check if token is expired
    if (this.isTokenExpired(authData.token)) {
      // Try to refresh token
      return this.refreshTokenIfNeeded();
    }

    return true;
  }

  // Refresh token if needed
  refreshTokenIfNeeded() {
    const authData = this.getAuthData();
    if (!authData || !authData.refreshToken) {
      this.clearAuthData();
      return false;
    }

    // Check if refresh token is expired
    if (this.isTokenExpired(authData.refreshToken)) {
      this.clearAuthData();
      return false;
    }

    // Generate new token
    const newToken = this.generateToken(authData.user);
    const newAuthData = {
      ...authData,
      token: newToken
    };

    this.setAuthData(newAuthData);
    return true;
  }

  // Logout user
  logout() {
    this.clearAuthData();
    return Promise.resolve();
  }

  // Get current user
  getCurrentUser() {
    const authData = this.getAuthData();
    return authData ? authData.user : null;
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = this.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }

        // Update user in mock database
        this.users[userIndex] = {
          ...this.users[userIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };

        const updatedUser = this.users[userIndex];
        const { password: _, ...userWithoutPassword } = updatedUser;

        // Update stored user data
        const authData = this.getAuthData();
        if (authData && authData.user.id === userId) {
          const newAuthData = {
            ...authData,
            user: userWithoutPassword
          };
          this.setAuthData(newAuthData);
        }

        resolve(userWithoutPassword);
      }, 500);
    });
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = this.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }

        const user = this.users[userIndex];
        
        if (user.password !== currentPassword) {
          reject(new Error('Current password is incorrect'));
          return;
        }

        // Update password
        this.users[userIndex].password = newPassword;
        this.users[userIndex].updatedAt = new Date().toISOString();

        resolve({ message: 'Password updated successfully' });
      }, 500);
    });
  }

  // Get all users (admin only)
  async getAllUsers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const usersWithoutPasswords = this.users.map(({ password, ...user }) => user);
        resolve(usersWithoutPasswords);
      }, 300);
    });
  }

  // Create new user (admin only)
  async createUser(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if email already exists
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
          reject(new Error('User with this email already exists'));
          return;
        }

        const newUser = {
          id: `user-${Date.now()}`,
          ...userData,
          active: true,
          avatar: null,
          createdAt: new Date().toISOString(),
        };

        this.users.push(newUser);
        
        const { password: _, ...userWithoutPassword } = newUser;
        resolve(userWithoutPassword);
      }, 500);
    });
  }

  // Update user (admin only)
  async updateUser(userId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = this.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }

        this.users[userIndex] = {
          ...this.users[userIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };

        const { password: _, ...userWithoutPassword } = this.users[userIndex];
        resolve(userWithoutPassword);
      }, 500);
    });
  }

  // Delete user (admin only)
  async deleteUser(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = this.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }

        this.users.splice(userIndex, 1);
        resolve({ message: 'User deleted successfully' });
      }, 500);
    });
  }

  // Role and permission utilities
  hasRole(user, role) {
    return user && user.roles && user.roles.includes(role);
  }

  hasPermission(user, permission) {
    return user && user.permissions && user.permissions.includes(permission);
  }

  // Role hierarchy check
  hasRoleOrHigher(user, role) {
    if (!user || !user.roles) return false;
    
    const roleHierarchy = ['salesperson', 'sales_manager', 'admin'];
    const userHighestRole = Math.max(...user.roles.map(r => roleHierarchy.indexOf(r)));
    const requiredRoleIndex = roleHierarchy.indexOf(role);
    
    return userHighestRole >= requiredRoleIndex;
  }
}

export default new AuthService(); 