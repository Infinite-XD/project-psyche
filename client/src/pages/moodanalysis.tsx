import React, { useEffect, useState, useMemo, useRef } from 'react';
import dayjs from 'dayjs';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import Navigation from "../components/Navigation";
import MascotIcon from '../components/MascotIcon';
import { Link } from "react-router-dom";

// Types
interface MoodEntry { id: number; value: number; createdAt: string; }
interface MoodByDay { date: string; avgMood: number; count: number; }
interface DistributionBucket { start: number; label: string; count: number; }
interface Insights { avg: number; high: number; low: number; stdDev: number; trend: { icon: string; label: string; }; total: number; }

type Tab = 'trends' | 'stats' | 'entries';

// Constants
const BUCKET_SIZE = 10;
const COLORS = {
  low:     '#BE123C',  // rose-700
  med:     '#B45309',  // amber-700
  high:    '#047857',  // emerald-700
  primary: '#7a7a7a',  // blue-700
  accent:  '#6D28D9'   // violet-700
};

// Utility: color by value
const getColorFor = (val: number) => val <= 33 ? COLORS.low : val <= 66 ? COLORS.med : COLORS.high;

// Gradient backgrounds for cards
const gradients = {
  card: 'bg-gradient-to-br from-black to-neutral-900',
  accent: 'bg-gradient-to-r from-gray-800 to-black shadow-lg shadow-black/20 hover:shadow-black/40 transition-all'
};

// Fetcher hook
const useMoodHistory = () => {
  const [data, setData] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/moods');
        if (res.status === 401) throw new Error('Unauthorized');
        setData((await res.json()).history);
      } catch {
        console.error('Failed to load moods');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading };
};
// Calculations
const computeDaily = (entries: MoodEntry[]): MoodByDay[] => {
  const grouped: Record<string, { sum: number; count: number }> = {};
  entries.forEach(({ value, createdAt }) => {
    const date = dayjs(createdAt).format('YYYY-MM-DD');
    grouped[date] = grouped[date] || { sum: 0, count: 0 };
    grouped[date].sum += value;
    grouped[date].count += 1;
  });
  return Object.entries(grouped).map(([date, { sum, count }]) => ({ date, avgMood: +(sum / count).toFixed(1), count }));
};

const computeDistribution = (entries: MoodEntry[]): DistributionBucket[] => {
  const buckets: DistributionBucket[] = [];
  for (let start = 1; start <= 100; start += BUCKET_SIZE) {
    buckets.push({ start, label: `${start}-${start + BUCKET_SIZE - 1}`, count: 0 });
  }
  
  // Guard against empty entries
  if (!entries || entries.length === 0) {
    return buckets;
  }
  
  entries.forEach(({ value }) => {
    // Ensure value is within valid range (1-100)
    if (value >= 1 && value <= 100) {
      const idx = Math.floor((value - 1) / BUCKET_SIZE);
      // Make sure the index is valid before accessing
      if (idx >= 0 && idx < buckets.length) {
        buckets[idx].count++;
      }
    }
  });
  return buckets;
};

const computeInsights = (entries: MoodEntry[]): Insights => {
  // Guard against empty entries
  if (!entries || entries.length === 0) {
    return {
      avg: 0,
      high: 0,
      low: 0,
      stdDev: 0,
      trend: { icon: '→', label: 'No data' },
      total: 0
    };
  }
  
  const values = entries.map(e => e.value);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = +(sum / values.length).toFixed(1);
  const high = Math.max(...values);
  const low = Math.min(...values);
  const variance = values.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / values.length;
  const stdDev = +Math.sqrt(variance).toFixed(1);

  // Handle case with few entries
  if (values.length < 2) {
    return { avg, high, low, stdDev, trend: { icon: '→', label: 'New' }, total: entries.length };
  }

  const recent = [...entries]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, Math.min(5, entries.length))
    .map(e => e.value);
    
  const trendVal = recent[0] - recent[recent.length - 1];
  const trend = trendVal > 5 ? { icon: '↗️', label: 'Improving' }
    : trendVal < -5 ? { icon: '↘️', label: 'Declining' }
    : { icon: '→', label: 'Stable' };

  return { avg, high, low, stdDev, trend, total: entries.length };
};

// Presentational components
const Loading = () => (
  <div className="flex items-center justify-center h-64">
    <div className="h-12 w-12 relative">
      <div className="animate-ping absolute inset-0 rounded-full bg-blue-400 opacity-75"></div>
      <div className="relative rounded-full h-12 w-12 bg-blue-500 opacity-90 animate-pulse"></div>
    </div>
  </div>
);

