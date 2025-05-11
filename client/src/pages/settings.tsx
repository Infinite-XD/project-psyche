//settings.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import MascotIcon from '../components/MascotIcon';
import "../styles/globals.css";
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { logout } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message || "Password changed successfully");
        setOldPassword("");
        setNewPassword("");
      } else {
        setError(data.message || "Failed to change password");
      }
    } catch (err: any) {
      console.error("Error changing password", err);
      setError(err.message || "Error changing password");
    }
  };

  const handleDeleteAccount = async () => {
    setError("");
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await fetch("/api/delete-account", {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          await logout();
          navigate("/login", { replace: true });
        } else {
          const err = await response.json();
          setError(err.message || "Failed to delete account");
        }
      } catch {
        setError("Error deleting account");
      }
    }
  };

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed", err);
      setError("Failed to logout. Please try again.");
    }
  };

  if (!isMounted) return null;

return (
  <div
    className="h-screen flex flex-col items-center pb-20"
    style={{ background: 'linear-gradient(135deg, #070707 0%, #141414 100%)' }}
  >
{/* Animated background elements */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  <div className="absolute top-0 left-0 w-full h-full opacity-20">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(168, 48, 48, 0) 70%)',
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
{/* Main content */}
    <div className="w-full flex-1 flex flex-col min-h-0">
      <div className="relative flex-1 flex flex-col min-h-0 w-full">
        {/* Card glow */}
        <div className="absolute inset-0 rounded-2xl opacity-20 blur-xl -z-10" style={{background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2), transparent 70%)'}} />
        <div className="absolute inset-0 rounded-2xl -z-10 animate-pulse-slow" style={{background: 'linear-gradient(45deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.1) 100%)'}} />

        {/* Card itself */}
        <div className="bg-black backdrop-blur-xl shadow-2xl border-b border-gray-900 
                        relative flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent/20 to-black" />

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar w-full px-4 pt-5 pb-20">
              {error && (
                <div className="text-red-300 bg-red-900/20 px-3 py-2.5 rounded-lg border border-red-800/40 flex items-center space-x-2.5 mb-1">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="text-green-300 bg-green-900/20 px-3 py-2.5 rounded-lg border border-green-800/40 flex items-center space-x-2.5 mb-1">
                  <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{success}</span>
                </div>
              )}
              <div className="w-full max-w-[500px] flex flex-col items-center mt-3 mb-3">
                <h1 className="text-3xl font-extrabold mb-6"
                    style={{
                      background: 'linear-gradient(to right, #ffffff, #cccccc)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                  Settings
                </h1>
              </div>
              <div className="space-y-6">
                {/* Password Change Form */}
                <form onSubmit={handlePasswordChange} className="space-y-5">
                  
                  <div className="group space-y-3">
                    <div>
                      <label htmlFor="oldPassword" className="block text-xs text-gray-500 mb-1.5 pl-1">Current Password</label>
                      <div className="relative">
                        <input
                          id="oldPassword"
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          required
                          className="w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-300 group-hover:border-gray-700 z-10 relative"
                          style={{ color: '#ffffff', backgroundColor: '#111111' }}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-accent transition-colors duration-300 z-20">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-xs text-gray-500 mb-1.5 pl-1">New Password</label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-300 group-hover:border-gray-700 z-10 relative"
                          style={{ color: '#ffffff', backgroundColor: '#111111' }}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-accent transition-colors duration-300 z-20">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 relative text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 overflow-hidden group"
                    style={{
                      background: 'linear-gradient(45deg, rgba(60,60,60,1) 0%, rgba(20,20,20,1) 100%)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Change Password</span>
                  </button>
                </form>

                {/* Danger Zone */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <h3 className="text-red-400 text-lg font-semibold">Danger Zone</h3>
                    <div className="h-px bg-gradient-to-r from-black via-red-500/30 to-black"></div>
                  </div>
                  
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full py-3 relative text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 overflow-hidden group"
                    style={{
                      background: 'linear-gradient(45deg, rgba(90,30,30,1) 0%, rgba(40,10,10,1) 100%)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <svg className="w-4 h-4 mr-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="relative z-10">Delete Account</span>
                  </button>

                {/* Mascot Icon – smaller and centered above logout */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="animate-bounce-slow scale-75">
                    <MascotIcon />
                  </div>
                </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 relative font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 overflow-hidden group bg-transparent border border-gray-800"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-gray-400 group-hover:text-white relative z-10">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed navigation */}
      <div className="fixed inset-x-0 bottom-0 bg-black">
        <Navigation />
      </div>
    </div>
  );
};

export default SettingsPage;