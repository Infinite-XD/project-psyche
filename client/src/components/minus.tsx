import React from 'react';
import { Minus } from 'lucide-react';
import { useMood } from '../lib/stores/useMood';

export function MinusButton() {
  const mood = useMood((state) => state.mood);
  
  // Map 0-100 mood scale to labels
  const getMoodLabel = (): string => {
    if (mood <= 20) return "angry";
    if (mood <= 40) return "sad";
    if (mood <= 60) return "neutral";
    if (mood <= 80) return "calm";
    return "happy";
  };
  
  // Get accent color based on current mood
  const getMoodAccentColor = (): string => {
    const currentMood = getMoodLabel();
    
    switch (currentMood) {
      case "happy":
        return "#5CFF9E"; // sphereColor
      case "calm":
        return "#5C9EFF"; // sphereColor
      case "neutral":
        return "#FFDD5C"; // sphereColor
      case "sad":
        return "#FF9E5C"; // sphereColor
      case "angry":
        return "#FF5C5C"; // sphereColor
      default:
        return "#FFDD5C"; // Default to neutral
    }
  };

  const accentColor = getMoodAccentColor();
  
  return (
    <button
      className={`
        w-12 h-12 rounded-full
        flex items-center justify-center
        shadow-inner shadow-black/60
        ring-1 ring-white/10
        transition-all duration-200 ease-out
        hover:scale-110 hover:shadow-lg hover:ring-white/25
        active:scale-90 active:shadow-inner active:opacity-80
        relative
      `}
      style={{
        background: `linear-gradient(45deg, #000000 50%, ${accentColor}70)`,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.1)`
      }}
    >
      <Minus className="w-5 h-5 text-gray-100 drop-shadow-md" />
    </button>
  );
}