const NoData = () => (
  <div className="h-64 flex flex-col items-center justify-center">
    <div className="relative mb-6">
        <div className="flex justify-center pt-3 pb-2">
            <div className="animate-bounce-slow scale-75">
                <MascotIcon />
            </div>
        </div>
    </div>
    <h2 className="text-lg font-medium mb-2 text-white">No mood entries yet</h2>
    <p className="text-gray-400 text-sm mb-4">Start tracking how you feel on the homepage</p>
    <Link to="/">
    <button
      className="
        mt-2
        bg-gradient-to-r from-gray-800 to-black
        px-6 py-2.5
        rounded-lg
        text-sm font-medium text-white
        shadow-lg shadow-black/20
        hover:shadow-black/40
        transition-all
      ">
      Add First Entry
    </button>
    </Link>
  </div>
);

const TabButton: React.FC<{active: boolean; onClick: () => void; label: string}> = ({ active, onClick, label }) => (
  <button 
    onClick={onClick} 
    className={`py-2 px-4 font-medium transition-all duration-300 relative ${
      active ? 'text-white' : 'text-gray-500 hover:text-gray-300'
    }`}
  >
    {label}
    {active && (
    <span
      className="
        absolute bottom-0 left-0 
        w-full 
        h-1                            /* nice thick bar */
        bg-gradient-to-r 
          from-gray-700                 /* bright start */
          via-gray-400                  /* very light mid */
          to-gray-700                   /* bright end */
        opacity-95                      /* almost solid */
        shadow-lg                       /* strong shadow */
        shadow-white/50                 /* white glow at 50% opacity */
        transition-all
      "
    ></span>



    )}
  </button>
);

