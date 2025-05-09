// Moodtracker.tsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMood } from "../lib/stores/useMood";



const moodLabels = ["Terrible", "Bad", "Meh", "Good", "Great"];

const MoodTracker: React.FC = () => {
  const { mood, setMood } = useMood();
  const [prompt, setPrompt] = useState("How are you feeling today?");
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  useEffect(() => {
    if (mood <= 20) setPrompt("I'm sorry to hear that. Would you like to talk about it?");
    else if (mood <= 40) setPrompt("Things will get better. What's bothering you?");
    else if (mood <= 60) setPrompt("Hope your day improves. Any plans for later?");
    else if (mood <= 80) setPrompt("Glad you're doing well! What's making you happy?");
    else setPrompt("Fantastic! Keep that positive energy flowing!");
  }, [mood]);

  const getMoodLabel = () => {
    const idx = Math.floor(mood / 20);
    return moodLabels[Math.min(idx, moodLabels.length - 1)];
  };

  const getMoodColor = () => {
    if (mood <= 20) return "#FF5C5C"; // terrible - red
    if (mood <= 40) return "#FF9E5C"; // bad - orange
    if (mood <= 60) return "#FFDD5C"; // neutral - yellow
    if (mood <= 80) return "#5C9EFF"; // good - green
    return "#5CFF9E";               // great - blue
  };

  const handleSaveMood = () => {
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 2000);
  };

  return (
    <div className="flex items-center justify-center bg-black p-4">
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* ... all your JSX stays largely the same, just
             swap Math.random() keys for `bar-${i}` and
             ensure the slider below is typed properly */}
      <motion.div
          className="bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Futuristic Header */}
          <div className="relative h-32">
            {/* Visualizer bars */}
            <div className="absolute inset-0 flex items-end justify-center space-x-1 px-8 opacity-30">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-gray-400"
                  initial={{ height: 0 }}
                  animate={{ 
                    height: Math.random() * 40 + 10,
                    backgroundColor: getMoodColor()
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.05
                  }}
                />
              ))}
            </div>
            
            {/* Overlay with glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-80" />
            
            <div className="relative flex flex-col h-full px-6 pt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white tracking-wider">MOOD TRACKER</h2>
                <div className="h-4 w-4 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getMoodColor() }} />
                </div>
              </div>
              
              <div className="mt-2 flex items-center">
                <div 
                  className="h-1 flex-grow"
                  style={{ 
                    background: `linear-gradient(90deg, ${getMoodColor()} 0%, transparent 100%)`,
                  }}
                />
              </div>
              
              <div className="mt-auto pb-4 flex items-center justify-between">
                <motion.div
                  key={getMoodLabel()}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center"
                >
                  <div className="text-xl font-bold" style={{ color: getMoodColor() }}>{getMoodLabel()}</div>
                </motion.div>
                
                <motion.div
                  className="text-xl font-bold text-gray-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={Math.round(mood)}
                >
                  {Math.round(mood)}
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Main Content Section */}
          <div className="p-6 bg-black">
            {/* New Futuristic Slider */}
            <div className="mb-8">
            <FuturisticSlider value={mood} onChange={setMood} color={getMoodColor()} />
            </div>
            
            {/* Prompt Card */}
            <motion.div
              className="bg-neutral-950 rounded-lg p-4 mb-6 border-l-2 border-r-2"
              style={{ borderColor: getMoodColor() }}
              key={prompt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-300 text-sm">{prompt}</p>
            </motion.div>
            
            {/* Save Button */}
            <div className="relative">
              <motion.button
                className="w-full py-3 px-4 rounded-lg font-medium text-white bg-neutral-950 border border-gray-800 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={handleSaveMood}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ background: getMoodColor() }}
                />
                <span>Save Mood</span>
              </motion.button>
              
              {/* Save Confirmation */}
              <AnimatePresence>
                {showSaveConfirmation && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                    >
                      <div className="flex items-center text-white">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: getMoodColor() }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Entry Recorded</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
        </motion.div>
        {/* … */}
      </motion.div>
    </div>
  );
};


interface FuturisticSliderProps {
  value: number;
  onChange: (value: number) => void;
  color: string;
}

const FuturisticSlider: React.FC<FuturisticSliderProps> = ({ value, onChange, color }) => {
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);

  // Compute new mood % based on pointer X
  const calculateValue = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    onChange(Math.max(0, Math.min(100, pct)));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // capture further pointer events until up
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    calculateValue(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragging) {
      calculateValue(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="py-4">
      <div
        ref={sliderRef}
        className="relative h-12 touch-none cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Tick marks */}
        <div className="absolute inset-0 flex justify-between">
          {[...Array(25)].map((_, i) => (
            <div key={`line-${i}`} className="h-full w-px bg-neutral-950" />
          ))}
        </div>
        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-800 -translate-y-1/2" />
        {/* Indicator */}
        <motion.div
          className="absolute top-0 bottom-0 w-px"
          style={{ left: `${value}%`, backgroundColor: color }}
          animate={{ left: `${value}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        {/* Filled track */}
        <motion.div
          className="absolute top-1/2 h-px -translate-y-1/2"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, transparent 0%, ${color} 100%)`,
            boxShadow: `0 0 10px ${color}`,
          }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        {/* Labels */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-500">
          {[0, 25, 50, 75, 100].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;