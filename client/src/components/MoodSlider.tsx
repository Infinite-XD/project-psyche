// MoodSlider.tsx
// useless

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const MoodSlider = ({ value, onChange }: MoodSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Get color based on mood value
  const getMoodColor = () => {
    if (value <= 20) return "#FF5C5C"; // terrible - red
    if (value <= 40) return "#FF9E5C"; // bad - orange
    if (value <= 60) return "#FFDD5C"; // neutral - yellow
    if (value <= 80) return "#5C9EFF"; // good - green
    return "#5CFF9E";               // great - blue
  };
  
  // Get background gradient based on mood
  const getGradient = () => {
    return `linear-gradient(90deg, #FF5C5C 0%, #FF9E5C 25%, #FFDD5C 50%, #5CFF9E 75%, #5C9EFF 100%)`;
  };

  // Handle click on slider
  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    onChange(percentage);
  };

  // Handle drag on slider
  const handleDrag = (_: any, info: { offset: { x: number } }) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((info.offset.x + rect.width / 2) / rect.width) * 100));
    
    onChange(percentage);
  };

  return (
    <div className="mood-slider-container">
      <div 
        ref={sliderRef}
        className="mood-slider-track"
        onClick={handleSliderClick}
        style={{ background: getGradient() }}
      >
        <motion.div 
          className="mood-slider-progress"
          style={{ 
            width: `${value}%`,
          }}
        />
        
        <motion.div 
          className="mood-slider-handle"
          drag="x"
          dragConstraints={sliderRef}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          style={{ 
            left: `${value}%`,
            backgroundColor: getMoodColor(),
            boxShadow: `0 0 15px ${getMoodColor()}`,
          }}
          whileTap={{ scale: 1.2 }}
          whileHover={{ scale: 1.1 }}
        />
      </div>
    </div>
  );
};

export default MoodSlider;
