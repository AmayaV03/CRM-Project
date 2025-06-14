# LeadFlow CRM - Architecture Patterns Guide

## Overview

This document outlines the architectural patterns, design principles, and best practices used in the LeadFlow CRM system. It serves as a guide for developers to understand and maintain consistency across the codebase.

## Core Architectural Patterns

### 1. Component-Based Architecture

#### Container/Presentation Pattern
Separate components that handle logic from those that handle presentation.

```javascript
// Container Component (Logic)
const LeadsContainer = () => {
  const leads = useSelector(selectAllLeads);
  const dispatch = useDispatch();
  
  const handleStatusChange = (leadId, newStatus) => {
    dispatch(updateLeadStatus({ id: leadId, status: newStatus }));
  };
  
  return (
    <LeadsPresentation
      leads={leads}
      onStatusChange={handleStatusChange}
    />
  );
};

// Presentation Component (UI)
const LeadsPresentation = ({ leads, onStatusChange }) => {
  return (
    <div>
      {leads.map(lead => (
        <LeadCard 
          key={lead.id}
          lead={lead}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};
```

#### Compound Components Pattern
For complex UI components with multiple related parts.

```javascript
// Usage
<KanbanBoard>
  <KanbanBoard.Column status="open" title="Open Leads">
    <KanbanBoard.Card leadId="1" />
    <KanbanBoard.Card leadId="2" />
  </KanbanBoard.Column>
  <KanbanBoard.Column status="contacted" title="Contacted">
    <KanbanBoard.Card leadId="3" />
  </KanbanBoard.Column>
</KanbanBoard>
```

#### Higher-Order Components (HOCs) for Cross-Cutting Concerns

```javascript
// withAuth HOC
const withAuth = (WrappedComponent) => {
  return (props) => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Usage
export default withAuth(Dashboard);
```

### 2. State Management Patterns

#### Redux Toolkit Pattern
Structured approach to Redux with RTK.

```javascript
// Slice Pattern
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'light',
    language: 'en',
    sidebarOpen: true,
    notifications: []
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload
      });
    }
  }
});
```

#### Local Storage Pattern
Data persistence using local storage.

```javascript
// Storage Service Pattern
const storageService = {
  getLeads: () => {
    const leads = localStorage.getItem('leads');
    return leads ? JSON.parse(leads) : [];
  },
  
  saveLeads: (leads) => {
    localStorage.setItem('leads', JSON.stringify(leads));
  },
  
  addLead: (lead) => {
    const leads = storageService.getLeads();
    const newLead = { ...lead, id: Date.now(), createdAt: new Date().toISOString() };
    leads.push(newLead);
    storageService.saveLeads(leads);
    return newLead;
  }
};
```

#### Custom Hooks Pattern
Encapsulate business logic in reusable hooks.

```javascript
// useLeadManagement hook
const useLeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLeads = useCallback(() => {
    setLoading(true);
    const storedLeads = storageService.getLeads();
    setLeads(storedLeads);
    setLoading(false);
  }, []);

  const moveLead = useCallback((leadId, newStatus) => {
    setLeads(currentLeads => 
      currentLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: newStatus, updatedAt: new Date().toISOString() }
          : lead
      )
    );
  }, []);

  const markAsCold = useCallback((leadId) => {
    setLeads(currentLeads => 
      currentLeads.map(lead => 
        lead.id === leadId 
          ? { 
              ...lead, 
              status: 'cold',
              lastActivity: new Date().toISOString()
            }
          : lead
      )
    );
  }, []);

  return {
    leads,
    loading,
    loadLeads,
    moveLead,
    markAsCold
  };
};
```

### 3. Form Management Patterns

#### React Hook Form Integration
Consistent form handling across the application.

```javascript
// Form Schema Pattern
const leadFormSchema = {
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' }
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    }
  },
  phone: {
    required: 'Phone is required',
    pattern: {
      value: /^[\+]?[0-9\s\-\(\)]+$/,
      message: 'Invalid phone number'
    }
  }
};

// Form Component Pattern
const LeadForm = ({ initialData, onSubmit }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm({
    defaultValues: initialData,
    mode: 'onBlur'
  });

  const onFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <TextField
        {...register('name', leadFormSchema.name)}
        error={!!errors.name}
        helperText={errors.name?.message}
        label="Name"
        fullWidth
      />
      <TextField
        {...register('email', leadFormSchema.email)}
        error={!!errors.email}
        helperText={errors.email?.message}
        label="Email"
        fullWidth
      />
      <Button 
        type="submit" 
        variant="contained" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Lead'}
      </Button>
    </form>
  );
};
```

