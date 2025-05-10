# Client-Side Documentation

## Overview
The client-side application is built with React, TypeScript, and TailwindCSS, providing a modern and responsive user interface for the academic stress management platform.

## Tech Stack
- React 18
- TypeScript
- TailwindCSS
- Radix UI Components
- React Router
- Zustand (State Management)
- React Query
- Vite (Build Tool)

## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── styles/        # Global styles and Tailwind config
│   ├── types/         # TypeScript type definitions
│   ├── assets/        # Static assets
│   ├── contexts/      # React context providers
│   └── pages/         # Page components
└── public/            # Public assets
```

## Key Features

### 1. Authentication
- User registration
- Login/Logout functionality
- Password management
- Protected routes

### 2. Chat Interface
- Real-time chat with AI
- Message history
- Typing indicators
- Message timestamps

### 3. UI Components
- Responsive design
- Dark/Light mode
- Loading states
- Error handling
- Toast notifications

## Component Library

### Core Components
1. **Button**
   - Primary/Secondary variants
   - Loading state
   - Icon support
   - Disabled state

2. **Input**
   - Text input
   - Password input
   - Error states
   - Validation

3. **Card**
   - Header/Footer
   - Content area
   - Hover effects
   - Loading state

### Layout Components
1. **Container**
   - Responsive width
   - Padding control
   - Max-width constraints

2. **Grid**
   - Responsive columns
   - Gap control
   - Auto-fit support

3. **Flex**
   - Direction control
   - Alignment options
   - Wrap behavior

## State Management

### Global State (Zustand)
```typescript
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
```

### Local State
- React's useState for component-level state
- React's useReducer for complex state logic

## Routing

### Route Structure
```typescript
const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/chat',
    element: <ProtectedRoute><Chat /></ProtectedRoute>,
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
];
```

## API Integration

### API Client
```typescript
const api = {
  auth: {
    login: (credentials: LoginCredentials) => 
      axios.post('/api/auth/login', credentials),
    register: (userData: RegisterData) => 
      axios.post('/api/auth/register', userData),
    logout: () => 
      axios.post('/api/auth/logout'),
  },
  chat: {
    sendMessage: (message: string) => 
      axios.post('/api/chat/message', { text: message }),
    getHistory: () => 
      axios.get('/api/chat/history'),
  },
};
```

### React Query Integration
```typescript
const useChatHistory = () => {
  return useQuery({
    queryKey: ['chatHistory'],
    queryFn: () => api.chat.getHistory(),
  });
};
```

## Styling

### TailwindCSS Configuration
```typescript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          // ... other shades
          900: '#0c4a6e',
        },
      },
      // ... other theme extensions
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
  ],
};
```

### Custom Hooks

1. **useAuth**
```typescript
const useAuth = () => {
  const { user, setUser } = useStore();
  const navigate = useNavigate();

  const login = async (credentials: LoginCredentials) => {
    try {
      const { data } = await api.auth.login(credentials);
      setUser(data.user);
      navigate('/chat');
    } catch (error) {
      // Error handling
    }
  };

  return { user, login, logout };
};
```

2. **useChat**
```typescript
const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.chat.sendMessage(text);
      setMessages(prev => [...prev, data.reply]);
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
};
```

## Error Handling

### Global Error Boundary
```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
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

### Toast Notifications
```typescript
const showToast = (message: string, type: 'success' | 'error') => {
  toast[type](message, {
    position: 'top-right',
    autoClose: 5000,
  });
};
```

## Performance Optimization

### Code Splitting
```typescript
const Chat = React.lazy(() => import('./pages/Chat'));
const Profile = React.lazy(() => import('./pages/Profile'));
```

### Memoization
```typescript
const MemoizedComponent = React.memo(({ data }) => {
  // Component logic
});
```

### Virtualization
```typescript
const VirtualizedList = ({ items }) => {
  return (
    <VirtualScroll
      height={400}
      itemCount={items.length}
      itemSize={50}
    >
      {({ index }) => <ListItem item={items[index]} />}
    </VirtualScroll>
  );
};
```

## Testing

### Component Testing
```typescript
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Integration Testing
```typescript
describe('Login Flow', () => {
  it('successfully logs in user', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });
  });
});
```

## Accessibility

### ARIA Labels
```typescript
<button
  aria-label="Close dialog"
  onClick={onClose}
>
  <XIcon />
</button>
```

### Keyboard Navigation
```typescript
const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSubmit();
  }
};
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Build and Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
``` 