// Chart wrappers
const LineGraph: React.FC<{ data: any[]; dataKey: string; xKey: string; title?: string; height?: number; formatter?: (v: string) => string }> = 
  ({ data, dataKey, xKey, title, height = 220, formatter }) => (
  <div className={`${gradients.card} p-5 rounded-xl border border-neutral-800/50 shadow-xl`}>
  {title && (
    <h3 className="text-lg mb-4 font-medium text-white flex items-center">
      <span
        className="
          h-3 w-3 rounded-full
          bg-gradient-to-r 
            from-gray-700                 /* bright start */
            via-gray-400                  /* very light mid */
            to-gray-700                   /* bright end */
          opacity-95                      /* almost solid */
          shadow-lg                       /* strong shadow */
          shadow-white/50                 /* white glow at 50% opacity */
          transition-all
          mr-3
        "
      />
      {title}
    </h3>
  )}
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} opacity={0.5} />
        <XAxis dataKey={xKey} stroke="#666" tick={{ fill: '#999' }} tickFormatter={formatter} />
        <YAxis domain={[0, 100]} stroke="#666" tick={{ fill: '#999' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', borderRadius: 8, border: '1px solid #333', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} 
        />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={COLORS.primary} 
          strokeWidth={3}
          dot={{ r: 4, fill: COLORS.primary, stroke: '#000', strokeWidth: 2 }} 
          activeDot={{ r: 6, fill: '#fff', stroke: COLORS.primary, strokeWidth: 2 }}
          fill="url(#colorMood)"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const BarGraph: React.FC<{ buckets: DistributionBucket[] }> = ({ buckets }) => (
  <div className={`${gradients.card} p-5 rounded-xl border border-neutral-800/50 shadow-xl`}>
    <h3 className="text-lg mb-4 font-medium text-white flex items-center"><span className="h-3 w-3 rounded-full bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 opacity-95 shadow-lg shadow-white/50 mr-2"></span>Distribution</h3>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={buckets} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} opacity={0.5} />
        <XAxis dataKey="label" stroke="#666" tick={{ fill: '#999' }} />
        <YAxis stroke="#666" tick={{ fill: '#999' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', borderRadius: 8, border: '1px solid #333', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} 
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {buckets.map((b, i) => (
            <Cell 
              key={i} 
              fill={getColorFor(b.start)} 
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const InsightsPanel: React.FC<{ insights: Insights }> = ({ insights }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className={`${gradients.card} p-5 rounded-xl border border-neutral-800/50 shadow-xl flex flex-col`}>
      <p className="text-sm text-gray-400 mb-1">Average</p>
      <div className="flex items-center mt-auto">
        <span className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">{insights.avg}</span>
        <span className="ml-1 text-lg opacity-40">/100</span>
      </div>
    </div>
    <div className={`${gradients.card} p-5 rounded-xl border border-neutral-800/50 shadow-xl flex flex-col`}>
      <p className="text-sm text-gray-400 mb-1">Trend</p>
      <div className="flex items-center mt-auto">
        <span className="text-xl mr-1">{insights.trend.icon}</span>
        <span className="text-lg font-medium text-white">{insights.trend.label}</span>
      </div>
    </div>
    <div className={`${gradients.card} p-5 rounded-xl border border-neutral-800/50 shadow-xl flex flex-col`}>
      <p className="text-sm text-gray-400 mb-1">Highest</p>
      <div className="flex items-center mt-auto">
        <span className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">{insights.high}</span>
        <span className="ml-1 text-lg opacity-40">/100</span>
      </div>
    </div>
    <div className={`${gradients.card} p-5 rounded-xl border border-neutral-800/50 shadow-xl flex flex-col`}>
      <p className="text-sm text-gray-400 mb-1">Lowest</p>
      <div className="flex items-center mt-auto">
        <span className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">{insights.low}</span>
        <span className="ml-1 text-lg opacity-40">/100</span>
      </div>
    </div>
  </div>
);

// Main Component
export default function MoodHistory() {
  // 1️⃣ Data-loading hook
  const { data: history, loading } = useMoodHistory();

  // 2️⃣ Tab state
  const [tab, setTab] = useState<Tab>('trends');

  // 3️⃣ Derived data
  const daily   = useMemo(() => computeDaily(history), [history]);
  const weekly  = useMemo(() => daily.slice(-7), [daily]);
  const buckets = useMemo(() => computeDistribution(history || []), [history]);
  const insights = useMemo(
    () => history.length ? computeInsights(history) : null,
    [history]
  );

  // 4️⃣ Your new nav-visibility state + timer ref
  const [navVisible, setNavVisible] = useState(true);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  // 5️⃣ scheduleHide helper
  const scheduleHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setNavVisible(false), 2000);
  };

  // ─────────────────────────────────────────────────────────────
  // 6️⃣ Add this useEffect _right here_:
  useEffect(() => {
    const handleActivity = () => {
      setNavVisible(true);
      scheduleHide();
    };

    // page scroll
    window.addEventListener('scroll', handleActivity, { passive: true });

    // desktop
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);

    // mobile
    window.addEventListener('touchstart', handleActivity);

    // kick off hide countdown
    scheduleHide();

    return () => {
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);
  // ─────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Loading />
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <div className="flex-1 overflow-y-auto p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white tracking-wider">Mood Analyser</h2>
        </div>

        {!history.length ? <NoData /> : (
          <div>
            <div className="flex border-b border-neutral-800/50 mb-8">
              <TabButton active={tab==='trends'} onClick={() => setTab('trends')} label="Trends" />
              <TabButton active={tab==='stats'} onClick={() => setTab('stats')} label="Statistics" />
              <TabButton active={tab==='entries'} onClick={() => setTab('entries')} label="Entries" />
            </div>

            {tab === 'trends' && (
              <div className="space-y-6">
                {insights && <InsightsPanel insights={insights} />}
                <LineGraph 
                  data={weekly} 
                  dataKey="avgMood" 
                  xKey="date" 
                  title="Weekly Trend" 
                  formatter={d => dayjs(d).format('DD MMM')} 
                />
              </div>
            )}

            {tab === 'stats' && (
              <div className="space-y-6">
                <BarGraph buckets={buckets} />
                {insights && (
                  <div className={`${gradients.card} p-5 rounded-xl border border-neutral-800/50 shadow-xl`}>
                    <h3 className="text-lg mb-4 font-medium text-white flex items-center">
                      <span className="h-3 w-3 rounded-full bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 opacity-95 shadow-lg shadow-white/50 mr-2"></span>
                      Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Total Entries</p>
                        <p className="text-2xl font-medium">{insights.total}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Average</p>
                        <p className="text-2xl font-medium">{insights.avg}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Highest</p>
                        <p className="text-2xl font-medium">{insights.high}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Lowest</p>
                        <p className="text-2xl font-medium">{insights.low}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'entries' && (
              <div className={`${gradients.card} rounded-xl border border-neutral-800/50 shadow-xl overflow-hidden`}>
                <div className="p-4 border-b border-neutral-800/50 flex justify-between items-center">
                  <h3 className="font-medium flex items-center">
                    <span className="h-3 w-3 rounded-full bg-gradient-to-r from-black to-gray-500 shadow-lg shadow-black/20 transition-all mr-2"></span>
                    All Entries
                  </h3>
                  <div className="text-sm text-gray-400">{history.length} entries</div>
                </div>
                <ul className="divide-y divide-neutral-800/50">
                  {history.sort((a,b)=>+new Date(b.createdAt)-+new Date(a.createdAt)).map(e => (
                    <li 
                      key={e.id} 
                      className="flex justify-between items-center p-4 hover:bg-neutral-800/10 transition-colors"
                    >
                      <span className="text-sm">{dayjs(e.createdAt).format('DD MMM YYYY, HH:mm')}</span>
                      <div className="flex items-center">
                        <span 
                          className="px-3 py-1 rounded-full text-sm font-medium" 
                          style={{ 
                            background: getColorFor(e.value) + '15', 
                            color: getColorFor(e.value) 
                          }}
                        >
                          {e.value}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0">
        <div
          className={`
            bg-black
            transform transition-transform duration-300
            ${navVisible ? 'translate-y-0' : 'translate-y-full'}
          `}
        >
          <Navigation />
        </div>
      </div>
      </div>
    </div>
  );
}