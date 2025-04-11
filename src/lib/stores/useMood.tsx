import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface MoodState {
  mood: number; // 0-100 scale
  setMood: (value: number) => void;
  moodHistory: Array<{ timestamp: Date; value: number }>;
  addMoodHistory: () => void;
}

export const useMood = create<MoodState>()(
  subscribeWithSelector((set, get) => ({
    mood: 50, // Default neutral mood
    moodHistory: [],
    
    setMood: (value) => {
      set({ mood: value });
    },
    
    addMoodHistory: () => {
      const { mood, moodHistory } = get();
      
      set({
        moodHistory: [
          ...moodHistory,
          { timestamp: new Date(), value: mood }
        ]
      });
    }
  }))
);
