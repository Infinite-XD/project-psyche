import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from "../components/Navigation";

type MoodEntry = {
  id: number;
  value: number;
  createdAt: string;
};

const MoodHistory: React.FC = () => {
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/moods');
      if (res.status === 401) return navigate('/login');
      const data = await res.json();
      setHistory(data.history);
    })();
  }, [navigate]);

  if (!history.length) {
    return <p className="p-4 text-gray-400">No moods recorded yet.</p>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Your Mood History</h1>
      <ul className="space-y-2">
        {history.map((entry) => (
          <li
            key={entry.id}
            className="flex justify-between bg-neutral-950 p-4 rounded-lg"
          >
            <span>{new Date(entry.createdAt).toLocaleString()}</span>
            <span className="font-bold">{entry.value}</span>
          </li>
        ))}
      </ul>

        {/* Navigation bar */}
        <div className="fixed inset-x-0 bottom-0 bg-black">
          <Navigation />
        </div>
    </div>
  );
};

export default MoodHistory;
