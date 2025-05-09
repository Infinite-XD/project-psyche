// homepage.tsx
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import MoodTracker from "../components/MoodTracker";
import Mascot from "../components/Mascot";
import "../styles/globals.css";

// mood-interface w-full flex items-center justify-center

const HomePage = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return null;
  
  return (
    <div className="app-container flex flex-col min-h-screen">
      <div className="app-content flex flex-col items-center justify-between">
        <div>
          <h1 className="app-title">Mood Tracker</h1>
          
          <div className="mascot-section">
            <Mascot size={250} />
          </div>
        </div>
        
        {/* Wrapper with consistent width */}
        <div className="mood-interface flex items-center justify-center">
          <div className="w-full max-w-nav">
            <MoodTracker />
          </div>
        </div>
        
        <Navigation />
      </div>
    </div>
  );
};

export default HomePage;