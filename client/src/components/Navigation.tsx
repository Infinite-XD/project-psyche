import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Settings, 
  BarChart,
  MessageCircle
} from "lucide-react";

const navItems = [
  { name: "My Profile", icon: <User size={20} /> },
  { name: "Mood Analysis", icon: <BarChart size={20} /> },
  { name: "Chat", icon: <MessageCircle size={20} /> },
  { name: "Settings", icon: <Settings size={20} /> }
];

const Navigation = () => {
  const [activeTab, setActiveTab] = useState("My Profile");

  return (
    <motion.nav 
      className="navigation"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="nav-container">
        {navItems.map((item) => (
          <motion.div
            key={item.name}
            className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
            onClick={() => setActiveTab(item.name)}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="nav-icon">
              {item.icon}
              {activeTab === item.name && (
                <motion.div 
                  className="nav-active-indicator"
                  layoutId="activeIndicator"
                  transition={{ duration: 0.3 }}
                  style={{ transform: "none" }} 
                />
              )}
            </div>
            <span className="nav-label">{item.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navigation;
