// import { useEffect, useState } from "react";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { queryClient } from "./lib/queryClient";
// import Navigation from "./components/Navigation";
// import MoodTracker from "./components/MoodTracker";
// import Mascot from "./components/Mascot";
// import "./styles/globals.css";

// function App() {
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     // Initialize app and set mounted
//     setIsMounted(true);
//   }, []);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <div className="app-container">
//         <div className="app-content">
//           <h1 className="app-title">Mood Tracker</h1>
          
//           <div className="mascot-section">
//             <Mascot size={250} />
//           </div>
          
//           <div className="mood-interface">
//             <MoodTracker />
//           </div>
          
//           <Navigation />
//         </div>
//       </div>
//     </QueryClientProvider>
//   );
// }

// export default App;

// client/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';

// Private route wrapper component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-blue-400">
          <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Home/Dashboard component
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
          <button
            onClick={() => logout()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-gray-700/30 p-4 rounded-lg mb-6 border border-gray-600">
          <p className="font-medium text-gray-200">Welcome, {user?.username}!</p>
          <p className="text-gray-400">Email: {user?.email}</p>
        </div>
        
        <div className="border-t border-gray-600 pt-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-100">Your Dashboard Content</h2>
          <p className="text-gray-300">This is a protected area of the application. Only authenticated users can see this content.</p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-600 p-4 rounded-lg bg-gray-700/30">
              <h3 className="font-semibold text-lg mb-2 text-gray-200">Profile Stats</h3>
              <p className="text-gray-400">Account created: {new Date().toLocaleDateString()}</p>
              <p className="text-gray-400">User ID: {user?.id}</p>
            </div>
            
            <div className="border border-gray-600 p-4 rounded-lg bg-gray-700/30">
              <h3 className="font-semibold text-lg mb-2 text-gray-200">Quick Actions</h3>
              <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm mr-2">
                Edit Profile
              </button>
              <button className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                View Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Root component with routing
const AppContent: React.FC = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-blue-400">
          <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <nav className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <div className="font-bold text-xl text-blue-400">Your App Name</div>
              <div>
                <a href="/login" className="text-gray-300 hover:text-blue-400 transition-colors mr-4">Login</a>
                <a href="/register" className="text-gray-300 hover:text-blue-400 transition-colors">Register</a>
              </div>
            </div>
          </nav>
          
          <div className="mx-auto py-8 px-4">
            <AppContent />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;