### 4. Error Handling Patterns

#### Global Error Handling Pattern
Consistent error handling across the application.

```javascript
const useErrorHandler = () => {
  const dispatch = useDispatch();
  
  const handleError = useCallback((error, context = '') => {
    console.error(`Error in ${context}:`, error);
    
    // Log error for debugging
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    };
    
    // Store error in local storage for debugging
    const errors = JSON.parse(localStorage.getItem('errorLog') || '[]');
    errors.push(errorInfo);
    localStorage.setItem('errorLog', JSON.stringify(errors.slice(-50))); // Keep last 50 errors
    
    // Show user-friendly error message
    dispatch(showNotification({
      type: 'error',
      message: 'An error occurred. Please try again.'
    }));
  }, [dispatch]);
  
  return { handleError };
};
```

#### Component Error Boundary Pattern
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error details
    const errorLog = {
      error: error.toString(),
      errorInfo,
      timestamp: new Date().toISOString()
    };
    
    const errors = JSON.parse(localStorage.getItem('componentErrors') || '[]');
    errors.push(errorLog);
    localStorage.setItem('componentErrors', JSON.stringify(errors.slice(-20)));
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Something went wrong
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please refresh the page or try again later.
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
```

### 5. Performance Optimization Patterns

#### Memoization Pattern
```javascript
// Component Memoization
const LeadCard = React.memo(({ lead, onStatusChange }) => {
  const handleStatusChange = (newStatus) => {
    onStatusChange(lead.id, newStatus);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{lead.name}</Typography>
        <Typography variant="body2">{lead.email}</Typography>
        <Chip 
          label={lead.status} 
          color={getStatusColor(lead.status)}
        />
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  return prevProps.lead.id === nextProps.lead.id &&
         prevProps.lead.updatedAt === nextProps.lead.updatedAt;
});

// Hook Memoization
const useFilteredLeads = (leads, filters) => {
  return useMemo(() => {
    return leads.filter(lead => {
      if (filters.status && lead.status !== filters.status) return false;
      if (filters.owner && lead.owner !== filters.owner) return false;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return lead.name.toLowerCase().includes(searchTerm) ||
               lead.email.toLowerCase().includes(searchTerm);
      }
      return true;
    });
  }, [leads, filters]);
};
```

#### Virtual Scrolling Pattern
```javascript
// For large datasets
import { FixedSizeList as List } from 'react-window';

const LeadsList = ({ leads }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <LeadCard lead={leads[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={leads.length}
      itemSize={120}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### 6. Routing Patterns

#### Protected Routes Pattern
```javascript
// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Usage
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
  <Route path="/admin" element={
    <ProtectedRoute roles={['admin']}>
      <AdminPanel />
    </ProtectedRoute>
  } />
</Routes>
```

#### Lazy Loading Pattern
```javascript
// Route-based code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));
const KanbanBoard = lazy(() => import('../pages/KanbanBoard'));
const Reports = lazy(() => import('../pages/Reports'));

// App routing with Suspense
const AppRoutes = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/kanban" element={<KanbanBoard />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  </Suspense>
);
```

### 7. Data Persistence Patterns

#### Local Storage Service Pattern
```javascript
// Storage abstraction layer
class StorageService {
  constructor(prefix = 'leadflow_') {
    this.prefix = prefix;
  }

  setItem(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  removeItem(key) {
    localStorage.removeItem(this.prefix + key);
  }

  clear() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Usage
const storage = new StorageService('crm_');
storage.setItem('leads', leads);
const savedLeads = storage.getItem('leads', []);
```

### 8. Theme and Styling Patterns

#### Theme Provider Pattern
```javascript
// Theme configuration
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const { theme } = useSelector(state => state.ui);
  const selectedTheme = theme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <MuiThemeProvider theme={selectedTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
```

## Best Practices

### 1. Component Design
- Keep components small and focused
- Use composition over inheritance
- Implement proper prop validation
- Handle loading and error states
- Make components accessible

### 2. State Management
- Keep state as local as possible
- Use Redux for global state only
- Normalize state structure
- Use selectors for derived data
- Implement proper error handling

### 3. Performance
- Use React.memo for expensive components
- Implement proper key props for lists
- Use lazy loading for routes
- Optimize bundle size

### 4. Code Quality
- Write clean, readable code
- Use meaningful names for variables and functions
- Follow consistent coding patterns
- Document complex logic
- Maintain good code organization

### 5. Accessibility
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Provide alternative text for images

This architecture patterns guide provides a solid foundation for building maintainable, scalable, and performant React applications while following industry best practices and standards. 