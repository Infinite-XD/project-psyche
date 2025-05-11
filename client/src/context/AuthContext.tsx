// client/src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';   

// Types
interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/profile', {
          credentials: 'include', // Includes cookies in the request
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Not authenticated
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register a new user
  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  // Login a user
  const login = async (usernameOrEmail: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
        credentials: 'include',
      });

      // 1) grab the raw text so we can debug what's coming back
      const text = await response.text();
      console.log('[AuthContext.login] raw response:', response.status, text);

      // 2) try to parse JSON (if possible)
      let data: any = {};
      try { data = JSON.parse(text); }
      catch (_) { /* not JSON? leave data as {} */ }

      // 3) if status is 401, we know it's bad credentials
      if (response.status === 401) {
        throw new Error('Incorrect username or password');
      }

      // 4) if non-OK status, pull any message or use generic
      if (!response.ok) {
        if (response.status === 401) {
          // map server “Invalid credentials” to our own friendly text
          throw new Error('Incorrect username or password. Please try again.');
        }
        throw new Error(data.message || 'Login failed. Please try again.');
      }

      // 5) sometimes backends return 200 but no user object → treat as failure
      if (!data.user) {
        throw new Error(data.message || 'Incorrect username or password');
      }

      // 6) success! stash the user and flip on isAuthenticated
      setUser(data.user);
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  // Logout a user
  const logout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};