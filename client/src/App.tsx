import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './pages/homepage';
import ChatPage from './pages/chatbot';
import SettingsPage from './pages/settings';

// Hook to set --primary on root according to current path
const useThemeByPath = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    let colorVar: string;
    switch (pathname) {
      case '/login':
      case '/register':
        colorVar = '210 15% 20%'; // match Login.tsx bg gradient
        break;
      case '/':
        colorVar = '200 10% 15%'; // match HomePage wrapper BG
        break;
      case '/chat':
        colorVar = '260 20% 20%'; // match ChatPage wrapper BG
        break;
      case '/settings':
        colorVar = '0 0% 20%'; // match SettingsPage wrapper BG
        break;
      default:
        colorVar = '210 15% 20%';
    }
    document.documentElement.style.setProperty('--primary', colorVar);
  }, [pathname]);
};

// Fullscreen loading spinner
const FullScreenSpinner = () => (
  <div className="flex justify-center items-center h-screen primary-bg">
    <div className="text-accent animate-spin h-8 w-8">
      {/* spinner svg */}
    </div>
  </div>
);

// PrivateRoute & PublicRoute
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  return isAuthenticated ? <Navigate to="/" /> : <>{children}</>;
};

const AppContent: React.FC = () => {
  useThemeByPath();
  const { loading } = useAuth();
  if (loading) return <FullScreenSpinner />;

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Router>
        {/* Remove hardcoded wrappers; let each page component handle its own background */}
        <AppContent />
      </Router>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

/*
  main.tsx will import your global.css and render <App /> into #root.
  Each page now is responsible for its own .primary-bg or specific bg classes.
*/
