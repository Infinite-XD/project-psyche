import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import MoodTracker from "../components/MoodTracker";
import Mascot from "../components/Mascot";
import "../styles/globals.css";

const HomePage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">Mood Tracker</h1>
        
        <div className="mascot-section">
          <Mascot size={250} />
        </div>
        
        <div className="mood-interface">
          <MoodTracker />
        </div>
        
        <Navigation />
      </div>
    </div>
  );
};

export default HomePage;