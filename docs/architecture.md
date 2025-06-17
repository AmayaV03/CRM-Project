# LeadFlow CRM - System Architecture

## Overview

This document outlines the system architecture for LeadFlow CRM, a React-based lead management system designed with modern web development practices, scalability, and maintainability in mind.

## Architecture Principles

### 1. Component-Based Architecture
- **Modular Design**: Each UI component serves a single purpose
- **Reusability**: Components are designed for reuse across the application
- **Composition**: Complex UIs built by composing simpler components
- **Encapsulation**: Components manage their own state and behavior

### 2. Unidirectional Data Flow
- **Redux Store**: Single source of truth for application state
- **Actions**: Describe what happened in the application
- **Reducers**: Specify how state changes in response to actions
- **Selectors**: Extract specific pieces of state for components

### 3. Separation of Concerns
- **Presentation Layer**: React components for UI rendering
- **Business Logic Layer**: Custom hooks and utility functions
- **Data Layer**: State management and local storage
- **State Management**: Redux for global state management

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Layer                            │
├─────────────────────────────────────────────────────────────┤
│                  React Application                          │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │    Hooks     │     │
│  │              │  │              │  │              │     │
│  │ - Dashboard  │  │ - LeadForm   │  │ - useLeads   │     │
│  │ - KanbanBoard│  │ - LeadCard   │  │ - useAuth    │     │
│  │ - Admin      │  │ - LoginForm  │  │ - useUsers   │     │
│  │ - Reports    │  │ - Charts     │  │ - useLocal   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               State Management                      │   │
│  │                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │Redux Store  │  │Local Cache  │  │Local State  │  │   │
│  │  │             │  │             │  │             │  │   │
│  │  │- Auth       │  │- Lead Data  │  │- Form Data  │  │   │
│  │  │- UI State   │  │- User Data  │  │- UI State   │  │   │
│  │  │- Users      │  │- Passwords  │  │- Temp Data  │  │   │
│  │  │- Settings   │  │- App Cache  │  │- Dialogs    │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                Services Layer                       │   │
│  │                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │Storage Svc  │  │Auth Service │  │User Service │  │   │
│  │  │             │  │             │  │             │  │   │
│  │  │- LocalStore │  │- Enhanced   │  │- User CRUD  │  │   │
│  │  │- Session    │  │  Auth Logic │  │- Password   │  │   │
│  │  │- Cache Mgmt │  │- Dual Check │  │  Management │  │   │
│  │  │- Migration  │  │- Role Perms │  │- Role Mgmt  │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              localStorage Layer                     │   │
│  │                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │Auth Tokens  │  │User Data    │  │App Settings │  │   │
│  │  │             │  │             │  │             │  │   │
│  │  │- JWT Token  │  │- crm_users  │  │- Security   │  │   │
│  │  │- Refresh    │  │- crm_user_  │  │- UI Prefs   │  │   │
│  │  │- User Data  │  │  passwords  │  │- Language   │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### 1. Presentation Layer

#### Pages
High-level route components that orchestrate multiple components:

```
src/pages/
├── Dashboard/
│   ├── index.jsx
│   ├── DashboardMetrics.jsx
│   └── DashboardCharts.jsx
├── Leads/
│   ├── index.jsx
│   ├── LeadsList.jsx
│   ├── LeadForm.jsx
│   └── LeadDetails.jsx
├── KanbanBoard/
│   ├── index.jsx
│   ├── KanbanColumn.jsx
│   ├── KanbanCard.jsx
│   └── DragDropProvider.jsx
├── Admin/
│   ├── index.jsx
│   ├── UserManagementPage.jsx
│   ├── SystemSettings.jsx
│   └── SecuritySettings.jsx
├── Auth/
│   ├── LoginPage.jsx
│   └── index.jsx
├── Settings/
│   ├── index.jsx
│   ├── Settings.jsx
│   ├── LanguageSettings.jsx
│   ├── ThemeSettings.jsx
│   ├── RegionalSettings.jsx
│   └── LanguageSelector.jsx
└── Reports/
    ├── index.jsx
    ├── ReportsChart.jsx
    └── ReportsFilters.jsx
```

#### Components
Reusable UI components organized by functionality:

```
src/components/
├── common/
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── LoadingSpinner.jsx
│   ├── ErrorBoundary.jsx
│   └── ConfirmDialog.jsx
├── auth/
│   ├── LoginForm.jsx
│   ├── UserProfile.jsx
│   └── ProtectedRoute.jsx
├── forms/
│   ├── LeadForm.jsx
│   ├── StatusForm.jsx
│   └── SourceForm.jsx
├── layout/
│   ├── AppLayout.jsx
│   ├── PageHeader.jsx
│   └── ContentWrapper.jsx
│   └── AppRouter.jsx
└── charts/
    ├── PieChart.jsx
    ├── BarChart.jsx
    └── MetricCard.jsx
```

### 2. State Management Layer

