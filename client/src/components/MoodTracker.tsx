import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MoodSlider from "./MoodSlider";
import { useMood } from "../lib/stores/useMood";

const moodLabels = [
  "Terrible", 
  "Bad", 
  "Meh", 
  "Good", 
  "Great"
];

const MoodTracker = () => {
  const { mood, setMood } = useMood();
  const [prompt, setPrompt] = useState("How are you feeling today?");
  
  useEffect(() => {
    // Update prompt based on mood
    if (mood <= 20) {
      setPrompt("I'm sorry to hear that. Would you like to talk about it?");
    } else if (mood <= 40) {
      setPrompt("Things will get better. What's bothering you?");
    } else if (mood <= 60) {
      setPrompt("Hope your day improves. Any plans for later?");
    } else if (mood <= 80) {
      setPrompt("Glad you're doing well! What's making you happy?");
    } else {
      setPrompt("Fantastic! Keep that positive energy flowing!");
    }
  }, [mood]);

  // Get current mood label
  const getMoodLabel = () => {
    const index = Math.floor(mood / 20);
    return moodLabels[Math.min(index, moodLabels.length - 1)];
  };

  return (
    <motion.div 
      className="mood-tracker"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div 
        className="mood-card"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h2 className="mood-title">Your Mood</h2>
        
        <div className="mood-value-container">
          <motion.div 
            className="mood-label"
            key={getMoodLabel()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {getMoodLabel()}
          </motion.div>
          
          <MoodSlider
            value={mood}
            onChange={(value) => setMood(value)}
          />
        </div>
        
        <motion.p 
          className="mood-prompt"
          key={prompt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {prompt}
        </motion.p>
        
        <motion.button 
          className="mood-save-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Save Mood
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default MoodTracker;
