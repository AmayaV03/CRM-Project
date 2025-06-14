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
│  │  │- UI State   │  │- User Prefs │  │- UI State   │  │   │
│  │  │- Settings   │  │- App Cache  │  │- Temp Data  │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                Services Layer                       │   │
│  │                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │Storage Svc  │  │Auth Service │  │Utils        │  │   │
│  │  │             │  │             │  │             │  │   │
│  │  │- LocalStore │  │- Token Mgmt │  │- Validators │  │   │
│  │  │- Session    │  │- Login/out  │  │- Formatters │  │   │
│  │  │- Cache Mgmt │  │- Refresh    │  │- Constants  │  │   │
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
├── forms/
│   ├── LeadForm.jsx
│   ├── StatusForm.jsx
│   └── SourceForm.jsx
├── layout/
│   ├── AppLayout.jsx
│   ├── PageHeader.jsx
│   └── ContentWrapper.jsx
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
    error: null
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
src/store/services/
├── storageService.js
├── authService.js
├── leadsService.js
├── reportsService.js
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
User Login → Local Auth → JWT Token → Store in Redux → Set Storage → Protected Routes Access
```

### 2. Data Protection
- Input validation and sanitization
- XSS protection with proper escaping
- Local storage encryption for sensitive data
- Token-based authentication

### 3. Route Protection
```javascript
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};
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