#### Redux Store Structure
```javascript
// Store Shape
{
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    roles: [],
    permissions: []
  },
  ui: {
    theme: 'light',
    language: 'en',
    sidebarOpen: true,
    notifications: []
  },
  leads: {
    items: [],
    loading: false,
    error: null,
    filters: {}
  },
  users: {
    items: [],
    loading: false,
    error: null,
    currentUser: null
  },
  cache: {
    // Local data cache
    lastUpdate: null,
    version: '1.0'
  }
}
```

#### Slices
```
src/store/slices/
├── authSlice.js
├── uiSlice.js
├── leadsSlice.js
└── settingsSlice.js
```

#### Data Management
```
src/services/
├── storageService.js
├── authService.js        // Enhanced with localStorage user authentication
├── leadsService.js
├── reportsService.js
├── userService.js        // User management operations
└── masterDataService.js
```

### 3. Business Logic Layer

#### Custom Hooks
```
src/hooks/
├── useAuth.js          // Authentication logic
├── useLeads.js         // Lead management logic
├── useLocalStorage.js  // Local storage management
├── useDebounce.js      // Debouncing utility
├── usePagination.js    // Pagination logic
└── useNotifications.js // Notification management
```

#### Services
```
src/services/
├── storageClient.js    // Local storage client
├── authService.js      // Authentication service
├── leadService.js      // Lead business logic
├── reportService.js    // Report generation
└── exportService.js    // Data export functionality
```

### 4. Utility Layer

#### Utils
```
src/utils/
├── validators.js       // Form validation functions
├── formatters.js       // Data formatting utilities
├── constants.js        // Application constants
├── dateUtils.js        // Date manipulation utilities
└── helpers.js          // General helper functions
```

#### Localization
```
src/locales/
├── en.js              // English translations
├── ar.js              // Arabic translations
└── index.js           // i18n configuration
```

## User Management Architecture

### 1. Admin User Management Flow
```
Admin Dashboard → UserManagementPage → Create/Edit User → 
localStorage (crm_users) → Password Management → localStorage (crm_user_passwords) → 
User Notification → Login Ready
```

### 2. Password Management System
```javascript
// Password Management Components
src/pages/Admin/UserManagementPage.jsx
├── handlePasswordManagement()     // Opens password dialog
├── setUserPassword()             // Sets admin password
├── generateSecurePassword()      // Generates secure passwords
└── Password Dialog UI            // User interface for password management

// Authentication Integration
src/services/authService.js
├── getUsersFromStorage()         // Retrieves localStorage users
├── getAdminPasswordsFromStorage() // Retrieves admin passwords
├── authenticate()                // Enhanced authentication logic
└── getRolePermissions()          // Maps roles to permissions
```

### 3. User Authentication Flow
```
Login Attempt → authService.authenticate() → 
Check Hardcoded Users → Check localStorage Users → 
Validate Admin Password (Priority) → Validate User Password (Fallback) → 
Generate JWT Token → Store Auth Data → Grant Access
```

### 4. Role-Based Access Control
```javascript
// Role Hierarchy
Admin → Full Access (manage_users, manage_leads, view_reports, reassign_leads)
Sales Manager → Limited Admin (manage_leads, view_reports, reassign_leads)
Salesperson → Basic Access (manage_leads)

// Permission Mapping
const getRolePermissions = (roles) => {
  if (roles.includes('admin')) return ['manage_leads', 'manage_users', 'view_reports', 'reassign_leads'];
  if (roles.includes('sales_manager')) return ['manage_leads', 'view_reports', 'reassign_leads'];
  if (roles.includes('salesperson')) return ['manage_leads'];
  return [];
};
```

## Data Flow Patterns

### 1. User Interaction Flow
```
User Action → Component → Hook/Service → Redux Action → State Update → Component Re-render
```

### 2. Lead Management Flow
```
Component → useLeads Hook → Local Storage → Cache Update → Component Update
```

### 3. Form Submission Flow
```
LeadForm → onSubmit → createLead Service → Local Storage → Cache Invalidation → UI Update
```

### 4. User Management Flow
```
Admin Action → UserManagementPage → User Service → localStorage Update → 
Event Dispatch → Component Re-render → Notification Display
```

### 5. Authentication Flow
```
Login Form → useAuth Hook → authService → localStorage Check → 
Token Generation → Redux Update → Route Protection → Dashboard Access
```

## Component Architecture

### 1. Smart vs Dumb Components

#### Smart Components (Containers)
- Handle business logic
- Connect to Redux store
- Manage local state
- Coordinate child components

#### Dumb Components (Presentational)
- Receive data via props
- Focus on UI rendering
- Stateless when possible
- Highly reusable

### 2. Component Composition

#### Higher-Order Components
```javascript
// withAuth HOC
const withAuth = (Component) => {
  return (props) => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return <Component {...props} />;
  };
};
```

#### Render Props Pattern
```javascript
// DataProvider component
const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  return children({ data, loading, setData });
};
```

### 3. Error Handling

