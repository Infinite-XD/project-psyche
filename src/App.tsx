import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Navigation from "./components/Navigation";
import MoodTracker from "./components/MoodTracker";
import Mascot from "./components/Mascot";
import "./styles/globals.css";

function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Initialize app and set mounted
    setIsMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
