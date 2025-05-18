// client/src/components/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import MascotIcon from '../components/MascotIcon';
import Modal from 'react-modal'; // Add a modal library or create your own
import { useNavigate } from 'react-router-dom';

// Add modal styles if using react-modal
Modal.setAppElement('#root');

const Login: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!usernameOrEmail.trim() || !password.trim()) {
      setError('Please enter both username/email and password');
      return;
    }

    try {
      await login(usernameOrEmail, password);
      // Login successful - navigate will be handled by AuthContext's state changes
    } catch (err) {
      // Handle the error from AuthContext
      if (err instanceof Error) {
        // Check for credential-specific errors
        if (err.message.includes('Invalid credentials')) {
          setError('Incorrect username/email or password');
        } else {
          setError(err.message || 'Login failed');
        }
      } else {
        setError('An unexpected error occurred');
      }
      
      // Show the error modal
      setShowErrorModal(true);
    }
  };

  // Close modal handler
  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6 relative">

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onRequestClose={closeErrorModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="bg-red-800/20 p-6 rounded-xl border border-red-800/40">
          <h3 className="text-red-300 text-lg font-bold mb-4">Login Failed</h3>
          <p className="text-red-200">{error}</p>
          <button
            onClick={closeErrorModal}
            className="mt-4 px-4 py-2 bg-red-700/30 text-red-200 rounded hover:bg-red-700/40 transition"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Animated background elements - true black theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full" 
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)',
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: 'blur(40px)',
                opacity: Math.random() * 0.3 + 0.1,
                transform: 'translate(-50%, -50%)',
                animation: `floatEffect ${Math.random() * 10 + 20}s infinite ease-in-out`
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 animate-bounce-slow z-10">
        <MascotIcon/>
      </div>

      {/* Brand element top-left */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
          <span className="font-bold text-white text-lg sm:text-xl tracking-wider">Project<span className="text-accent">Psyche</span></span>
        </div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Card glow effects - enhanced for true black theme */}
        <div className="absolute inset-0 rounded-3xl opacity-20 blur-xl -z-10" 
             style={{background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2), transparent 70%)'}}></div>
        <div className="absolute inset-0 rounded-3xl -z-10 animate-pulse-slow"
             style={{background: 'linear-gradient(45deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.1) 100%)'}}></div>
        
        {/* Main card */}
        <div className="bg-black backdrop-blur-xl rounded-3xl p-6 sm:p-10 space-y-6 sm:space-y-8 shadow-2xl border border-gray-900 relative overflow-hidden">
          {/* Abstract geometric accents */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-20"
               style={{background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 70%)'}}>
          </div>
          <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full opacity-20"
               style={{background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 70%)'}}></div>
          
          {/* Modern neon effect line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent/20 to-black"></div>
          
          <div className="space-y-2 relative">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-center"
                style={{
                  background: 'linear-gradient(to right, #ffffff, #cccccc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
              Welcome Back
            </h2>
            <p className="text-center text-gray-500 text-sm sm:text-base">Sign in to continue your journey</p>
          </div>

          {/* Inline error message - displayed directly on the form */}
          {error && (
            <div className="text-red-300 bg-red-900/20 px-4 py-3 rounded-xl border border-red-800/40 flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form 
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >
            {[ 
              { 
                id: 'usernameOrEmail', 
                type: 'text', 
                placeholder: 'Username or Email', 
                icon: (
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                ), 
                value: usernameOrEmail, 
                setter: setUsernameOrEmail 
              },
              { 
                id: 'password', 
                type: 'password', 
                placeholder: 'Password', 
                icon: (
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                ), 
                value: password, 
                setter: setPassword 
              }
            ].map(field => (
              <div key={field.id} className="group">
                <label htmlFor={field.id} className="block text-xs text-gray-500 mb-2 pl-2">{field.placeholder}</label>
                <div className="relative">
                  {/* Fixed z-index to ensure input is interactive and visible */}
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-300 group-hover:border-gray-700 z-10 relative"
                    style={{ color: '#ffffff', backgroundColor: '#111111' }}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-accent transition-colors duration-300 z-20">
                    {field.icon}
                  </div>
                  {/* Glow effect positioned behind the input */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/50 to-accent/0 opacity-0 group-hover:opacity-30 rounded-xl blur-sm transition duration-300 -z-10"></div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center text-sm px-1">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="w-4 h-4 bg-gray-900 border-gray-800 rounded text-accent focus:ring-accent focus:ring-offset-black"
                />
                <label htmlFor="remember" className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer text-sm">Remember me</label>
              </div>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors text-sm">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 relative text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center space-x-2 overflow-hidden group"
              style={{
                background: 'linear-gradient(45deg, rgba(60,60,60,1) 0%, rgba(20,20,20,1) 100%)'
              }}
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              )}
              <span className="relative z-10">{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-gray-500 text-sm">Don't have an account?{' '}
              <Link to="/register" className="text-accent font-medium hover:underline transition-colors">Create one now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;