#### Error Boundaries
```javascript
class LeadErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

#### Global Error Handling
```javascript
const useErrorHandler = () => {
  const dispatch = useDispatch();
  
  const handleError = useCallback((error) => {
    console.error('Application Error:', error);
    
    // Show user-friendly error message
    dispatch(showNotification({
      type: 'error',
      message: 'An error occurred. Please try again.'
    }));
  }, [dispatch]);
  
  return { handleError };
};
```

## Security Architecture

### 1. Authentication Flow
```
User Login → Enhanced Auth Service → Check Hardcoded Users → Check localStorage Users → 
Admin Password Validation → JWT Token → Store in Redux → Set Storage → Protected Routes Access
```

#### Enhanced Authentication Process
1. **Dual User Source**: Checks both hardcoded users and localStorage users
2. **Admin Password Management**: Supports admin-created passwords stored separately
3. **Backward Compatibility**: Maintains support for existing authentication methods
4. **Role-Based Access**: Assigns permissions based on user roles

### 2. User Management System
```
Admin Creates User → Store in localStorage (crm_users) → 
Admin Sets Password → Store in localStorage (crm_user_passwords) → 
User Login → Authentication Service Validates → Access Granted
```

#### Password Management Features
- **Admin Password Creation**: Admins can set passwords for users
- **Dual Storage**: Passwords stored in both user records and admin reference
- **Priority System**: Admin-set passwords take precedence over user passwords
- **Secure Validation**: Proper password validation during authentication

### 3. Data Protection
- Input validation and sanitization
- XSS protection with proper escaping
- Local storage encryption for sensitive data
- Token-based authentication
- Role-based access control (RBAC)
- Admin password management with audit trail

### 4. Route Protection
```javascript
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Role-based Route Protection
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/unauthorized" />;
  
  return children;
};
```

### 5. localStorage Security Model
```javascript
// User Data Structure
localStorage: {
  'crm_users': [
    {
      id: 'user-id',
      name: 'User Name',
      email: 'user@example.com',
      roles: ['salesperson'],
      status: 'active',
      password: 'user-password' // Fallback password
    }
  ],
  'crm_user_passwords': {
    'user-id': {
      email: 'user@example.com',
      password: 'admin-set-password', // Takes precedence
      setBy: 'Admin User',
      setAt: '2024-01-20T15:30:00Z'
    }
  }
}
```

## Performance Optimization

### 1. Code Splitting
```javascript
// Lazy loading for routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const KanbanBoard = lazy(() => import('./pages/KanbanBoard'));
```

### 2. Memoization
```javascript
// Component memoization
const LeadCard = memo(({ lead, onUpdate }) => {
  return (
    <Card>
      {/* Component content */}
    </Card>
  );
});

// Hook memoization
const useLeadMetrics = () => {
  const leads = useSelector(selectAllLeads);
  
  const metrics = useMemo(() => {
    return calculateMetrics(leads);
  }, [leads]);
  
  return metrics;
};
```

### 3. Virtual Scrolling
```javascript
// For large datasets
const LeadsList = () => {
  const { items, loadMore } = useInfiniteScroll();
  
  return (
    <VirtualizedList
      items={items}
      onEndReached={loadMore}
      renderItem={({ item }) => <LeadCard lead={item} />}
    />
  );
};
```

## Data Storage Architecture

### 1. localStorage Structure
```javascript
// Application Data Storage
localStorage: {
  // Authentication Tokens
  'leadflow_auth_token': 'jwt-token-string',
  'leadflow_user_data': '{"id":"user-1","name":"User Name",...}',
  'leadflow_refresh_token': 'refresh-token-string',
  
  // User Management Data
  'crm_users': '[{"id":"user-1","name":"User Name","email":"user@example.com",...}]',
  'crm_user_passwords': '{"user-1":{"password":"admin-set-password","setBy":"Admin",...}}',
  
  // Application Settings
  'crm_security_settings': '{"passwordMinLength":8,"requireUppercase":true,...}',
  
  // User Preferences
  'leadflow_saved_email': 'user@example.com',
  'leadflow_remember_me': 'true'
}
```

### 2. Data Synchronization
```
Component State ↔ localStorage ↔ Redux Store ↔ UI Components
```

### 3. Cache Management
- Automatic cache invalidation on data updates
- Event-driven cache updates using CustomEvent
- Optimistic UI updates with rollback capability

### 4. Data Migration Strategy
```javascript
// Version-based data migration
const migrateUserData = (version) => {
  switch(version) {
    case '1.0':
      // Migrate from old user structure
      break;
    case '2.0':
      // Add password management fields
      break;
  }
};
```

## Deployment Architecture

### 1. Build Process
```
Source Code → Vite Build → Static Assets → CDN Distribution
```

### 2. Environment Configuration
- Development environment
- Staging environment
- Production environment
- Feature branch deployments

### 3. Security Considerations
- Environment-specific authentication endpoints
- Secure token storage and transmission
- Role-based deployment access
- Data encryption in production environments