// Navigation.tsx

import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Settings, BarChart, MessageCircle } from "lucide-react";

const navItems = [
  { name: "My Profile", icon: <User size={20} />, path: "/" },
  { name: "Mood Analysis", icon: <BarChart size={20} />, path: "/moodanalysis" },
  { name: "Chat", icon: <MessageCircle size={20} />, path: "/chat" },
  { name: "Settings", icon: <Settings size={20} />, path: "/settings" }
];

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <motion.nav
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="bg-black backdrop-blur-xl p-3 shadow-2xl border border-gray-900 relative overflow-hidden">
        {/* Modern neon effect line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent/20 to-black"></div>
        
        <div className="nav-container">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={item.path}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <div className="nav-icon">
                  {item.icon}
                  {currentPath === item.path && (
                    <motion.div
                      className="nav-active-indicator"
                      layoutId="activeIndicator"
                      transition={{ duration: 0.3 }}
                      style={{ transform: "none" }}
                    />
                  )}
                </div>
                <span className="nav-label">{item.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;